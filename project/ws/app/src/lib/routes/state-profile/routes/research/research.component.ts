import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { OrgProfileService } from '../../services/org-profile.service'
import { MatDialog, MatSnackBar } from '@angular/material'
/* tslint:disable*/
import _ from 'lodash'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { Router } from '@angular/router'
import { DialogConfirmComponent } from '../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'
import { DialogBoxComponent } from '../../components/dialog-box/dialog-box.component'

@Component({
    selector: 'ws-app-research',
    templateUrl: './research.component.html',
    styleUrls: ['./research.component.scss'],
    /* tslint:disable */
    host: { class: 'w-full role-card flex flex-1' },
    /* tslint:enable */
})
export class ResearchComponent implements OnInit {
    @ViewChild('deleteProgramTitleRef', { static: true })
    deleteProgramTitleRef: ElementRef | null = null
    @ViewChild('deleteProgramBodyRef', { static: true })
    deleteProgramBodyRef: ElementRef | null = null
    @ViewChild('deletePaperTitleRef', { static: true })
    deletePaperTitleRef: ElementRef | null = null
    @ViewChild('deletePaperBodyRef', { static: true })
    deletePaperBodyRef: ElementRef | null = null
    researchProgramForm!: FormGroup
    researchPaperForm!: FormGroup
    addedPrograms: any[] = []
    addedPapers: any[] = []
    editProgramValue: any
    editPaperValue: any
    textBoxActive = false
    textBoxActive1 = false
    isResearch = false

    constructor(
        private orgSvc: OrgProfileService,
        private snackBar: MatSnackBar,
        private configSvc: ConfigurationsService,
        private router: Router,
        private dialog: MatDialog,
    ) {
        this.researchProgramForm = new FormGroup({
            projectName: new FormControl('', []),
            programeStatus: new FormControl('Ongoing', [Validators.required]),
            industrySponsored: new FormControl(true, [Validators.required]),
            govtSponsored: new FormControl(false, [Validators.required]),
            otherSponsored: new FormControl(false, [Validators.required]),
            projectDetail: new FormControl('', []),
        })

        this.researchPaperForm = new FormGroup({
            researchPaperName: new FormControl('', []),
            researchPaperDetail: new FormControl('', []),
        })
        // setting this to true so that form validation is not required based on number added projects or papers
        this.orgSvc.updateFormStatus('research', true)

    }

    ngOnInit() {
        // pre poluate form fields when data is available (edit mode)
        if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.orgProfile) {
            const researchData = _.get(this.configSvc.unMappedUser.orgProfile, 'profileDetails.research')
            this.addedPapers = _.get(researchData, 'researchPapers') || []
            this.addedPrograms = _.get(researchData, 'researchPrograms') || []
            this.updateValuesToStore()
            // this.orgSvc.updateFormStatus('research', (this.addedPapers.length > 0 && this.addedPrograms.length > 0))
            this.orgSvc.updateFormStatus('research', true)
        }

        // if Roles and functions tab has "Research" checked then check for atleast 1 prject
        let rolesAndFunctions: any
        if (JSON.stringify(this.orgSvc.formValues.rolesAndFunctions) === '{}') {
            rolesAndFunctions = _.get(this.configSvc.unMappedUser.orgProfile, 'profileDetails.rolesAndFunctions')
        } else {
            rolesAndFunctions = _.get(this.orgSvc.formValues, 'rolesAndFunctions')
        }
        if (rolesAndFunctions && rolesAndFunctions.research) {
            this.isResearch = true
            // this.removeValidators()
            this.orgSvc.updateFormStatus('research', (this.addedPrograms.length > 0))
        }
    }

    addProgram() {
        if (!this.editProgramValue) {
            if (
                // tslint:disable-next-line: no-non-null-assertion
                this.researchProgramForm!.get('projectName')!.value && this.researchProgramForm!.get('programeStatus')!.value &&
                // tslint:disable-next-line: no-non-null-assertion
                (this.researchProgramForm!.get('industrySponsored')!.value || this.researchProgramForm!.get('govtSponsored')!.value
                    // tslint:disable-next-line: no-non-null-assertion
                    || this.researchProgramForm!.get('otherSponsored')!.value
                )
            ) {
                this.addedPrograms.push(this.researchProgramForm.value)
                this.resetProgramForm()
                this.updateValuesToStore()
            } else {
                this.snackBar.open('Project name, program status, sponsers type are required')
            }
        } else {
            if (this.configSvc.userProfile && this.configSvc.unMappedUser.profileDetails) {
                _.each(this.addedPrograms, r => {
                    if (r.projectName === this.editProgramValue.projectName) {
                        // tslint:disable-next-line
                        r.projectName = this.researchProgramForm.get('projectName')!.value,
                            // tslint:disable-next-line: no-non-null-assertion
                            r.programeStatus = this.researchProgramForm.get('programeStatus')!.value
                        // tslint:disable-next-line: no-non-null-assertion
                        r.industrySponsored = this.researchProgramForm.get('industrySponsored')!.value
                        // tslint:disable-next-line: no-non-null-assertion
                        r.govtSponsored = this.researchProgramForm.get('govtSponsored')!.value
                        // tslint:disable-next-line: no-non-null-assertion
                        r.otherSponsored = this.researchProgramForm.get('otherSponsored')!.value
                        // tslint:disable-next-line: no-non-null-assertion
                        r.projectDetail = this.researchProgramForm.get('projectDetail')!.value
                    }
                })
                this.resetProgramForm()
                this.snackBar.open('Updated successfully')
                this.editProgramValue = undefined
                this.updateValuesToStore()
            }
        }

    }

    editProgram(program: any) {
        if (program) {
            this.editProgramValue = program
            this.researchProgramForm.patchValue({
                projectName: program.projectName,
                programeStatus: program.programeStatus,
                industrySponsored: program.industrySponsored,
                govtSponsored: program.govtSponsored,
                otherSponsored: program.otherSponsored,
                projectDetail: program.projectDetail,
            })
            this.researchProgramForm.updateValueAndValidity()
            this.textBoxActive = true
            this.router.navigate(['app', 'setup', 'research'], { fragment: 'maindiv' })
            this.updateValuesToStore()
        }
    }

    deleteProgram(program: any) {
        if (program) {
            const dialogRef = this.dialog.open(DialogConfirmComponent, {
                data: {
                    title: (this.deleteProgramTitleRef && this.deleteProgramTitleRef.nativeElement.value) || '',
                    body: (this.deleteProgramBodyRef && this.deleteProgramBodyRef.nativeElement.value) || '',
                },
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    const delIdx = _.findIndex(this.addedPrograms, { projectName: program.projectName })
                    this.addedPrograms.splice(delIdx, 1)
                    this.updateValuesToStore()
                }
            })
        }
    }

    addPaper() {
        if (!this.editPaperValue) {
            if (
                // tslint:disable-next-line: no-non-null-assertion
                this.researchPaperForm!.get('researchPaperName')!.value
            ) {
                this.addedPapers.push(this.researchPaperForm.value)
                this.resetPaperForm()
                this.updateValuesToStore()
            } else {
                this.snackBar.open('Research paper name is required')
            }
        } else {
            if (this.configSvc.userProfile && this.configSvc.unMappedUser.profileDetails) {
                _.each(this.addedPapers, r => {
                    if (r.researchPaperName === this.editPaperValue.researchPaperName) {
                        // tslint:disable-next-line
                        r.researchPaperName = this.researchPaperForm.get('researchPaperName')!.value,
                            // tslint:disable-next-line: no-non-null-assertion
                            r.researchPaperDetail = this.researchPaperForm.get('researchPaperDetail')!.value
                    }
                })
                this.resetPaperForm()
                this.snackBar.open('Updated successfully')
                this.editPaperValue = undefined
                this.updateValuesToStore()
            }
        }
    }

    editPaper(paper: any) {
        if (paper) {
            this.editPaperValue = paper
            this.researchPaperForm.patchValue({
                researchPaperName: paper.researchPaperName,
                researchPaperDetail: paper.researchPaperDetail,
            })
            this.researchPaperForm.updateValueAndValidity()
            this.textBoxActive1 = true
            this.router.navigate(['app', 'setup', 'research'], { fragment: 'maindiv1' })
            this.updateValuesToStore()
        }
    }

    deletePaper(paper: any) {
        if (paper) {
            const dialogRef = this.dialog.open(DialogConfirmComponent, {
                data: {
                    title: (this.deletePaperTitleRef && this.deletePaperTitleRef.nativeElement.value) || '',
                    body: (this.deletePaperBodyRef && this.deletePaperBodyRef.nativeElement.value) || '',
                },
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    const delIdx = _.findIndex(this.addedPapers, { researchPaperName: paper.researchPaperName })
                    this.addedPapers.splice(delIdx, 1)
                    this.updateValuesToStore()
                }
            })
        }
    }

    resetProgramForm() {
        this.researchProgramForm.reset()
        this.researchProgramForm.patchValue({
            // projectName
            programeStatus: 'Ongoing',
            industrySponsored: true,
            govtSponsored: false,
            otherSponsored: false,
        })
        this.researchProgramForm.updateValueAndValidity()
    }

    resetPaperForm() {
        this.researchPaperForm.reset()
        this.researchPaperForm.updateValueAndValidity()
    }

    updateValuesToStore() {
        // update local store data
        const localData = {
            researchPrograms: this.addedPrograms,
            researchPapers: this.addedPapers,
        }
        this.orgSvc.updateLocalFormValue('research', localData)
        if (this.isResearch) {
            // tslint:disable-next-line: max-line-length
            this.orgSvc.updateFormStatus('research', (this.addedPrograms.length > 0))
        } else {
            this.orgSvc.updateFormStatus('research', true)
        }

        // this.orgSvc.updateFormStatus('research', (this.addedPapers.length > 0 && this.addedPrograms.length > 0))
    }

    openActivityDialog() {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            data: {
                view: 'research',
            },
            hasBackdrop: false,
            width: '550px',

        })
        dialogRef.afterClosed().subscribe(_result => {

        })
    }
}
