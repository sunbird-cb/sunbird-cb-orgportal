import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material'
import { ConfigurationsService } from '@sunbird-cb/utils'
/* tslint:disable*/
import _ from 'lodash'
import { Subject } from 'rxjs'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
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
    editOrg: any
    addedOrgs: any[] = []
    constructor(
        private configSvc: ConfigurationsService,
        private orgSvc: OrgProfileService,
        private snackBar: MatSnackBar,
    ) {
        this.instituteProfileForm = new FormGroup({
            instituteName: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
            fullAddress: new FormControl('', [Validators.required]),
            buildingNo: new FormControl('', []),
            stateName: new FormControl('', [Validators.required]),
            pincode: new FormControl('', [Validators.required, Validators.pattern(this.pincodePattern)]),
            countryCode: new FormControl('', [Validators.required]),
            mobile: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            website: new FormControl('', [Validators.required]),
            trainingInstitute: new FormControl('', []),
            attachedTrainingInstitute: new FormControl(true, [Validators.required]),
            trainingInstituteDetail: new FormControl('', []),
        })

        // pre poluate form fields when data is available (edit mode)
        if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.orgProfile) {
            const instituteProfile = _.get(this.configSvc.unMappedUser.orgProfile, 'profileDetails.instituteProfile')
            console.log(JSON.stringify(instituteProfile) + '--------')
            this.instituteProfileForm.patchValue({
                instituteName: _.get(instituteProfile, 'instituteName'),
                fullAddress: _.get(instituteProfile, 'fullAddress'),
                buildingNo: _.get(instituteProfile, 'buildingNo'),
                stateName: _.get(instituteProfile, 'stateName'),
                pincode: _.get(instituteProfile, 'pincode'),
                mobile: _.get(instituteProfile, 'mobile'),
                email: _.get(instituteProfile, 'email'),
                website: _.get(instituteProfile, 'website'),
                trainingInstitute: _.get(instituteProfile, 'trainingInstitute'),
                attachedTrainingInstitute: _.get(instituteProfile, 'attachedTrainingInstitute'),
                attachedCenter: _.get(instituteProfile, 'attachedCenter'),
                trainingInstituteDetail: _.get(instituteProfile, 'trainingInstituteDetail'),
            })
        }

        this.instituteProfileForm.valueChanges
            .pipe(
                debounceTime(500),
                switchMap(async formValue => {
                    if (formValue) {
                        formValue.addedOrgs = this.addedOrgs
                        this.orgSvc.updateLocalFormValue('instituteProfile', formValue)
                    }
                }),
                takeUntil(this.unsubscribe)
            ).subscribe()
    }

    ngOnInit() {

        this.countryCodes = this.countryCodeList
        this.stateNames = this.stateNameList
    }

    buttonSelect(event: any) {
        this.isButtonActive = !this.isButtonActive
    }

    addOrg() {
        if (!this.editOrg) {
            // tslint:disable-next-line: no-non-null-assertion
            if (this.instituteProfileForm!.get('trainingInstitute')!.value) {
                const org = {
                    // tslint:disable-next-line: no-non-null-assertion
                    name: this.instituteProfileForm!.get('trainingInstitute')!.value || '',
                    // tslint:disable-next-line: no-non-null-assertion
                    isAttachedInstitute: this.instituteProfileForm!.get('trainingInstitute')!.value || true,
                    // tslint:disable-next-line: no-non-null-assertion
                    trainingInstituteDetail: this.instituteProfileForm!.get('trainingInstituteDetail')!.value || '',
                }
                this.addedOrgs.push(org)
                this.orgSvc.updateLocalFormValue('instituteProfile', this.instituteProfileForm.value)
            } else {
                this.snackBar.open('Attached training institute or center name is required')
            }
        }
    }
}
