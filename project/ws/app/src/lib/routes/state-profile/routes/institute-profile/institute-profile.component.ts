import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ConfigurationsService } from '@sunbird-cb/utils'
/* tslint:disable*/
import _ from 'lodash'
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
    isButtonActive: any
    public countryCodes: string[] = []
    public stateNames: string[] = []
    phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
    pincodePattern = '(^[0-9]{6}$)'
    yearPattern = '(^[0-9]{4}$)'
    namePatern = `^[a-zA-Z\\s\\']{1,32}$`

    countryCodeList = ['+91', '+92', '+93', '+94', '+95']
    stateNameList = ['Delhi', 'Uttaranchal', 'Hariyana', 'Karnatak', 'Uttar Pradesh']

    constructor(
        private configSvc: ConfigurationsService
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
            trainingInstitute: new FormControl(false, [Validators.required]),
            attachedTrainingInstitute: new FormControl('', [Validators.required]),
            attachedCenter: new FormControl('', [Validators.required]),
            trainingInstituteDetail: new FormControl('', []),
        })

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
    }

    ngOnInit() {

        this.countryCodes = this.countryCodeList
        this.stateNames = this.stateNameList
        console.log(this.instituteProfileForm + '=============+++++')
    }

    buttonSelect(event: any) {
        console.log(event.params + '=')

        this.isButtonActive = !this.isButtonActive
    }
}
