
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.scss'],
})
export class AddMembersComponent implements OnInit {
  bdtitles = [
    { title: 'Folders', url: '/app/home/mandatory-courses' },
    { title: 'Folder name', url: '/app/mandatory-courses/132' },
    { title: 'Batch name', url: '/app/mandatory-courses/132/batch-details/123' },
    { title: 'Add members', url: 'none' },
  ]
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
