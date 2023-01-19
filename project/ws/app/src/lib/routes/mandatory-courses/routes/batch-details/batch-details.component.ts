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
  bdtitles = [
    // { title: 'Folders', url: '/app/home/mandatory-courses' },
    // { title: 'Folder name', url: '/app/mandatory-courses/132' },
    { title: 'Batch name', url: 'none' },
  ]
  noDataConfig: NsMandatoryCourse.IEmptyDataDisplay = {
    image: 'assets/images/banners/no_data.svg',
    heading: 'No members added',
    description: 'Add members to assign course',
    btnRequired: true,
    btnLink: 'choose-members',
    btnText: 'Add members',
  }

  statusInfoList: any = []
  memberList: any = []
  batchDetails: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private mandatoryCourseSvc: MandatoryCourseService,
    private router: Router
  ) { }

  ngOnInit() {
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
    this.statusInfoList.push({ name: 'Number of courses', value: this.folderInfo.children ? this.folderInfo.children.length : '00' })
    this.statusInfoList.push({ name: 'Number of members', value: this.memberList.length })
    this.statusInfoList.push({ name: 'Start date', value: formatDate(this.batchDetails.startDate, 'dd/MM/yyyy', 'en-US') })
    this.statusInfoList.push({ name: 'End date', value: formatDate(this.batchDetails.endDate, 'dd/MM/yyyy', 'en-US') })
  }
  updateBreadcrumb() {
    this.bdtitles = [{ title: 'Folders', url: '/app/home/mandatory-courses' }]
    this.bdtitles.push({ title: this.folderInfo.name, url: `/app/mandatory-courses/${this.folderInfo.identifier}` })
    this.bdtitles.push({ title: this.batchDetails.name, url: 'none' })
  }
}
