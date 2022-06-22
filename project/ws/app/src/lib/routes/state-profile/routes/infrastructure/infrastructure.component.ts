import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'

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
    constructor() {
        this.infrastructureForm = new FormGroup({
            builtuparea: new FormControl('', []),
            academicarea: new FormControl('', []),
            hostelarea: new FormControl('', []),
            computerlabarea: new FormControl('', []),
            computersystemcount: new FormControl('', []),
            totalcollection: new FormControl('', []),
            periodicalsubscribed: new FormControl(false, []),
            latitudelongitude: new FormControl('', []),
        })
    }

    ngOnInit() {
    }
}
