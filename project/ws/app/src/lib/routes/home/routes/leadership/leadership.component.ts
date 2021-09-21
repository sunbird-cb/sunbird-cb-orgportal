import { Component, OnInit } from '@angular/core'
import { ITableData } from '../../interface/interfaces'

@Component({
  selector: 'ws-app-leadership',
  templateUrl: './leadership.component.html',
  styleUrls: ['./leadership.component.scss'],
})
export class LeadershipComponent implements OnInit {
  tableData: ITableData = {
    actions: [],
    columns: [
      { displayName: 'Sr. no.', key: 'srnumber' },
      { displayName: 'Full Name', key: 'fullname' },
      { displayName: 'Position', key: 'position', isList: true },
      { displayName: 'Email', key: 'email' },
    ],
    needCheckBox: false,
    needHash: false,
    sortColumn: 'fullname',
    sortState: 'asc',
    needUserMenus: true,
  }
  data!: {
    srnumber: number;
    fullname: string;
    position: string;
    email: string;
  }[]
  bodyHeight = document.body.clientHeight - 125
  constructor() {}

  ngOnInit() {
    this.data = [
      {
        srnumber: 1,
        fullname: 'Devansh',
        position: 'Deputy Director',
        email: 'dev@test.com',
      },
      {
        srnumber: 1,
        fullname: 'Devansh',
        position: 'Deputy Director',
        email: 'dev@test.com',
      },
    ]
  }

}
