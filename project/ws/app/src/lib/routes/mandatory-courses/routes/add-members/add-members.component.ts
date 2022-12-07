
import { Component, OnInit } from '@angular/core'


@Component({
  selector: 'ws-app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.scss'],
})
export class AddMembersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }



  getUserFullName(user: any) {
    // this.getHoverUser(user: any)
    if (user && user.first_name && user.last_name) {

      return `${user.first_name.trim()} ${user.last_name.trim()}`
    }
    return ''
  }

}
