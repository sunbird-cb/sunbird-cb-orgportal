import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { OrgProfileService } from '../../services/org-profile.service'
import { Subject } from 'rxjs'

@Component({
    selector: 'ws-app-roles-and-functions',
    templateUrl: './roles-and-functions.component.html',
    styleUrls: ['./roles-and-functions.component.scss'],
    /* tslint:disable */
    host: { class: 'w-full role-card flex flex-1' },
    /* tslint:enable */
})
export class RolesAndFunctionsComponent implements OnInit {
    roleActivityForm!: FormGroup
    instituteOtherRoleField: any = false
    private unsubscribe = new Subject<void>()

    constructor(
        private orgSvc: OrgProfileService,
    ) {
        this.roleActivityForm = new FormGroup({
            training: new FormControl(false, [Validators.required]),
            research: new FormControl(false, [Validators.required]),
            consultancy: new FormControl(false, [Validators.required]),
            trainingResearch: new FormControl(false, [Validators.required]),
            researchPublication: new FormControl(false, [Validators.required]),
            trainingConsultancy: new FormControl(false, [Validators.required]),
            trainConsulResPublication: new FormControl(false, [Validators.required]),
            other: new FormControl(false, [Validators.required]),
            instituteOtherRole: new FormControl('', [Validators.required]),
        })


        this.roleActivityForm.valueChanges
            .pipe(
                debounceTime(500),
                switchMap(async formValue => {
                    if (formValue) {
                        this.orgSvc.updateLocalFormValue('rolesAndFunctions', formValue)
                    }
                }),
                takeUntil(this.unsubscribe)
            ).subscribe()
    }

    ngOnInit() {
        console.log(this.roleActivityForm + '--------')
    }

    otherButtonSelect() {
        this.instituteOtherRoleField = true
    }
}
