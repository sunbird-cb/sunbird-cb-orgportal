import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
import { MatDialog } from '@angular/material'
import { PreviewDialogBoxComponent } from '../preview-dialog-box/preview-dialog-box.component'
@Component({
  selector: 'ws-app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent implements OnInit, OnChanges {
  @Input() selectedContentChips: any[] = []
  @Input() selectContentCount = 0
  @Input() from: any
  @Input() selectedAssigneeChips: any[] = []
  @Input() selectAssigneeCount = 0
  @Output() itemRemoved = new EventEmitter<any>()

  dialogRef: any

  constructor(
    public tpdsSvc: TrainingPlanDataSharingService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedContentChips.map((sitem: any, index: any) => {
      if (sitem && sitem.selected) {
        this.selectedContentChips.splice(index, 1)
        this.selectedContentChips.unshift(sitem)
      }
    })
    this.selectedAssigneeChips.map((sitem: any, index: any) => {
      if (sitem && sitem.selected) {
        this.selectedAssigneeChips.splice(index, 1)
        this.selectedAssigneeChips.unshift(sitem)
      }
    })
  }

  clearAll() {
    if (this.from === 'content') {
      this.selectContentCount = 0
      this.tpdsSvc.trainingPlanContentData.data.content.map((sitem: any) => {
        if (sitem && sitem['selected']) {
          sitem['selected'] = false
        }
      })
      this.tpdsSvc.trainingPlanStepperData.contentList = []
      this.tpdsSvc.trainingPlanStepperData.contentType = ''
    }
    if (this.from === 'assignee') {
      this.selectAssigneeCount = 0
      if (this.tpdsSvc.trainingPlanAssigneeData.category === 'Designation') {
        this.tpdsSvc.trainingPlanAssigneeData.data.map((sitem: any) => {
          if (sitem['selected']) {
            sitem['selected'] = false
          }
        })
      } else if (this.tpdsSvc.trainingPlanAssigneeData.category === 'CustomUser') {
        this.tpdsSvc.trainingPlanAssigneeData.data.map((sitem: any) => {
          if (sitem['selected']) {
            sitem['selected'] = false
          }
        })
      }

      this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo = []
      this.tpdsSvc.trainingPlanStepperData.assignmentType = ''
    }
    this.itemRemoved.emit(true)
  }

  removeContent(item: any) {
    this.tpdsSvc.trainingPlanContentData.data.content.map((sitem: any) => {
      if (sitem && sitem['selected'] && sitem['identifier'] === item['identifier']) {
        sitem['selected'] = false
      }
    })
    if (this.tpdsSvc.trainingPlanStepperData.contentList.indexOf(item['identifier']) > -1) {
      const index = this.tpdsSvc.trainingPlanStepperData.contentList.findIndex((x: any) => x === item['identifier'])
      this.tpdsSvc.trainingPlanStepperData.contentList.splice(index, 1)
    }
    if (this.selectContentCount) {
      this.selectContentCount = this.selectContentCount - 1
    }

    this.itemRemoved.emit(true)

  }

  removeAssignee(item: any) {
    if (this.tpdsSvc.trainingPlanAssigneeData.category === 'Designation') {
      this.tpdsSvc.trainingPlanAssigneeData.data.map((sitem: any) => {
        if (sitem.name === item.name && sitem['selected']) {
          sitem['selected'] = false
        }
      })
      if (this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo.indexOf(item['name']) > -1) {
        const index =
          this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo.findIndex((x: any) => x === item['name'])
        this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo.splice(index, 1)
      }
      this.itemRemoved.emit(true)
    } else if (this.tpdsSvc.trainingPlanAssigneeData.category === 'CustomUser') {
      this.tpdsSvc.trainingPlanAssigneeData.data.map((sitem: any) => {
        if (sitem && sitem['selected'] && sitem['userId'] === item['userId']) {
          sitem['selected'] = false
        }
      })
      if (this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo.indexOf(item['identifier']) > -1) {
        const index =
          this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo.findIndex((x: any) => x === item['userId'])
        this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo.splice(index, 1)
      }
      this.itemRemoved.emit(true)
    }
  }

  navigateToPreviewPage() {
    this.dialogRef = this.dialog.open(PreviewDialogBoxComponent, {
      disableClose: true,
      data: {
        from: this.from,
      },
      autoFocus: false,
      width: '90%'
    })
    this.dialogRef.afterClosed().subscribe(() => {
      this.itemRemoved.emit(true)
    })
    // this.router.navigate(['app', 'training-plan', 'preview-plan'], { queryParams: { from: this.from } })
  }

}
