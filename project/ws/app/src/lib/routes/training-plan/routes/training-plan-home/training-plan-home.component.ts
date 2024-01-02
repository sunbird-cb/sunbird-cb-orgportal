import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
import { Subscription } from 'rxjs'
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
  private subscr: Subscription = new Subscription()
  constructor(private tpdsSvc: TrainingPlanDataSharingService
  ) {

  }
  ngOnInit() {
    this.subscr = this.subscr.add(this.tpdsSvc.moderatedCourseSelectStatus.subscribe(status => {
      if (status) {
        this.showModeratedNotification = true
      } else {
        this.showModeratedNotification = false
      }
    }))
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscr.unsubscribe()
  }

  removeNotification() {
    this.showModeratedNotification = false
  }

}
