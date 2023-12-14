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
        name: 'All Users',
        value: 'All Users',
      },
      {
        id: 3,
        name: 'Custom Users',
        value: 'Custom Users',
      },
    ]
  }

  handleApiData(event: any) {
    if (event && this.trainingPlanDataSharingService.trainingPlanAssigneeData) {
      if (this.trainingPlanDataSharingService.trainingPlanStepperData &&
        this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo) {
        this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any) => {
          if (this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo.indexOf(sitem.id) > -1) {
            sitem['selected'] = true
          }
        })
        this.assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData
        this.handleSelectedChips(true)
      } else {
        this.assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData
      }
    }
    if (this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'All Users') {
      this.addAssigneeInvalid.emit(false)
    }
  }

  handleSelectedChips(event: any) {
    this.selectAssigneeCount = 0
    if (event) {
      this.selectedAssigneeChips = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data
      this.selectedAssigneeChips.map(sitem => {
        if (sitem.selected) {
          this.selectAssigneeCount = this.selectAssigneeCount + 1
        }
      })
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
