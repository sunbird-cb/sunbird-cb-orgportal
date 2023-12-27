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
  constructor(public trainingPlanDataSharingService: TrainingPlanDataSharingService) { }
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
    if (event && this.trainingPlanDataSharingService.trainingPlanAssigneeData) {
      if (this.trainingPlanDataSharingService.trainingPlanStepperData &&
        this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'Designation' &&
        this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo) {
        this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any) => {
          if (this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo.indexOf(sitem.name) > -1) {
            sitem['selected'] = true
          }
        })
        this.assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData
        this.handleSelectedChips(true)
      } else if (this.trainingPlanDataSharingService.trainingPlanStepperData &&
        this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'CustomUser' &&
        this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo) {
        this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any) => {
          if (this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo.indexOf(sitem.userId) > -1) {
            sitem['selected'] = true
          }
        })
        this.assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData
        this.handleSelectedChips(true)
      } else {
        this.assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData
        this.addAssigneeInvalid.emit(false)
      }
    } else {
      if (this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'AllUser') {
        this.addAssigneeInvalid.emit(false)
      }
    }

  }

  handleSelectedChips(event: any) {
    this.selectAssigneeCount = 0
    if (event) {
      if (this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'Designation') {
        this.selectedAssigneeChips = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data
        if (this.selectedAssigneeChips) {
          this.selectedAssigneeChips.map((sitem: any) => {
            if (sitem.selected) {
              this.selectAssigneeCount = this.selectAssigneeCount + 1
            }
          })
        }
      } else if (this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'CustomUser') {
        this.selectedAssigneeChips = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data

        if (this.selectedAssigneeChips) {
          this.selectedAssigneeChips.map((sitem: any) => {
            if (sitem.selected) {
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
