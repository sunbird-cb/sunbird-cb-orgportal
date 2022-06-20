import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'ws-app-institute-profile',
    templateUrl: './institute-profile.component.html',
    styleUrls: ['./institute-profile.component.scss'],
    /* tslint:disable */
    host: { class: 'w-100 role-card flex flex-1' },
    /* tslint:enable */
})
export class InstituteProfileComponent implements OnInit {
    isButtonActive: any
    constructor() { }

    ngOnInit() {
    }

    buttonSelect(event: any) {
        console.log(event.params + '=')

        this.isButtonActive = !this.isButtonActive
    }
}
