import { Component, Input, OnInit } from '@angular/core'

export interface IFolder {
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

  ngOnChanges() {
    this.updateDataSourse()
  }

  ngOnInit() { }

  updateDataSourse() {
    this.dataSource = this.folderListData.map((folderList: any) => {
      folderList.courseCount = folderList.hasOwnProperty('childNodes') ?
        folderList.childNodes.length < 10 ? `0${folderList.childNodes.length}` : folderList.childNodes.length : '00'
      folderList.batchCount = '00'
      return folderList
    })
  }

}
