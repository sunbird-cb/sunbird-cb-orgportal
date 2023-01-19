import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MandatoryCourseService } from '../../services/mandatory-course.service'

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
  @Input() folderConfig: any
  constructor(private router: Router, private mandatoryCourseService: MandatoryCourseService) { }

  ngOnChanges() {
    this.updateDataSourse()
    console.log(this.folderConfig)
  }

  ngOnInit() { }

  updateDataSourse() {
    this.dataSource = this.folderListData.map((folderList: any) => {
      folderList.courseCount = folderList.hasOwnProperty('childNodes') ?
        folderList.childNodes.length < 10 ? `0${folderList.childNodes.length}` : folderList.childNodes.length : '00'
      folderList.batchCount = folderList.hasOwnProperty('batches') ?
        folderList.batches.length < 10 ? `0${folderList.batches.length}` : folderList.batches.length : '00'
      return folderList
    })
  }

  editFolder(folder: any) {
    this.mandatoryCourseService.sharefolderData(folder)
    this.router.navigate([`/app/mandatory-courses/${folder.identifier}`])
  }

}
