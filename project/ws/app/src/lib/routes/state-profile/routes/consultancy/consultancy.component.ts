import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { OrgProfileService } from '../../services/org-profile.service'
import { Subject } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils'
/* tslint:disable*/
import _ from 'lodash'
import { Router } from '@angular/router'
import { DialogConfirmComponent } from '../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'

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
    addedconsultancies: any[] = []
    @ViewChild('deleteTitleRef', { static: true })
    deleteTitleRef: ElementRef | null = null
    @ViewChild('deleteBodyRef', { static: true })
    deleteBodyRef: ElementRef | null = null
    editProgramValue: any
    textBoxActive = false
    private unsubscribe = new Subject<void>()

    constructor(
        private orgSvc: OrgProfileService,
        private configSvc: ConfigurationsService,

    ) {
        this.consultancyForm = new FormGroup({
            projectName: new FormControl('', [Validators.required]),
            programeStatus: new FormControl('', [Validators.required]),
            industrySponsored: new FormControl('', [Validators.required]),
            govtSponsored: new FormControl('', [Validators.required]),
            otherSponsored: new FormControl('', [Validators.required]),
            projectDetail: new FormControl('', [Validators.required]),
        })

        // pre poluate form fields when data is available (edit mode)
        if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.orgProfile) {
            const consultancyData = _.get(this.configSvc.unMappedUser.orgProfile, 'profileDetails.consultancy')
            this.addedconsultancies = _.get(consultancyData, 'consultancies') || []
        }
    }

    ngOnInit() {
    }
}
