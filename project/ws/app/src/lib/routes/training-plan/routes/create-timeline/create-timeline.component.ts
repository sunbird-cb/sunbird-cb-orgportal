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
  totalContentCount: any
  constructor(
    private tpdsSvc: TrainingPlanDataSharingService,
    public dialog: MatDialog) { }

  ngOnInit() {
    if (this.tpdsSvc.trainingPlanStepperData.status &&
      this.tpdsSvc.trainingPlanStepperData.status.toLowerCase() === 'live') {
      this.isContentLive = true
    }
    this.getContentData()
    switch (this.tpdsSvc.trainingPlanStepperData.assignmentType) {
      case 'Designation':
        this.getDesignationData()
        break
      case 'CustomUser':
        this.getCustomUserData()
        break
    }
  }

  getContentData() {
    if (this.tpdsSvc.trainingPlanContentData &&
      this.tpdsSvc.trainingPlanContentData.data &&
      this.tpdsSvc.trainingPlanContentData.data.content
    ) {
      let contentDataSelected = this.tpdsSvc.trainingPlanContentData.data.content.filter((item: any) => {
        return item.selected
      })
      this.totalContentCount = contentDataSelected.length
      contentDataSelected = contentDataSelected.slice(0, 4)
      this.contentData = contentDataSelected
    }
  }

  getDesignationData() {
    if (this.tpdsSvc.trainingPlanAssigneeData &&
      this.tpdsSvc.trainingPlanAssigneeData.data &&
      this.tpdsSvc.trainingPlanAssigneeData.category === 'Designation'
    ) {
      const category = this.tpdsSvc.trainingPlanAssigneeData.category
      let assigneeDataSelected = this.tpdsSvc.trainingPlanAssigneeData.data.filter((item: any) => {
        return item.selected
      })
      this.totalAssigneeCount = assigneeDataSelected.length
      assigneeDataSelected = assigneeDataSelected.slice(0, 4)
      this.assigneeData = { category, data: assigneeDataSelected }
    }
  }

  getCustomUserData() {
    if (this.tpdsSvc.trainingPlanAssigneeData &&
      this.tpdsSvc.trainingPlanAssigneeData.data &&
      this.tpdsSvc.trainingPlanAssigneeData.category === 'CustomUser'
    ) {
      const category = this.tpdsSvc.trainingPlanAssigneeData.category
      let assigneeDataSelected = this.tpdsSvc.trainingPlanAssigneeData.data.filter((item: any) => {
        return item.selected
      })
      this.totalAssigneeCount = assigneeDataSelected.length
      assigneeDataSelected = assigneeDataSelected.slice(0, 4)
      this.assigneeData = { category, data: assigneeDataSelected }
    }
  }

  showAll(from: string) {
    this.dialogRef = this.dialog.open(PreviewDialogBoxComponent, {
      disableClose: true,
      data: {
        from,
      },
      autoFocus: false,
      width: '90%',
    })
    this.dialogRef.afterClosed().subscribe(() => {
      this.getContentData()
      switch (this.tpdsSvc.trainingPlanStepperData.assignmentType) {
        case 'Designation':
          this.getDesignationData()
          break
        case 'CustomUser':
          this.getCustomUserData()
          break
      }
    })
  }

  contentRemoved() {
    this.getContentData()
  }

  selectedUserRemoved() {
    switch (this.tpdsSvc.trainingPlanStepperData.assignmentType) {
      case 'Designation':
        this.getDesignationData()
        break
      case 'CustomUser':
        this.getCustomUserData()
        break
    }
  }

}
