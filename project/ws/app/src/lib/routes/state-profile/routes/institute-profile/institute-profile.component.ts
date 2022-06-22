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
    constructor(
        private configSvc: ConfigurationsService
    ) {
        this.instituteProfileForm = new FormGroup({
            instituteName: new FormControl('', []),
            fullAddress: new FormControl('', []),
            buildingNo: new FormControl('', []),
            stateName: new FormControl('', []),
            pincode: new FormControl('', []),
            mobile: new FormControl('', []),
            email: new FormControl('', [Validators.email]),
            website: new FormControl('', []),
            trainingInstitute: new FormControl(false, []),
            attachedTrainingInstitute: new FormControl('', []),
            attachedCenter: new FormControl('', []),
            trainingInstituteDetail: new FormControl('', []),
        })

        if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.orgProfile) {
            const instituteProfile = _.get(this.configSvc.unMappedUser.orgProfile, 'profileDetails.instituteProfile')
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
    }

    buttonSelect(event: any) {
        console.log(event.params + '=')

        this.isButtonActive = !this.isButtonActive
    }
}
