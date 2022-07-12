import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { OrgProfileService } from '../../services/org-profile.service'
import { ConfigurationsService } from '@sunbird-cb/utils'
/* tslint:disable*/
import _ from 'lodash'
import { Router } from '@angular/router'
import { DialogConfirmComponent } from '../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'
import { MatDialog, MatSnackBar } from '@angular/material'
import { DialogBoxComponent } from '../../components/dialog-box/dialog-box.component'

@Component({
    selector: 'ws-app-consultancy',
    templateUrl: './consultancy.component.html',
    styleUrls: ['./consultancy.component.scss'],
    /* tslint:disable */
    host: { class: 'w-full role-card flex flex-1' },
    /* tslint:enable */
})
export class ConsultancyComponent implements OnInit {
    consultancyForm!: FormGroup
    addedconsultancies: any[] = []
    @ViewChild('deleteTitleRef', { static: true })
    deleteTitleRef: ElementRef | null = null
    @ViewChild('deleteBodyRef', { static: true })
    deleteBodyRef: ElementRef | null = null
    editValue: any
    textBoxActive = false
    isConsultancy = false

    constructor(
        private orgSvc: OrgProfileService,
        private configSvc: ConfigurationsService,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
    ) {
        this.consultancyForm = new FormGroup({
            projectName: new FormControl('', [Validators.required]),
            programeStatus: new FormControl('Ongoing', [Validators.required]),
            industrySponsored: new FormControl(true, [Validators.required]),
            govtSponsored: new FormControl('', [Validators.required]),
            otherSponsored: new FormControl('', [Validators.required]),
            projectDetail: new FormControl('', [Validators.required]),
        })

        // If projects are added then only validation is required, so by default validation is true, so that user can go to next tab
        this.orgSvc.updateFormStatus('consultancy', true)

    }

    ngOnInit() {
        // pre poluate form fields when data is available (edit mode)
        if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.orgProfile) {
            const consultancyData = _.get(this.configSvc.unMappedUser.orgProfile, 'profileDetails.consultancy')
            this.addedconsultancies = _.get(consultancyData, 'projects') || []
            this.orgSvc.updateFormStatus('consultancy', true)
        }

        // if Roles and functions tab has "Research" checked then check for atleast 1 prject
        let rolesAndFunctions: any
        if (JSON.stringify(this.orgSvc.formValues.rolesAndFunctions) === '{}') {
            rolesAndFunctions = _.get(this.configSvc.unMappedUser.orgProfile, 'profileDetails.rolesAndFunctions')
        } else {
            rolesAndFunctions = _.get(this.orgSvc.formValues, 'rolesAndFunctions')
        }
        if (rolesAndFunctions && rolesAndFunctions.consultancy) {
            this.isConsultancy = true
            // this.removeValidators()
            this.orgSvc.updateFormStatus('consultancy', (this.addedconsultancies.length > 0))
        }
    }

    addProject() {
        if (!this.editValue) {
            if (
                // tslint:disable-next-line: no-non-null-assertion
                this.consultancyForm!.get('projectName')!.value && this.consultancyForm!.get('programeStatus')!.value &&
                // tslint:disable-next-line: no-non-null-assertion
                (this.consultancyForm!.get('industrySponsored')!.value || this.consultancyForm!.get('govtSponsored')!.value
                    // tslint:disable-next-line: no-non-null-assertion
                    || this.consultancyForm!.get('otherSponsored')!.value
                )
            ) {
                this.addedconsultancies.push(this.consultancyForm.value)
                this.resetConsultancyForm()
                this.updateValuesToStore()
            } else {
                this.snackBar.open('Project name, program status, sponsers type are required')
            }
        } else {
            if (this.configSvc.userProfile && this.configSvc.unMappedUser.profileDetails) {
                _.each(this.addedconsultancies, r => {
                    if (r.projectName === this.editValue.projectName) {
                        // tslint:disable-next-line
                        r.projectName = this.consultancyForm.get('projectName')!.value,
                            // tslint:disable-next-line: no-non-null-assertion
                            r.programeStatus = this.consultancyForm.get('programeStatus')!.value
                        // tslint:disable-next-line: no-non-null-assertion
                        r.industrySponsored = this.consultancyForm.get('industrySponsored')!.value
                        // tslint:disable-next-line: no-non-null-assertion
                        r.govtSponsored = this.consultancyForm.get('govtSponsored')!.value
                        // tslint:disable-next-line: no-non-null-assertion
                        r.otherSponsored = this.consultancyForm.get('otherSponsored')!.value
                        // tslint:disable-next-line: no-non-null-assertion
                        r.projectDetail = this.consultancyForm.get('projectDetail')!.value
                    }
                })
                this.resetConsultancyForm()
                this.snackBar.open('Updated successfully')
                this.editValue = undefined
                this.updateValuesToStore()
            }
        }
    }

    editProject(project: any) {
        if (project) {
            this.editValue = project
            this.consultancyForm.patchValue({
                projectName: project.projectName,
                programeStatus: project.programeStatus,
                industrySponsored: project.industrySponsored,
                govtSponsored: project.govtSponsored,
                otherSponsored: project.otherSponsored,
                projectDetail: project.projectDetail,
            })
            this.consultancyForm.updateValueAndValidity()
            this.textBoxActive = true
            this.router.navigate(['app', 'setup', 'consultancy'], { fragment: 'maindiv' })
            this.updateValuesToStore()
        }
    }

    deleteProject(project: any) {
        if (project) {
            const dialogRef = this.dialog.open(DialogConfirmComponent, {
                data: {
                    title: (this.deleteTitleRef && this.deleteTitleRef.nativeElement.value) || '',
                    body: (this.deleteBodyRef && this.deleteBodyRef.nativeElement.value) || '',
                },
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    const delIdx = _.findIndex(this.addedconsultancies, { projectName: project.projectName })
                    this.addedconsultancies.splice(delIdx, 1)
                    this.updateValuesToStore()
                }
            })
        }
    }

    updateValuesToStore() {
        // update local store data
        const localData = {
            projects: this.addedconsultancies,
        }
        this.orgSvc.updateLocalFormValue('consultancy', localData)
        // this.orgSvc.updateFormStatus('consultancy', (this.addedconsultancies.length > 0))
        if (this.isConsultancy) {
            // tslint:disable-next-line: max-line-length
            this.orgSvc.updateFormStatus('consultancy', (this.addedconsultancies.length > 0))
        } else {
            this.orgSvc.updateFormStatus('consultancy', true)
        }
    }

    resetConsultancyForm() {
        this.consultancyForm.reset()
        this.consultancyForm.patchValue({
            // projectName
            programeStatus: 'Ongoing',
            industrySponsored: true,
            govtSponsored: false,
            otherSponsored: false,
        })
        this.consultancyForm.updateValueAndValidity()
    }

    openActivityDialog() {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            data: {
                view: 'consultancy',
            },
            hasBackdrop: false,
            width: '550px',

        })
        dialogRef.afterClosed().subscribe(_result => {

        })
    }
}
