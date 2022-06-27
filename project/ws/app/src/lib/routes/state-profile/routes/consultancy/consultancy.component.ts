import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

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
    constructor() {
        this.consultancyForm = new FormGroup({
            projectName: new FormControl('', [Validators.required]),
            projectDetail: new FormControl('', [Validators.required]),
            industrySponsoreName: new FormControl('', [Validators.required]),
            industrySponsoreDetail: new FormControl('', [Validators.required]),
            govSponsoreName: new FormControl('', [Validators.required]),
            govSponsoreDetail: new FormControl('', [Validators.required]),
            ongoingProjectName: new FormControl('', [Validators.required]),
            ongoingProjectDetail: new FormControl('', [Validators.required])
        })
    }

    ngOnInit() {
    }
}
