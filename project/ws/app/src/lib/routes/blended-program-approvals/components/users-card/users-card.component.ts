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
    if (this.user && this.user.userInfo) {
      name = `${this.user.userInfo.first_name}`
    } else {
      name = `${this.user.first_name}`
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
