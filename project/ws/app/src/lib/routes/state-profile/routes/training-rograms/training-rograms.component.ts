import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { OrgProfileService } from '../../services/org-profile.service'
import { Subject } from 'rxjs'

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
    private unsubscribe = new Subject<void>()
    constructor(
        private orgSvc: OrgProfileService,
    ) {
        this.trainingProgramForm = new FormGroup({
            subjectName: new FormControl('', [Validators.required]),
            digitalPrograms: new FormControl('', [Validators.required]),
            videoCount: new FormControl('', [Validators.required]),
            pptCount: new FormControl('', [Validators.required]),
        })

        this.trainingProgramForm.valueChanges
            .pipe(
                debounceTime(500),
                switchMap(async formValue => {
                    if (formValue) {
                        this.orgSvc.updateLocalFormValue('trainingPrograms', formValue)
                    }
                }),
                takeUntil(this.unsubscribe)
            ).subscribe()
    }

    ngOnInit() {
    }
}
