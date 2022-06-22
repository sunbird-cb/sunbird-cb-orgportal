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
    constructor() {
        this.roleActivityForm = new FormGroup({
            training: new FormControl('', [Validators.required]),
            research: new FormControl('', []),
            consultancy: new FormControl('', []),
            trainingResearch: new FormControl('', []),
            researchPublication: new FormControl('', []),
            trainingConsultancy: new FormControl('', []),
            trainConsulResPublication: new FormControl(false, []),
            other: new FormControl('', []),
        })
    }

    ngOnInit() {
    }
}
