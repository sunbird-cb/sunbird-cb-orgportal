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

  tabType = TrainingPlanContent.TTabLabelKey
  tabIndexValue: number = 0

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.changeTabOnNext) {
      switch (this.changeTabOnNext) {
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
    const tempData = _event.tab.textLabel
    this.selectedTabType.emit(tempData)
  }

}
