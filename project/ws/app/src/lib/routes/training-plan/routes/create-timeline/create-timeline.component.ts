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
  isContentLive = false
  dialogRef: any
  totalAssigneeCount: any = 0
  constructor(
    private tpdsSvc: TrainingPlanDataSharingService,
    public dialog: MatDialog) { }

  ngOnInit() {
    if (this.tpdsSvc.trainingPlanStepperData.status &&
      this.tpdsSvc.trainingPlanStepperData.status.toLowerCase() === 'live') {
      this.isContentLive = true
    }
    if (this.tpdsSvc.trainingPlanContentData &&
      this.tpdsSvc.trainingPlanContentData.data &&
      this.tpdsSvc.trainingPlanContentData.data.content
    ) {
      this.contentData = this.tpdsSvc.trainingPlanContentData.data.content.filter((item: any) => {
        return item.selected
      })

    }
    if (this.tpdsSvc.trainingPlanAssigneeData &&
      this.tpdsSvc.trainingPlanAssigneeData.data &&
      this.tpdsSvc.trainingPlanAssigneeData.category === 'Designation'
    ) {
      const category = this.tpdsSvc.trainingPlanAssigneeData.category
      const assigneeData = this.tpdsSvc.trainingPlanAssigneeData.data.filter((item: any) => {
        return item.selected
      })
      this.totalAssigneeCount = assigneeData.length
      assigneeData.slice(0, 4)
      this.assigneeData = { category, data: assigneeData }
    }
    if (this.tpdsSvc.trainingPlanAssigneeData &&
      this.tpdsSvc.trainingPlanAssigneeData.data &&
      this.tpdsSvc.trainingPlanAssigneeData.category === 'CustomUser'
    ) {
      const category = this.tpdsSvc.trainingPlanAssigneeData.category
      const assigneeData = this.tpdsSvc.trainingPlanAssigneeData.data.filter((item: any) => {
        return item.selected
      })
      this.totalAssigneeCount = assigneeData.length
      assigneeData.slice(0, 4)
      this.assigneeData = { category, data: assigneeData }
    }
  }

  showAll(from: string) {
    this.dialogRef = this.dialog.open(PreviewDialogBoxComponent, {
      disableClose: true,
      data: {
        from,
      },
      autoFocus: false,
    })
    // this.router.navigate(['app', 'training-plan', 'preview-plan'])
    // this.router.navigate(['app', 'training-plan', 'preview-plan'], { queryParams: { from, tab } })
  }

}
