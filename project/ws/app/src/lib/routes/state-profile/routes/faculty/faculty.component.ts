import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

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
    constructor() {
        this.facultyForm = new FormGroup({
            noOfFaculty: new FormControl('', [Validators.required]),
            digitalPrograms: new FormControl('', [Validators.required]),
        })
    }

    ngOnInit() {
    }
}
