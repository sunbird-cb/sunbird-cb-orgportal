import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

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
    constructor() {
        this.instituteProfileForm = new FormGroup({
            institutename: new FormControl('', []),
            fulladdress: new FormControl('', []),
            buildingno: new FormControl('', []),
            statename: new FormControl('', []),
            pincode: new FormControl('', []),
            mobile: new FormControl(false, []),
            email: new FormControl('', [Validators.required, Validators.email]),
            website: new FormControl('', []),
            traininginstitute: new FormControl(false, []),
            attachedtraininginstitute: new FormControl('', []),
            attachedcenter: new FormControl('', []),
            traininginstitutedetail: new FormControl('', []),
        })
    }

    ngOnInit() {
    }

    buttonSelect(event: any) {
        console.log(event.params + '=')

        this.isButtonActive = !this.isButtonActive
    }
}
