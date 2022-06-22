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
            training: new FormControl('', []),
            research: new FormControl('', []),
            consultancy: new FormControl('', []),
            trainingresearch: new FormControl('', []),
            researchpublication: new FormControl('', []),
            trainingconsultancy: new FormControl('', []),
            trainingconsultancyresearchpublication: new FormControl(false, []),
            other: new FormControl('', []),
        })
    }

    ngOnInit() {
    }
}
