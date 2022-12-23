import { Component, Input, OnInit } from '@angular/core'

export interface courseFolder {
  folderId: number,
  folderName: string
  courseCount: number
  batchCount: number

}


@Component({
  selector: 'ws-app-folder-list-table',
  templateUrl: './folder-list-table.component.html',
  styleUrls: ['./folder-list-table.component.scss'],
})
export class FolderListTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'courseCount', 'batchCount']
  dataSource: any
  @Input() folderListData: any
  constructor() { }

  ngOnInit() {
    this.dataSource = this.folderListData.map((folderList: any) => {
      folderList.courseCount = 0
      folderList.batchCount = 0
      return folderList
    })
  }

}
