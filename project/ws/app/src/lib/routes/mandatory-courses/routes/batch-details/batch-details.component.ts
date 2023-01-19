import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NsMandatoryCourse } from '../../models/mandatory-course.model'
import { MandatoryCourseService } from '../../services/mandatory-course.service'
import { AddMembersComponent } from '../add-members/add-members.component'
import { formatDate } from '@angular/common'
@Component({
  selector: 'ws-app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.scss'],
})
export class BatchDetailsComponent implements OnInit {
  currentCourseId!: string
  currentBatchId!: string
  folderInfo: any
  @ViewChild('addMember', { static: false }) addMember!: AddMembersComponent
  bdtitles: any = []
  noDataConfig: NsMandatoryCourse.IEmptyDataDisplay = {
    heading: 'No members added',
    description: 'Add members to assign course',

  }
  pageConfig: any
  statusInfoList: NsMandatoryCourse.IStatusWidget[] = []
  memberList: any = []
  batchDetails: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private mandatoryCourseSvc: MandatoryCourseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pageConfig = this.activatedRoute.snapshot.data.pageData.data
    this.noDataConfig = this.pageConfig.noDataConfig
    this.activatedRoute.params.subscribe(params => {
      this.currentCourseId = params['doId']
      this.currentBatchId = params['batchId']
      this.noDataConfig.btnLink = `/app/mandatory-courses/${this.currentCourseId}/batch-details/${this.currentBatchId}/choose-members`
    })
    this.folderInfo = this.mandatoryCourseSvc.getFolderInfo()
    this.batchDetails = this.folderInfo.batches.filter((batch: any) => batch.batchId === this.activatedRoute.snapshot.params.batchId)[0]
    this.getBatchDetails()
    this.updateBreadcrumb()
  }
  getBatchDetails() {
    this.statusInfoList.length = 0
    this.memberList.length = 0
    this.mandatoryCourseSvc.getBatchDetails(this.currentBatchId).subscribe(data => {
      this.memberList = data
      this.updateStatusWidgets()
    })
  }
  gotoChooseMember() {
    this.router.navigate([this.noDataConfig.btnLink])
  }

  removeMembers() {
    this.addMember.deleteSelected()
  }

  updateStatusWidgets() {
    this.statusInfoList.push({
      name: this.pageConfig.statusWidget.noOfCourse,
      value: this.folderInfo.children ? this.folderInfo.children.length : '00',
    })
    this.statusInfoList.push({
      name: this.pageConfig.statusWidget.noOfMembers,
      value: this.memberList.length,
    })
    this.statusInfoList.push({
      name: this.pageConfig.statusWidget.startDate,
      value: formatDate(this.batchDetails.startDate, 'dd/MM/yyyy', 'en-US'),
    })
    this.statusInfoList.push({
      name: this.pageConfig.statusWidget.endDate,
      value: formatDate(this.batchDetails.endDate, 'dd/MM/yyyy', 'en-US'),
    })
  }
  updateBreadcrumb() {
    this.bdtitles = [{ title: 'Folders', url: '/app/home/mandatory-courses' }]
    this.bdtitles.push({ title: this.folderInfo.name, url: `/app/mandatory-courses/${this.folderInfo.identifier}` })
    this.bdtitles.push({ title: this.batchDetails.name, url: 'none' })
  }
}
