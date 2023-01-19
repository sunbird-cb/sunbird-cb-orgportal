import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NsMandatoryCourse } from '../../models/mandatory-course.model'
import { MatDialog, MatSnackBar } from '@angular/material'
import { AddBatchDialougeComponent } from '../../components/add-batch-dialouge/add-batch-dialouge.component'
import { NsContent } from '@sunbird-cb/collection'
import { MandatoryCourseService } from '../../services/mandatory-course.service'

@Component({
  selector: 'ws-app-mandatory-course-home',
  templateUrl: './mandatory-course.component.html',
  styleUrls: ['./mandatory-course.component.scss'],
  /* tslint:disable */
  // host: { class: 'flex flex-1' },
  /* tslint:enable */
})
export class MandatoryCourseComponent implements OnInit {

  currentCourseId!: string
  searchResults: any = []
  currentFilter = 'meta-data'
  content: NsContent.IContent | null = null
  bdtitles: any
  currentBread: any
  folderInfo: any
  courseList: any = []
  batches: any = []
  pageConfigData: any
  noDataConfig: NsMandatoryCourse.IEmptyDataDisplay = {
    heading: 'No course collections',
    description: 'Create an outstanding collection of courses by adding courses.'
  }
  noBatchDataConfig: NsMandatoryCourse.IEmptyDataDisplay = {
    heading: `No batche's created yet`,
    description: 'Create a batch to distribute courses.'
  }
  positions: any = []
  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private mandatoryCourseService: MandatoryCourseService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.pageConfigData = this.activatedRoute.snapshot.data.pageData.data
    this.noDataConfig = this.pageConfigData.mandatoryCourses.noDataConfig
    this.noBatchDataConfig = this.pageConfigData.mandatoryCourses.noBatchDataConfig
    this.activatedRoute.params.subscribe(params => {
      this.currentCourseId = params['doId']
      this.noDataConfig.btnLink = `/app/mandatory-courses/${this.currentCourseId}/choose-courses`
    })
    this.getFolderInfo()
  }

  getFolderInfo() {
    this.folderInfo = this.mandatoryCourseService.getFolderInfo()
    this.updateBreadcrumb(this.folderInfo)
    this.mandatoryCourseService.getEditContent(this.route.snapshot.params.doId).subscribe((data: any) => {
      this.courseList = data.result.content.children
      this.batches = data.result.content.batches || []
      this.mandatoryCourseService.sharefolderData(data.result.content)
    })
  }


  filter(data: any) {
    if (data === 'course-list') {
      this.currentFilter = 'course-list'
    } else if (data === 'batch-list') {
      this.currentFilter = 'batch-list'
    } else if (data === 'meta-data') {
      this.currentFilter = 'meta-data'
    }
  }

  openCreateBatchDialog() {
    const dialogRef = this.dialog.open(AddBatchDialougeComponent, {
      width: 'auto',
      // panelClass: 'custom-dialog-container',
      data: {
        batchInfo: this.activatedRoute.snapshot.params.doId
      }
    })
    dialogRef.afterClosed().subscribe(() => {
      this.getFolderInfo()
    })
  }

  publishFolder() {
    this.mandatoryCourseService.publishContent(this.mandatoryCourseService.getFolderInfo().identifier).subscribe(() => {
      this.snackBar.open('Published Successfully', 'Close', { verticalPosition: 'top' })
    })
  }

  editCourseList() {
    console.log(this.folderInfo)
    this.router.navigate([`/app/mandatory-courses/${this.route.snapshot.params.doId}/choose-courses`])
  }


  updateBreadcrumb(data: any) {
    this.bdtitles = [{ title: 'Folders', url: '/app/home/mandatory-courses' }]
    this.bdtitles.push({ title: data.name, url: `/app/mandatory-courses/${data.identifier}` })
  }

}
