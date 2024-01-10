import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter'
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD MMM, YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY',
  },
}
@Component({
  selector: 'ws-app-add-timeline-form',
  templateUrl: './add-timeline-form.component.html',
  styleUrls: ['./add-timeline-form.component.scss'],
  providers: [DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class AddTimelineFormComponent implements OnInit {

  minDate: Date = new Date()
  todayDate: Date = new Date()
  constructor(private tpdsSvc: TrainingPlanDataSharingService, private datePipe: DatePipe) { }

  ngOnInit() {
    if (this.tpdsSvc.trainingPlanStepperData['endDate']) {
      this.todayDate = new Date(this.tpdsSvc.trainingPlanStepperData['endDate'])
    } else {
      this.tpdsSvc.trainingPlanStepperData['endDate'] = this.datePipe.transform(this.todayDate, 'yyyy-MM-dd')
    }
  }

  changeTimeline(timeline: any) {
    this.tpdsSvc.trainingPlanStepperData['endDate'] = this.datePipe.transform(timeline, 'yyyy-MM-dd')
  }

}
