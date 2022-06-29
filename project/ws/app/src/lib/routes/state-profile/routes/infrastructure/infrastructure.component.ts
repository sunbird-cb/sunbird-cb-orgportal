import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { Subject } from 'rxjs'
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators'
import { OrgProfileService } from '../../services/org-profile.service'
/* tslint:disable*/
import _ from 'lodash'
import { DialogBoxComponent } from '../../components/dialog-box/dialog-box.component'
import { MatDialog } from '@angular/material'

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
        private configSvc: ConfigurationsService,
        private dialog: MatDialog,
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

        // pre poluate form fields when data is available (edit mode)
        if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.orgProfile) {
            const infradata = _.get(this.configSvc.unMappedUser.orgProfile, 'profileDetails.infrastructure')
            this.infrastructureForm.patchValue({
                builtupArea: _.get(infradata, 'builtupArea'),
                academicArea: _.get(infradata, 'academicArea'),
                hostelArea: _.get(infradata, 'hostelArea'),
                computerLabArea: _.get(infradata, 'computerLabArea'),
                computerSystemCount: _.get(infradata, 'computerSystemCount'),
                totalCollection: _.get(infradata, 'totalCollection'),
                periodicalsSubscribed: _.get(infradata, 'periodicalsSubscribed'),
                latitudeLongitude: _.get(infradata, 'latitudeLongitude'),
            })
            this.infrastructureForm.updateValueAndValidity()
            this.orgSvc.updateLocalFormValue('infrastructure', this.infrastructureForm.value)
            this.orgSvc.updateFormStatus('infrastructure', this.infrastructureForm.valid)
        }

        this.infrastructureForm.valueChanges
            .pipe(
                debounceTime(500),
                switchMap(async formValue => {
                    if (formValue) {
                        this.orgSvc.updateLocalFormValue('infrastructure', formValue)
                        this.orgSvc.updateFormStatus('infrastructure', this.infrastructureForm.valid)
                    }
                }),
                takeUntil(this.unsubscribe)
            ).subscribe()
    }

    ngOnInit() {
    }

    openActivityDialog() {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            data: {
                view: 'infra',
            },
            hasBackdrop: false,
            width: '550px',

        })
        dialogRef.afterClosed().subscribe(_result => {

        })
    }

    openLongitudeDialog() {
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            data: {
                view: 'longitude',
            },
            hasBackdrop: false,
            width: '550px',

        })
        dialogRef.afterClosed().subscribe(_result => {

        })
    }
}
