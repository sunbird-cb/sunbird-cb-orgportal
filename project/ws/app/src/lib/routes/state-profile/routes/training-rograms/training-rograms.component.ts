import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

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
            subjectName: new FormControl('', [Validators.required]),
            digitalPrograms: new FormControl('', [Validators.required]),
            videoCount: new FormControl('', [Validators.required]),
            pptCount: new FormControl('', [Validators.required]),
        })
    }

    ngOnInit() {
    }
}
