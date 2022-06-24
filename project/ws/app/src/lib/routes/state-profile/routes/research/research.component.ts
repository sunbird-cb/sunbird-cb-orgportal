import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

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
    constructor() {
        this.researchProgramForm = new FormGroup({
            CompletedResearchprojectName: new FormControl('', [Validators.required]),
            CompletedResearchprojectDetail: new FormControl('', [Validators.required]),
            industrySponsoreName: new FormControl('', [Validators.required]),
            industrySponsoreDetail: new FormControl('', [Validators.required]),
            governmentSponsoreName: new FormControl('', [Validators.required]),
            governmentSponsoreDetail: new FormControl('', [Validators.required]),
            ongoingProjectName: new FormControl('', [Validators.required]),
            ongoingProjectDetail: new FormControl('', [Validators.required]),
            facultyName: new FormControl('', [Validators.required]),
            uploadPaper: new FormControl('', [Validators.required]),
        })
    }

    ngOnInit() {
    }
}
