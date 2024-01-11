import { Component, Input, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
@Component({
  selector: 'ws-app-preview-plan',
  templateUrl: './preview-plan.component.html',
  styleUrls: ['./preview-plan.component.scss'],
})
export class PreviewPlanComponent implements OnInit {
  @Input() form?: string

  contentList: any = []
  assigneeData: any = []
  tab: any = ''
  allContentChips: any = []
  selectedTab = ''
  showBackBtn = false
  navUrl: any
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tpdsSvc: TrainingPlanDataSharingService) { }

  ngOnInit() {
    // this.from = this.route.snapshot.queryParams['from']
    const contentData = this.route.snapshot.data['contentData']
    if (contentData) {
      this.showBackBtn = true
      this.navUrl = {
        url: ['app', 'home', 'training-plan-dashboard'],
        queryParams: {
          type: contentData.status.toLowerCase(),
          tabSelected: contentData.assignmentType,
        },
      }
      const category = contentData.assignmentType
      this.form = 'all'
      const arr = []
      this.tab = this.selectedTab = 'content'

      if (category === 'CustomUser') {
        const assignmentDataArr: any = []
        if (contentData && contentData.userDetails) {
          contentData.userDetails.map((item: any) => {
            const obj: any = {
              firstName: '',
              userId: '',
              profileDetails: {
                professionalDetails: [{ designation: '' }],
              },
            }
            obj.firstName = (item) ? item.firstName : ''
            obj.profileDetails.professionalDetails[0]['designation'] = (item) ? item.designation : ''
            assignmentDataArr.push(obj)
          })
          // const assigneeData = contentData.userDetails;
          this.assigneeData = { category, data: assignmentDataArr }
        }
      }
      if (category === 'Designation') {
        const assignmentDataArr: any = []
        contentData.assignmentTypeInfo.map((item: any) => {
          assignmentDataArr.push({ name: item })
        })
        this.assigneeData = { category, data: assignmentDataArr }
      }
      if (contentData &&
        contentData.contentList) {
        this.contentList = contentData.contentList
      }
      if (category.toLowerCase() !== 'alluser') {
        arr.push({
          name: contentData.contentType,
          tab: 'content',
          selected: (this.tab === 'content' ? true : false),
          count: this.contentList.length,
        })
        arr.push({
          name: contentData.assignmentType && contentData.assignmentType.toLowerCase() === 'customuser' ? 'Custom User': contentData.assignmentType,
          tab: 'assignee',
          selected: (this.tab === 'assignee' ? true : false),
          count: this.assigneeData.data ? this.assigneeData.data.length : 0,
        })
        this.allContentChips = arr
      } else {
        arr.push({
          name: contentData.contentType,
          tab: 'content',
          selected: (this.tab === 'content' ? true : false),
          count: this.contentList.length,
        })
        this.allContentChips = arr
      }
    } else if (this.form === 'content') {
      if (this.tpdsSvc.trainingPlanContentData &&
        this.tpdsSvc.trainingPlanContentData.data) {
        this.contentList = this.tpdsSvc.trainingPlanContentData.data.content.filter((item: any) => {
          return item.selected
        })
      }
    } else if (this.form === 'assignee') {
      if (this.tpdsSvc.trainingPlanAssigneeData) {
        const category = this.tpdsSvc.trainingPlanAssigneeData.category
        if (category === 'Designation') {
          const assigneeData = this.tpdsSvc.trainingPlanAssigneeData.data.filter((item: any) => {
            return item.selected
          })
          this.assigneeData = { category, data: assigneeData }
        } else if (category === 'CustomUser') {
          const assigneeData = this.tpdsSvc.trainingPlanAssigneeData.data.filter((item: any) => {
            return item.selected
          })
          this.assigneeData = { category, data: assigneeData }
        }
      }

    }
  }

  goBack() {
    this.router.navigate(this.navUrl.url, { queryParams: this.navUrl.queryParams })
  }

}
