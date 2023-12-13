import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common';
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service';
@Component({
  selector: 'ws-app-add-timeline-form',
  templateUrl: './add-timeline-form.component.html',
  styleUrls: ['./add-timeline-form.component.scss'],
  providers: [DatePipe]
})
export class AddTimelineFormComponent implements OnInit {
  todayDate:Date = new Date();
  constructor(private trainingPlanDataSharingService: TrainingPlanDataSharingService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.trainingPlanDataSharingService.trainingPlanStepperData['endDate'] = this.datePipe.transform(this.todayDate,"yyyy-MM-dd");
  }

  changeTimeline(timeline:any) {
    
    this.trainingPlanDataSharingService.trainingPlanStepperData['endDate'] = this.datePipe.transform(timeline,"yyyy-MM-dd");
    console.log('timeline',this.trainingPlanDataSharingService.trainingPlanStepperData);
  }

}
