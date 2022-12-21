import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { AddFolderPopupComponent } from '../../../mandatory-courses/components/add-folder-popup/add-folder-popup.component'
import { MandatoryCourseService } from '../../../mandatory-courses/services/mandatory-course.service'
@Component({
  selector: 'ws-app-mandatory-courses',
  templateUrl: './mandatory-courses.component.html',
  styleUrls: ['./mandatory-courses.component.scss'],
})
export class MandatoryCoursesComponent implements OnInit {
  constructor(private dialog: MatDialog, private activatedRoute: ActivatedRoute, private mandatoryCourseServices: MandatoryCourseService) {
  }

  ngOnInit() {
    this.mandatoryCourseServices.updatePageData(this.activatedRoute.snapshot.data.pageData.data)
    this.getFolderList()
  }

  openCreateFolderDialog() {
    console.log('popup btn clicked')
    this.dialog.open(AddFolderPopupComponent, {
      // height: '400px',
      width: '400px',

      // panelClass: 'custom-dialog-container',
    })
  }

  getFolderList() {
    const request = {
      request: {
        filters: {
          primaryCategory: [
            this.activatedRoute.snapshot.data.pageData.data.primaryCategory
          ],
          query: ""
        }
      }
    }
    this.mandatoryCourseServices.fetchSearchData(request).subscribe(data => {
      console.log(data)
    })
  }
}
