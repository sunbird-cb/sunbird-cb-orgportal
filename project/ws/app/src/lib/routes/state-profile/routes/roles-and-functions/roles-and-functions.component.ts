import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'ws-app-roles-and-functions',
    templateUrl: './roles-and-functions.component.html',
    styleUrls: ['./roles-and-functions.component.scss'],
    /* tslint:disable */
    host: { class: 'w-full role-card flex flex-1' },
    /* tslint:enable */
})
export class RolesAndFunctionsComponent implements OnInit {
    constructor() { }

    ngOnInit() {
    }
}
