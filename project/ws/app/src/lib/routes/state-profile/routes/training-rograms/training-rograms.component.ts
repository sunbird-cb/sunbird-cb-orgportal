import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { OrgProfileService } from '../../services/org-profile.service'
import { Subject } from 'rxjs'
import { MatChipInputEvent } from '@angular/material'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { ConfigurationsService } from '@sunbird-cb/utils'
/* tslint:disable*/
import _ from 'lodash'

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
        private configSvc: ConfigurationsService,
    ) {
        this.trainingProgramForm = new FormGroup({
            subjectName: new FormControl('', []),
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
                    }
                }),
                takeUntil(this.unsubscribe)
            ).subscribe()
    }

    ngOnInit() {
        // pre poluate form fields when data is available (edit mode)
        if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.orgProfile) {
            const trainingProgramsData = _.get(this.configSvc.unMappedUser.orgProfile, 'profileDetails.trainingPrograms')
            this.trainingProgramForm.patchValue({
                subjectName: _.get(trainingProgramsData, 'subjectName'),
                conductDigitalPrograms: _.get(trainingProgramsData, 'conductDigitalPrograms'),
                prepareDigitalContent: _.get(trainingProgramsData, 'prepareDigitalContent'),
                videoCount: _.get(trainingProgramsData, 'videoCount'),
                pptCount: _.get(trainingProgramsData, 'pptCount'),
                otherMaterialCount: _.get(trainingProgramsData, 'otherMaterialCount'),
                otherInfo: _.get(trainingProgramsData, 'otherInfo'),
            })
            this.selectedSubjects = _.get(trainingProgramsData, 'selectedSubjects')
            const formValue = this.trainingProgramForm.value
            formValue.selectedSubjects = this.selectedSubjects
            this.trainingProgramForm.updateValueAndValidity()
            this.orgSvc.updateLocalFormValue('trainingPrograms', formValue)
            this.orgSvc.updateFormStatus('trainingPrograms', this.trainingProgramForm.valid)
        }

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
