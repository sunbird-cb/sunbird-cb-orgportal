import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { TrainingPlanDataSharingService } from './../../services/training-plan-data-share.service'

@Component({
  selector: 'ws-app-create-assignee',
  templateUrl: './create-assignee.component.html',
  styleUrls: ['./create-assignee.component.scss'],
})
export class CreateAssigneeComponent implements OnInit {

  @Output() addAssigneeInvalid = new EventEmitter<any>()
  @Output() changeTabToTimeline = new EventEmitter<any>()

  categoryData: any[] = []
  assigneeData: any
  selectAssigneeCount = 0
  selectedAssigneeChips: any[] = []
  constructor(public tpdsSvc: TrainingPlanDataSharingService) { }
  from = 'assignee'
  ngOnInit() {
    this.categoryData = [
      {
        id: 1,
        name: 'Designation',
        value: 'Designation',
      },
      {
        id: 2,
        name: 'All User',
        value: 'AllUser',
      },
      {
        id: 3,
        name: 'Custom User',
        value: 'CustomUser',
      },
    ]
  }

  handleApiData(event: any) {
    if (event && this.tpdsSvc.trainingPlanAssigneeData) {
      if (this.tpdsSvc.trainingPlanStepperData &&
        this.tpdsSvc.trainingPlanAssigneeData.category === 'Designation' &&
        this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo) {
        this.tpdsSvc.trainingPlanAssigneeData.data.map((sitem: any) => {
          if (sitem && this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo.indexOf(sitem.name) > -1) {
            sitem['selected'] = true
          }
        })
        this.assigneeData = this.tpdsSvc.trainingPlanAssigneeData
        this.handleSelectedChips(true)
      } else if (this.tpdsSvc.trainingPlanStepperData &&
        this.tpdsSvc.trainingPlanAssigneeData.category === 'CustomUser' &&
        this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo) {
        this.tpdsSvc.trainingPlanAssigneeData.data.map((sitem: any) => {
          if (sitem && this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo.indexOf(sitem.userId) > -1) {
            sitem['selected'] = true
          }
        })
        this.assigneeData = this.tpdsSvc.trainingPlanAssigneeData
        this.handleSelectedChips(true)
      } else {
        this.assigneeData = this.tpdsSvc.trainingPlanAssigneeData
        this.addAssigneeInvalid.emit(false)
      }
    } else {
      if (this.tpdsSvc.trainingPlanAssigneeData.category === 'AllUser') {
        this.addAssigneeInvalid.emit(false)
      }
    }

  }

  handleSelectedChips(event: any) {
    this.selectAssigneeCount = 0
    if (event) {
      if (this.tpdsSvc.trainingPlanAssigneeData.category === 'Designation') {
        this.selectedAssigneeChips = this.tpdsSvc.trainingPlanAssigneeData.data
        if (this.selectedAssigneeChips) {
          this.selectedAssigneeChips.map((sitem: any) => {
            if (sitem && sitem.selected) {
              this.selectAssigneeCount = this.selectAssigneeCount + 1
            }
          })
        }
      } else if (this.tpdsSvc.trainingPlanAssigneeData.category === 'CustomUser') {
        this.selectedAssigneeChips = this.tpdsSvc.trainingPlanAssigneeData.data

        if (this.selectedAssigneeChips) {
          this.selectedAssigneeChips.map((sitem: any) => {
            if (sitem && sitem.selected) {
              this.selectAssigneeCount = this.selectAssigneeCount + 1
            }
          })
        }
      }

    }
    if (this.selectAssigneeCount <= 0) {
      this.addAssigneeInvalid.emit(true)
    } else {
      this.addAssigneeInvalid.emit(false)
    }
  }

  changeTab() {
    this.changeTabToTimeline.emit(false)
  }

}
