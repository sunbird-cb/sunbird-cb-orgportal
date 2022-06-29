import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { OrgProfileService } from '../../services/org-profile.service'
import { Subject } from 'rxjs'
import { MatChipInputEvent } from '@angular/material'
import { COMMA, ENTER } from '@angular/cdk/keycodes'

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
    selectedSubjects: any[] = []
    separatorKeysCodes: number[] = [ENTER, COMMA]
    private unsubscribe = new Subject<void>()
    constructor(
        private orgSvc: OrgProfileService,
    ) {
        this.trainingProgramForm = new FormGroup({
            subjectName: new FormControl('', [Validators.required]),
            conductDigitalPrograms: new FormControl(false, [Validators.required]),
            prepareDigitalContent: new FormControl(false, [Validators.required]),
            videoCount: new FormControl('', [Validators.required]),
            pptCount: new FormControl('', [Validators.required]),
            otherMaterialCount: new FormControl('', [Validators.required]),
            otherInfo: new FormControl('', []),
        })

        this.trainingProgramForm.valueChanges
            .pipe(
                debounceTime(500),
                switchMap(async formValue => {
                    if (formValue) {
                        formValue.selectedSubjects = this.selectedSubjects
                        this.orgSvc.updateLocalFormValue('trainingPrograms', formValue)
                        this.orgSvc.updateFormStatus('trainingPrograms', this.trainingProgramForm.valid && this.selectedSubjects.length > 0)
                        console.log('formValue : ', formValue)
                    }
                }),
                takeUntil(this.unsubscribe)
            ).subscribe()
    }

    ngOnInit() {
    }

    addSubject(event: MatChipInputEvent) {
        const input = event.input
        const value = event.value

        if ((value || '')) {
            this.selectedSubjects.push(value)
        }

        if (input) {
            input.value = ''
        }

        if (this.trainingProgramForm.get('subjectName')) {
            // tslint:disable-next-line: no-non-null-assertion
            this.trainingProgramForm.get('subjectName')!.setValue(null)
        }
    }

    removeSubject(interest: any) {
        const index = this.selectedSubjects.indexOf(interest)
        if (index >= 0) {
            this.selectedSubjects.splice(index, 1)
        }
    }
}
