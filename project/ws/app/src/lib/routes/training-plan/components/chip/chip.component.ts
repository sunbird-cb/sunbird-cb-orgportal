import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
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

  constructor(private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  clearAll() {
    if (this.from === 'content') {
      this.selectContentCount = 0
      this.trainingPlanDataSharingService.trainingPlanContentData.data.content.map((sitem: any) => {
        if (sitem['selected']) {
          sitem['selected'] = false
        }
      })
      this.trainingPlanDataSharingService.trainingPlanStepperData.contentList = []
      this.trainingPlanDataSharingService.trainingPlanStepperData.contentType = ''
    }
    if (this.from === 'assignee') {
      this.selectAssigneeCount = 0
      this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any) => {
        if (sitem['selected']) {
          sitem['selected'] = false
        }
      })
      this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo = []
      this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentType = ''
    }
    this.itemRemoved.emit(true)
  }

  removeContent(item: any) {
    this.trainingPlanDataSharingService.trainingPlanContentData.data.content.map((sitem: any) => {
      if (sitem['selected'] && sitem['identifier'] === item['identifier']) {
        sitem['selected'] = false
      }
    })
    if (this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.indexOf(item['identifier']) > -1) {
      const index = this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.findIndex((x: any) => x === item['identifier'])
      this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.splice(index, 1)
    }
    this.itemRemoved.emit(true)
  }

  removeAssignee(item: any) {
    this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any) => {
      if (sitem['selected'] && sitem['id'] === item['id']) {
        sitem['selected'] = false
      }
    })
    if (this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.indexOf(item['identifier']) > -1) {
      const index = this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.findIndex((x: any) => x === item['id'])
      this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.splice(index, 1)
    }
  }

}
