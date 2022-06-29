import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { OrgProfileService } from '../../services/org-profile.service'
import { Subject } from 'rxjs'

@Component({
    selector: 'ws-app-consultancy',
    templateUrl: './consultancy.component.html',
    styleUrls: ['./consultancy.component.scss'],
    /* tslint:disable */
    host: { class: 'w-full role-card flex flex-1' },
    /* tslint:enable */
})
export class ConsultancyComponent implements OnInit {
    consultancyForm!: FormGroup
    private unsubscribe = new Subject<void>()

    constructor(
        private orgSvc: OrgProfileService,
    ) {
        this.consultancyForm = new FormGroup({
            projectName: new FormControl('', [Validators.required]),
            programeStatus: new FormControl('', [Validators.required]),
            industrySponsored: new FormControl('', [Validators.required]),
            govtSponsored: new FormControl('', [Validators.required]),
            projectDetail: new FormControl('', [Validators.required]),
            // industrySponsoreName: new FormControl('', [Validators.required]),
            // industrySponsoreDetail: new FormControl('', [Validators.required]),
            // govSponsoreName: new FormControl('', [Validators.required]),
            // govSponsoreDetail: new FormControl('', [Validators.required]),
            // ongoingProjectName: new FormControl('', [Validators.required]),
            // ongoingProjectDetail: new FormControl('', [Validators.required])
        })

        this.consultancyForm.valueChanges
            .pipe(
                debounceTime(500),
                switchMap(async formValue => {
                    if (formValue) {
                        this.orgSvc.updateLocalFormValue('consultancy', formValue)
                    }
                }),
                takeUntil(this.unsubscribe)
            ).subscribe()
    }

    ngOnInit() {
    }
}
