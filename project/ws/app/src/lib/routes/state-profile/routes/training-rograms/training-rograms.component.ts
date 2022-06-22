import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'

@Component({
    selector: 'ws-app-training-rograms',
    templateUrl: './training-rograms.component.html',
    styleUrls: ['./training-rograms.component.scss'],
    /* tslint:disable */
    host: { class: 'w-full role-card flex flex-1' },
    /* tslint:enable */
})
export class TrainingRogramsComponent implements OnInit {
    trainingProgramForm!: FormGroup
    constructor() {
        this.trainingProgramForm = new FormGroup({
            subjectname: new FormControl('', []),
            digitalprograms: new FormControl('', []),
            videocount: new FormControl('', []),
            pptcount: new FormControl('', []),
        })
    }

    ngOnInit() {
    }
}
