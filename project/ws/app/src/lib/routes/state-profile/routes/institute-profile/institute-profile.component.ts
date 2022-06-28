import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatSnackBar } from '@angular/material'
import { Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
/* tslint:disable*/
import _ from 'lodash'
import { Subject } from 'rxjs'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { DialogConfirmComponent } from '../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'
import { OrgProfileService } from '../../services/org-profile.service'

@Component({
    selector: 'ws-app-institute-profile',
    templateUrl: './institute-profile.component.html',
    styleUrls: ['./institute-profile.component.scss'],
    /* tslint:disable */
    host: { class: 'w-full role-card flex flex-1' },
    /* tslint:enable */
})
export class InstituteProfileComponent implements OnInit {
    instituteProfileForm!: FormGroup
    attachedOrgForm!: FormGroup
    private unsubscribe = new Subject<void>()
    isButtonActive: any
    public countryCodes: string[] = []
    public stateNames: string[] = []
    phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
    pincodePattern = '(^[0-9]{6}$)'
    yearPattern = '(^[0-9]{4}$)'
    namePatern = `^[a-zA-Z\\s\\']{1,32}$`
    countryCodeList = ['+91', '+92', '+93', '+94', '+95']
    stateNameList = ['Delhi', 'Uttaranchal', 'Hariyana', 'Karnataka', 'Uttar Pradesh']
    editOrgValue: any
    addedOrgs: any[] = []
    @ViewChild('deleteTitleRef', { static: true })
    deleteTitleRef: ElementRef | null = null
    @ViewChild('deleteBodyRef', { static: true })
    deleteBodyRef: ElementRef | null = null
    textBoxActive = false
    constructor(
        private configSvc: ConfigurationsService,
        private orgSvc: OrgProfileService,
        private snackBar: MatSnackBar,
        private router: Router,
        private dialog: MatDialog,
    ) {
        this.instituteProfileForm = new FormGroup({
            instituteName: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
            fullAddress: new FormControl('', [Validators.required]),
            buildingNo: new FormControl('', []),
            stateName: new FormControl('', [Validators.required]),
            pincode: new FormControl('', [Validators.required, Validators.pattern(this.pincodePattern)]),
            establishmentYear: new FormControl('', [Validators.required]),
            stdCode: new FormControl('', [Validators.required]),
            telephoneNo: new FormControl('', [Validators.required]),
            countryCode: new FormControl('', [Validators.required]),
            mobile: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            website: new FormControl('', [Validators.required]),
        })

        this.attachedOrgForm = new FormGroup({
            trainingInstitute: new FormControl('', []),
            attachedTrainingInstitute: new FormControl(true, [Validators.required]),
            trainingInstituteDetail: new FormControl('', []),
        })

        // pre poluate form fields when data is available (edit mode)
        if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.orgProfile) {
            const instituteProfile = _.get(this.configSvc.unMappedUser.orgProfile, 'profileDetails.instituteProfile')
            this.instituteProfileForm.patchValue({
                instituteName: _.get(instituteProfile, 'instituteName'),
                fullAddress: _.get(instituteProfile, 'fullAddress'),
                buildingNo: _.get(instituteProfile, 'buildingNo'),
                stateName: _.get(instituteProfile, 'stateName'),
                pincode: _.get(instituteProfile, 'pincode'),
                establishmentYear: _.get(instituteProfile, 'establishmentYear'),
                stdCode: _.get(instituteProfile, 'stdCode'),
                telephoneNo: _.get(instituteProfile, 'telephoneNo'),
                mobile: _.get(instituteProfile, 'mobile'),
                email: _.get(instituteProfile, 'email'),
                website: _.get(instituteProfile, 'website'),
                trainingInstitute: _.get(instituteProfile, 'trainingInstitute'),
            })
            this.addedOrgs = _.get(instituteProfile, 'attachedOrgs')
        }

        this.instituteProfileForm.valueChanges
            .pipe(
                debounceTime(500),
                switchMap(async formValue => {
                    if (formValue) {
                        formValue.attachedOrgs = this.addedOrgs
                        this.orgSvc.updateLocalFormValue('instituteProfile', formValue)
                        this.orgSvc.updateFormStatus('instituteProfile', this.instituteProfileForm.valid)
                    }
                }),
                takeUntil(this.unsubscribe)
            ).subscribe()
    }

    ngOnInit() {

        this.countryCodes = this.countryCodeList
        this.stateNames = this.stateNameList
    }

    buttonSelect(_event: any) {
        this.isButtonActive = !this.isButtonActive
    }

    addOrg() {
        if (!this.editOrgValue) {
            // tslint:disable-next-line: no-non-null-assertion
            if (this.attachedOrgForm!.get('trainingInstitute')!.value) {
                const org = {
                    // tslint:disable-next-line: no-non-null-assertion
                    name: this.attachedOrgForm!.get('trainingInstitute')!.value || '',
                    // tslint:disable-next-line: no-non-null-assertion
                    // isAttachedInstitute: this.attachedOrgForm!.get('trainingInstitute')!.value || true,
                    // tslint:disable-next-line: no-non-null-assertion
                    trainingInstituteDetail: this.attachedOrgForm!.get('trainingInstituteDetail')!.value || '',
                }
                this.addedOrgs.push(org)
                this.attachedOrgForm.reset()
                // update local store data
                const formValue = this.instituteProfileForm.value
                formValue.attachedOrgs = this.addedOrgs
                this.orgSvc.updateLocalFormValue('instituteProfile', formValue)
                this.orgSvc.updateFormStatus('instituteProfile', this.instituteProfileForm.valid)
            } else {
                this.snackBar.open('Attached training institute or center name is required')
            }
        } else {
            if (this.configSvc.userProfile && this.configSvc.unMappedUser.profileDetails) {
                _.each(this.addedOrgs, r => {
                    if (r.name === this.editOrgValue.name) {
                        // tslint:disable-next-line
                        r.name = this.attachedOrgForm.get('trainingInstitute')!.value,
                            // tslint:disable-next-line: no-non-null-assertion
                            // r.isAttachedInstitute = this.attachedOrgForm!.get('trainingInstitute')!.value || true,
                            // tslint:disable-next-line: no-non-null-assertion
                            r.trainingInstituteDetail = this.attachedOrgForm!.get('trainingInstituteDetail')!.value || ''
                    }
                })
                this.attachedOrgForm.reset()
                // update local store data
                const formValue = this.instituteProfileForm.value
                formValue.attachedOrgs = this.addedOrgs
                this.orgSvc.updateLocalFormValue('instituteProfile', formValue)
                this.orgSvc.updateFormStatus('instituteProfile', this.instituteProfileForm.valid)
            }
        }
    }

    editOrg(org: any) {
        if (org) {
            this.editOrgValue = org
            this.attachedOrgForm.patchValue({
                trainingInstitute: org.name,
                // attachedTrainingInstitute: org.attachedTrainingInstitute,
                trainingInstituteDetail: org.trainingInstituteDetail,
            })
            this.attachedOrgForm.updateValueAndValidity()
            this.textBoxActive = true
            this.router.navigate(['app', 'setup', 'institute-profile'], { fragment: 'maindiv' })

            // update local store data
            const formValue = this.instituteProfileForm.value
            formValue.attachedOrgs = this.addedOrgs
            this.orgSvc.updateLocalFormValue('instituteProfile', formValue)
            this.orgSvc.updateFormStatus('instituteProfile', this.instituteProfileForm.valid)
        }
    }

    deleteOrg(org: any) {
        if (org) {
            const dialogRef = this.dialog.open(DialogConfirmComponent, {
                data: {
                    title: (this.deleteTitleRef && this.deleteTitleRef.nativeElement.value) || '',
                    body: (this.deleteBodyRef && this.deleteBodyRef.nativeElement.value) || '',
                },
            })
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    const delIdx = _.findIndex(this.addedOrgs, { name: org.name })
                    this.addedOrgs.splice(delIdx, 1)

                    // update local store data
                    const formValue = this.instituteProfileForm.value
                    formValue.attachedOrgs = this.addedOrgs
                    this.orgSvc.updateLocalFormValue('instituteProfile', formValue)
                    this.orgSvc.updateFormStatus('instituteProfile', this.instituteProfileForm.valid)
                }
            })
        }
    }
}
