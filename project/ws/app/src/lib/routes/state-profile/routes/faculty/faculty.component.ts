import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { OrgProfileService } from '../../services/org-profile.service'
import { Subject } from 'rxjs'

@Component({
    selector: 'ws-app-faculty',
    templateUrl: './faculty.component.html',
    styleUrls: ['./faculty.component.scss'],
    /* tslint:disable */
    host: { class: 'w-full role-card flex flex-1' },
    /* tslint:enable */
})
export class FacultyComponent implements OnInit {
    facultyForm!: FormGroup
    private unsubscribe = new Subject<void>()

    constructor(
        private orgSvc: OrgProfileService,
    ) {
        this.facultyForm = new FormGroup({
            regularFacultyCount: new FormControl('', [Validators.required]),
            adhocFacultyCount: new FormControl('', [Validators.required]),
            guestFacultyCount: new FormControl('', [Validators.required]),
            otherCount: new FormControl('', []),
        })

        this.facultyForm.valueChanges
            .pipe(
                debounceTime(500),
                switchMap(async formValue => {
                    if (formValue) {
                        this.orgSvc.updateLocalFormValue('faculty', formValue)
                        this.orgSvc.updateFormStatus('faculty', this.facultyForm.valid)
                    }
                }),
                takeUntil(this.unsubscribe)
            ).subscribe()
    }

    ngOnInit() {
    }
}
