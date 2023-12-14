import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
@Component({
  selector: 'ws-app-create-timeline',
  templateUrl: './create-timeline.component.html',
  styleUrls: ['./create-timeline.component.scss'],
})
export class CreateTimelineComponent implements OnInit {
  contentData: any[] = []
  assigneeData: any
  constructor(private router: Router, private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
    if (this.trainingPlanDataSharingService.trainingPlanContentData &&
      this.trainingPlanDataSharingService.trainingPlanContentData.data &&
      this.trainingPlanDataSharingService.trainingPlanContentData.data.content
    ) {
      this.contentData = this.trainingPlanDataSharingService.trainingPlanContentData.data.content.filter((item: any) => {
        return item.selected
      })

    }
    if (this.trainingPlanDataSharingService.trainingPlanAssigneeData &&
      this.trainingPlanDataSharingService.trainingPlanAssigneeData.data &&
      this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'Designation'
    ) {
      const category = this.trainingPlanDataSharingService.trainingPlanAssigneeData.category
      const assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.filter((item: any) => {
        return item.selected
      })
      this.assigneeData = { category, data: assigneeData }
    }
    if (this.trainingPlanDataSharingService.trainingPlanAssigneeData &&
      this.trainingPlanDataSharingService.trainingPlanAssigneeData.data &&
      this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'Custom Users'
    ) {
      let category = this.trainingPlanDataSharingService.trainingPlanAssigneeData.category
      let assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.content.filter((item: any) => {
        return item.selected
      })
      this.assigneeData = { 'category': category, 'data' : {'content': assigneeData} } ;

      console.log('this.assigneeData', this.assigneeData)
    }
  }

  showAll(from:string, tab:string) {
    // this.router.navigate(['app', 'training-plan', 'preview-plan'])
    this.router.navigate(['app', 'training-plan', 'preview-plan'], { queryParams: {from , tab}})
  }

}
