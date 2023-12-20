import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
@Component({
  selector: 'ws-app-training-plan-home',
  templateUrl: './training-plan-home.component.html',
  styleUrls: ['./training-plan-home.component.scss'],
  /* tslint:disable */
  host: { class: 'margin-top-l' },
  /* tslint:enable */
})
export class TrainingPlanHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  showModeratedNotification = false
  constructor(private trainingPlanDataSharingService: TrainingPlanDataSharingService
  ) {

  }
  ngOnInit() {
    this.trainingPlanDataSharingService.moderatedCourseSelectStatus.subscribe(status => {
      if (status) {
          this.showModeratedNotification = true
      } else {
        this.showModeratedNotification = false
      }
    })
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.trainingPlanDataSharingService.moderatedCourseSelectStatus.unsubscribe()
  }

  removeNotification() {
    this.showModeratedNotification = false
  }

}
