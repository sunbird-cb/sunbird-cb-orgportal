import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Subject } from 'rxjs'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { OrgProfileService } from '../../services/org-profile.service'

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
    addedOrgs: any[] = []
    private unsubscribe = new Subject<void>()

    constructor(
        private orgSvc: OrgProfileService,
    ) {
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

        this.infrastructureForm.valueChanges
            .pipe(
                debounceTime(500),
                switchMap(async formValue => {
                    if (formValue) {
                        formValue.addedOrgs = this.addedOrgs
                        this.orgSvc.updateLocalFormValue('infrastructure', formValue)
                    }
                }),
                takeUntil(this.unsubscribe)
            ).subscribe()
    }

    ngOnInit() {
    }
}
