import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'ws-app-roles-and-functions',
    templateUrl: './roles-and-functions.component.html',
    styleUrls: ['./roles-and-functions.component.scss'],
    /* tslint:disable */
    host: { class: 'w-full role-card flex flex-1' },
    /* tslint:enable */
})
export class RolesAndFunctionsComponent implements OnInit {
    roleActivityForm!: FormGroup
    instituteOtherRoleField: any = false
    constructor() {
        this.roleActivityForm = new FormGroup({
            training: new FormControl('', [Validators.required]),
            research: new FormControl('', [Validators.required]),
            consultancy: new FormControl('', [Validators.required]),
            trainingResearch: new FormControl('', [Validators.required]),
            researchPublication: new FormControl('', [Validators.required]),
            trainingConsultancy: new FormControl('', [Validators.required]),
            trainConsulResPublication: new FormControl(false, [Validators.required]),
            other: new FormControl('', [Validators.required]),
            instituteOtherRole: new FormControl(false, [Validators.required]),
        })
    }

    ngOnInit() {
    }

    otherButtonSelect() {
        this.instituteOtherRoleField = true
    }
}
