import { Component, OnInit } from '@angular/core'

export interface courseFolder {
  folderId: number,
  folderName: string
  courseCount: number
  batchCount: number

}

const ELEMENT_DATA: courseFolder[] = [
  { folderId: 123, folderName: "Course 1 folder", courseCount: 3, batchCount: 9 },
  { folderId: 1232, folderName: "Course 2 folder", courseCount: 4, batchCount: 2 },
  { folderId: 1233, folderName: "Course 3 folder", courseCount: 4, batchCount: 4 },
  { folderId: 1234, folderName: "Course 4 folder", courseCount: 7, batchCount: 5 },
]

@Component({
  selector: 'ws-app-folder-list-table',
  templateUrl: './folder-list-table.component.html',
  styleUrls: ['./folder-list-table.component.scss']
})
export class FolderListTableComponent implements OnInit {
  displayedColumns: string[] = ['folderName', 'courseCount', 'batchCount']
  dataSource = ELEMENT_DATA
  constructor() {

  }

  ngOnInit() {
    // this.displayedColumns
  }

}
