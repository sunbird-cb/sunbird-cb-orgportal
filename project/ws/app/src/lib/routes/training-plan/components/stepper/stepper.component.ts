import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core'
import { TrainingPlanContent } from '../../models/training-plan.model'

@Component({
  selector: 'ws-app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit, OnChanges {

  @Input() changeTabOnNext!: string
  @Output() selectedTabType = new EventEmitter<any>()
  @Output() titleInvalid = new EventEmitter<any>()
  @Output() addContentIsInvalid = new EventEmitter<any>()
  @Output() addAssigneeIsInvalid = new EventEmitter<any>()

  tabType = TrainingPlanContent.TTabLabelKey
  tabIndexValue = 0
  addCotnentDisable = true
  addAssigneeDisable = true
  addTimelineDisable = true

  constructor(
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.changeTabOnNext) {
      switch (this.changeTabOnNext) {
        case TrainingPlanContent.TTabLabelKey.CREATE_PLAN:
          this.tabIndexValue = 0
          break
        case TrainingPlanContent.TTabLabelKey.ADD_CONTENT:
          this.tabIndexValue = 1
          break
        case TrainingPlanContent.TTabLabelKey.ADD_ASSIGNEE:
          this.tabIndexValue = 2
          break
        case TrainingPlanContent.TTabLabelKey.ADD_TIMELINE:
          this.tabIndexValue = 3
          break
      }
    }
  }

  tabSelected(_event: any) {
    this.tabIndexValue = _event.index
    const tempData = _event.tab.textLabel
    this.selectedTabType.emit(tempData)
  }

  checkForPlanTitle(_event: any) {
    setTimeout(() => {
      this.addCotnentDisable = _event
      this.titleInvalid.emit(_event)
    }, 0)
  }

  checkForaddContent(_event: any) {
    setTimeout(() => {
      this.addAssigneeDisable = _event
      this.addContentIsInvalid.emit(_event)
    }, 0)
  }

  checkForaddAssignee(_event: any) {
    setTimeout(() => {
      this.addTimelineDisable = _event
      this.addAssigneeIsInvalid.emit(_event)
    }, 0)
  }

  tabChangeToTimeline(_event: any) {
    setTimeout(() => {
      this.addTimelineDisable = _event
      this.addAssigneeIsInvalid.emit(_event)
    }, 0)
    this.tabIndexValue = 3
  }
}
