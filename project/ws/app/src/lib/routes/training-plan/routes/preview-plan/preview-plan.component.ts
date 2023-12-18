import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
@Component({
  selector: 'ws-app-preview-plan',
  templateUrl: './preview-plan.component.html',
  styleUrls: ['./preview-plan.component.scss'],
})
export class PreviewPlanComponent implements OnInit {
  contentData: any = []
  assigneeData: any = []
  from: any = ''
  tab: any = ''
  allContentChips: any = []
  selectedTab = ''
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
    this.from = this.route.snapshot.queryParams['from']
    this.tab = this.selectedTab = this.route.snapshot.queryParams['tab']
    if (this.from === 'content') {
      if (this.trainingPlanDataSharingService.trainingPlanContentData &&
        this.trainingPlanDataSharingService.trainingPlanContentData.data) {
        this.contentData = this.trainingPlanDataSharingService.trainingPlanContentData.data.content.filter((item: any) => {
          return item.selected
        })
      }
    } else if (this.from === 'assignee') {
      const category = this.trainingPlanDataSharingService.trainingPlanAssigneeData.category
      if (category === 'Designation') {
        const assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.filter((item: any) => {
          return item.selected
        })
        this.assigneeData = { category, data: assigneeData }
      } else if (category === 'Custom Users') {
        const assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.filter((item: any) => {
          return item.selected
        })
        this.assigneeData = { category, data:  assigneeData }
      }

    } else if (this.from === 'all') {
      const arr = []
      arr.push({
        name: this.trainingPlanDataSharingService.trainingPlanStepperData.contentType,
        tab: 'content',
        selected: (this.tab === 'content' ? true : false),
      })
      this.allContentChips = arr
      arr.push({
        name: this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentType,
        tab: 'assignee',
        selected: (this.tab === 'assignee' ? true : false),
      })
      this.allContentChips = arr
      if (this.trainingPlanDataSharingService.trainingPlanAssigneeData) {
        const category = this.trainingPlanDataSharingService.trainingPlanAssigneeData.category
        if (category === 'Custom Users') {
          const assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.filter((item: any) => {
            return item.selected
          })
          this.assigneeData = { category, data: assigneeData }
        }
        if (category === 'Designation') {
          const assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.filter((item: any) => {
            return item.selected
          })
          this.assigneeData = { category, data: assigneeData }
        }
      }

      if (this.trainingPlanDataSharingService.trainingPlanContentData &&
        this.trainingPlanDataSharingService.trainingPlanContentData.data) {
        this.contentData = this.trainingPlanDataSharingService.trainingPlanContentData.data.content.filter((item: any) => {
          return item.selected
        })
      }

    }

  }

  goBack() {
    this.router.navigateByUrl('/app/training-plan/create-plan')
  }

}
