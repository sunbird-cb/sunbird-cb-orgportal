import { Component, OnInit } from '@angular/core'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
import { MatDialog } from '@angular/material'
import { PreviewDialogBoxComponent } from '../../components/preview-dialog-box/preview-dialog-box.component'
@Component({
  selector: 'ws-app-create-timeline',
  templateUrl: './create-timeline.component.html',
  styleUrls: ['./create-timeline.component.scss'],
})
export class CreateTimelineComponent implements OnInit {
  contentData: any[] = []
  assigneeData: any
  isContentLive: boolean = false
  dialogRef: any
  totalAssigneeCount: any = 0
  constructor(
    private trainingPlanDataSharingService: TrainingPlanDataSharingService,
    public dialog: MatDialog) { }

  ngOnInit() {
    if (this.trainingPlanDataSharingService.trainingPlanStepperData.status &&
      this.trainingPlanDataSharingService.trainingPlanStepperData.status.toLowerCase() === 'live') {
      this.isContentLive = true
    }
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
      this.totalAssigneeCount = assigneeData.length
      assigneeData.slice(0, 4)
      this.assigneeData = { category, data: assigneeData }
    }
    if (this.trainingPlanDataSharingService.trainingPlanAssigneeData &&
      this.trainingPlanDataSharingService.trainingPlanAssigneeData.data &&
      this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'CustomUser'
    ) {
      const category = this.trainingPlanDataSharingService.trainingPlanAssigneeData.category
      const assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.filter((item: any) => {
        return item.selected
      })
      this.totalAssigneeCount = assigneeData.length
      assigneeData.slice(0, 4)
      this.assigneeData = { category, data: assigneeData }
      console.log('this.assigneeData', this.assigneeData)
    }
  }

  showAll(from: string) {
    this.dialogRef = this.dialog.open(PreviewDialogBoxComponent, {
      disableClose: true,
      data: {
        from: from
      },
      autoFocus: false,
    })
    // this.router.navigate(['app', 'training-plan', 'preview-plan'])
    // this.router.navigate(['app', 'training-plan', 'preview-plan'], { queryParams: { from, tab } })
  }

}
