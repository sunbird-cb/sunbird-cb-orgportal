
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
@Component({
  selector: 'ws-app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss'],
})

export class CreatePlanComponent implements OnInit, AfterViewInit, OnDestroy {

  selectedTabData: string = 'createPlan'
  nextTab: string = ''

  constructor() {
  }
  ngOnDestroy() {

  }
  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  selectedTabAction(_event: any) {
    this.selectedTabData = _event
  }

  changeTab(_event: any) {
    this.nextTab = _event
  }
}
