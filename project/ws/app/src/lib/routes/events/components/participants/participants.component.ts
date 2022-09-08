import { Component, Inject, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { EventsService } from '../../services/events.service'
import { HttpClient } from '@angular/common/http'
// tslint:disable-next-line
import _ from 'lodash'

export interface IParticipantElement {
    firstname: string,
    lastname: string,
    email: number
}

@Component({
    selector: 'ws-app-participants',
    templateUrl: './participants.component.html',
    styleUrls: ['./participants.component.scss'],
})
export class ParticipantsComponent implements OnInit {

    participants: any = []
    displayedColumns: string[] = ['select', 'fullname', 'email']
    dataSource: any
    selection = new SelectionModel<IParticipantElement>(true, [])
    searchUserCtrl = new FormControl()
    filteredUsers: any
    isLoading = false
    errorMsg: any

    constructor(
        public eventSrc: EventsService,
        public http: HttpClient,
        public dialogRef: MatDialogRef<ParticipantsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    isAllSelected() {
        const numSelected = this.selection.selected.length
        const numRows = this.dataSource.data.length
        return numSelected === numRows
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach((row: any) => this.selection.select(row))

        // if (this.isSomeSelected()) {

        //     this.selection.clear()
        //     ref.checked = false

        // } else {
        //     this.isAllSelected() ?
        //        this.selection.clear() :
        //         this.dataSource.data.forEach((row: any) => {
        //             this.selection.toggle(row)
        //             this.selection.isSelected(row)
        //             this.selection.select(row)

        //         })
        // }
    }

    isSomeSelected() {

        return this.selection.selected.length > 0
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: IParticipantElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`
    }

    ngOnInit() {
        // const requestObj = {
        //     departments: [
        //     'igot',
        //     'istm',
        //     'iGOT',
        //     'NPA',
        //     'NACIN',
        //     'LSNAA',
        //     ],
        // }
        // const requestObj = {}
        this.searchUserCtrl.valueChanges.pipe(
            debounceTime(200),
            distinctUntilChanged(),
        ).subscribe(() => {
            this.eventSrc.searchUser(this.searchUserCtrl.value).subscribe((data: any) => {
                this.dataSource = new MatTableDataSource<IParticipantElement>(data)
                this.dataSource.data = data.result.response.content
                const resultdata = data.result.response.content
                this.participants = []
                Object.keys(resultdata).forEach((key: any) => {
                    const obj = resultdata[key]
                    const email = _.get(obj, 'profileDetails.personalDetails.primaryEmail')
                    if (email !== undefined) {
                        const participantObj = {
                            email,
                            firstname: obj.firstName,
                            lastname: obj.lastName,
                            id: obj.userId,
                        }
                        this.participants.push(participantObj)
                    }
                })
            })
        })
    }

    confirm() {
        this.dialogRef.close({ data: this.selection.selected })
    }

}
