import { Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator, PageEvent } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { MandatoryCourseService } from '../../../mandatory-courses/services/mandatory-course.service'

@Component({
  selector: 'ws-app-mandatory-courses',
  templateUrl: './mandatory-courses.component.html',
  styleUrls: ['./mandatory-courses.component.scss'],
})
export class MandatoryCoursesComponent implements OnInit {
  folderList: any = []
  pageCongifData: any
  folderConfigInfo: any
  user: any
  totalCount = 0
  pageSize = 20
  pageSizeOptions = [50, 40, 30, 20, 10]
  pageIndex = 0
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  constructor(private activatedRoute: ActivatedRoute,
    private mandatoryCourseServices: MandatoryCourseService, private router: Router) { }

  ngOnInit() {
    this.pageCongifData = this.activatedRoute.snapshot.data.pageData.data
    this.folderConfigInfo = this.pageCongifData.folder.table
    this.user = this.mandatoryCourseServices.getUserId()
    this.mandatoryCourseServices.updatePageData(this.activatedRoute.snapshot.data.pageData.data)
    this.getFolderList('')
    this.paginator._intl.itemsPerPageLabel = "Folders per page"
  }

  openCreateFolderDialog() {
    // this.dialog.open(AddFolderPopupComponent, {
    //   // height: '400px',
    //   width: '400px',
    //   data: this.activatedRoute.snapshot.data.pageData.data,
    //   // panelClass: 'custom-dialog-container',
    // })
    this.mandatoryCourseServices.removeFolderInfo()
    this.router.navigate([`/app/mandatory-courses/new`])
  }

  getFolderList(search: any) {
    const queryparam = {
      request: {
        filters: {
          contentType: ['Course'],
          primaryCategory: ['Mandatory Course Goal'],
          mimeType: [],
          source: [],
          mediaType: [],
          status: ['Draft', 'LIVE'],
          topics: [],
          createdBy: this.user,
        },
        query: search,
        sort_by: { lastUpdatedOn: 'desc' },
        fields: [],
        facets: ['primaryCategory'],
        limit: this.pageSize,
        offset: this.pageIndex * this.pageSize,
        fuzzy: true,
      },
    }
    this.mandatoryCourseServices.fetchSearchData(queryparam).subscribe(data => {
      this.folderList = data.result.content
      this.totalCount = data.result.count
    })
  }
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.getFolderList('')
  }
}
