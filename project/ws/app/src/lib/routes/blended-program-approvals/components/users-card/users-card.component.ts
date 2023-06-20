import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material'
import { DialogConfirmComponent } from '../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'

@Component({
  selector: 'ws-app-users-card',
  templateUrl: './users-card.component.html',
  styleUrls: ['./users-card.component.scss'],
})
export class UsersCardComponent implements OnInit {
  @Input() user!: any
  @Input() actions: any
  @Output() userClick = new EventEmitter()

  constructor(private dialogue: MatDialog) { }

  ngOnInit() { }

  getUseravatarName() {
    let name = ''
    if (this.user && this.user.first_name) {
      if (this.user.first_name) {
        if (this.user.last_name && this.user.last_name !== null && this.user.last_name !== undefined) {
          name = `${this.user.first_name} ${this.user.last_name}`
        } else {
          name = `${this.user.first_name}`
        }
      } else {
        name = `${this.user.name}`
      }
    } else if (this.user && this.user.personalDetails) {
      if (this.user.personalDetails.middlename) {
        // tslint:disable-next-line:max-line-length
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename} ${this.user.personalDetails.surname}`
        } else {
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename}`
        }
      } else if (this.user.personalDetails.firstname) {
        // tslint:disable-next-line:max-line-length
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`
        } else {
          name = `${this.user.personalDetails.firstname}`
        }
      }
    }
    return name
  }

  clickApprove() {
    const dialogRef = this.dialogue.open(DialogConfirmComponent, {
      data: {
        title: 'Are you sure?',
        body: `Please click <strong>Yes</strong> to approve this request.`,
      },
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        const data = {
          action: 'Approve',
          userData: this.user,
        }
        this.userClick.emit(data)
      }
    })
  }

  clickReject() {
    const dialogRef = this.dialogue.open(DialogConfirmComponent, {
      data: {
        title: 'Are you sure?',
        body: `Please click <strong>Yes</strong> to reject this request.`,
      },
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        const data = {
          action: 'Reject',
          userData: this.user,
        }
        this.userClick.emit(data)
      }
    })
  }

}
