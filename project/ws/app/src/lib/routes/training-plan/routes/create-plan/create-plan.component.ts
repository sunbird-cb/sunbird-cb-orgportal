
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

  selectedTabData = 'createPlan'
  nextTab = ''
  createCheck: any

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
    this.nextTab = _event
  }

  changeTab(_event: any) {
    this.nextTab = _event
  }

  isPlanTitleInvalid(_event: any) {
    this.createCheck = {
      ...this.createCheck,
      titleIsInvalid: _event,
    }
  }

  isAddContentInvalid(_event: any) {
    this.createCheck = {
      ...this.createCheck,
      addContentIsInvalid: _event,
    }
  }

  isAddAssigneeInvalid(_event: any) {
    this.createCheck = {
      ...this.createCheck,
      addAssigneeIsInvalid: _event,
    }
  }
}
