import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'ws-app-infrastructure',
    templateUrl: './infrastructure.component.html',
    styleUrls: ['./infrastructure.component.scss'],
    /* tslint:disable */
    host: { class: 'w-full role-card flex flex-1' },
    /* tslint:enable */
})
export class InfrastructureComponent implements OnInit {
    infrastructureForm!: FormGroup
    constructor() {
        this.infrastructureForm = new FormGroup({
            builtupArea: new FormControl('', [Validators.required]),
            academicArea: new FormControl('', [Validators.required]),
            hostelArea: new FormControl('', [Validators.required]),
            computerLabArea: new FormControl('', [Validators.required]),
            computerSystemCount: new FormControl('', [Validators.required]),
            totalCollection: new FormControl('', [Validators.required]),
            periodicalsSubscribed: new FormControl(false, [Validators.required]),
            latitudeLongitude: new FormControl('', [Validators.required]),
        })
    }

    ngOnInit() {
    }
}
