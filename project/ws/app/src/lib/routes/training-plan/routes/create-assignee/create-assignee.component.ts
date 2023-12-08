import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-create-assignee',
  templateUrl: './create-assignee.component.html',
  styleUrls: ['./create-assignee.component.scss'],
})
export class CreateAssigneeComponent implements OnInit {
  categoryData: any[] = []
  constructor() { }

  ngOnInit() {
    this.categoryData = [
      {
       id: 1,
       name: 'Designation',
       value: 'Designation',
      },
      {
        id: 2,
        name: 'All Users',
        value: 'All Users',
      },
      {
        id: 3,
        name: 'Custom Users',
        value: 'Custom Users',
      },
    ]
  }

}
