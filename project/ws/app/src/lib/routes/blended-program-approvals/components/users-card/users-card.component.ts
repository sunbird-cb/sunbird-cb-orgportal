import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-users-card',
  templateUrl: './users-card.component.html',
  styleUrls: ['./users-card.component.scss'],
})
export class UsersCardComponent implements OnInit {
  @Input() user!: any
  @Input() actions: any

  constructor() { }

  ngOnInit() {
    console.log('actions', this.actions)
  }

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

  onSubmit(actiontype: any) {
    console.log('actiontype', actiontype)
  }

}
