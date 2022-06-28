import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { OrgProfileService } from '../../services/org-profile.service'
import { Subject } from 'rxjs'

@Component({
    selector: 'ws-app-research',
    templateUrl: './research.component.html',
    styleUrls: ['./research.component.scss'],
    /* tslint:disable */
    host: { class: 'w-full role-card flex flex-1' },
    /* tslint:enable */
})
export class ResearchComponent implements OnInit {
    researchProgramForm!: FormGroup
    researchPaperForm!: FormGroup

    private unsubscribe = new Subject<void>()
    constructor(
        private orgSvc: OrgProfileService,
    ) {
        this.researchProgramForm = new FormGroup({
            projectName: new FormControl('', [Validators.required]),
            programeStatus: new FormControl('', [Validators.required]),
            industrySponsored: new FormControl('', [Validators.required]),
            govtSponsored: new FormControl('', [Validators.required]),
            otherSponsored: new FormControl('', [Validators.required]),
            projectDetail: new FormControl('', [Validators.required]),
        })

        this.researchPaperForm = new FormGroup({
            researchPaperName: new FormControl('', [Validators.required]),
            researchPaperDetail: new FormControl('', [Validators.required]),
        })

        this.researchProgramForm.valueChanges
            .pipe(
                debounceTime(500),
                switchMap(async formValue => {
                    if (formValue) {
                        this.orgSvc.updateLocalFormValue('research', formValue)
                    }
                }),
                takeUntil(this.unsubscribe)
            ).subscribe()
    }

    ngOnInit() {
    }
}
