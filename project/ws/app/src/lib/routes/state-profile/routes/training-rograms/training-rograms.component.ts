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
            subjectName: new FormControl('', []),
            digitalPrograms: new FormControl('', []),
            videoCount: new FormControl('', []),
            pptCount: new FormControl('', []),
        })
    }

    ngOnInit() {
    }
}
