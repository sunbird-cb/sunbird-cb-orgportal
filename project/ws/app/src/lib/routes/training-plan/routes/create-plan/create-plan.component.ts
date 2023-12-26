
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
@Component({
  selector: 'ws-app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss'],
})

export class CreatePlanComponent implements OnInit, OnDestroy {

  selectedTabData = 'createPlan'
  nextTab = ''
  createCheck: any
  planId = ''
  constructor(
    private route: ActivatedRoute,
    private tpdsSvc: TrainingPlanDataSharingService) {
  }

  ngOnDestroy() {

  }

  ngOnInit() {
    const contentData = this.route.snapshot.data['contentData']
    if (contentData) {
      this.tpdsSvc.trainingPlanTitle = contentData.name
      // this.tpdsSvc.trainingPlanContentData = { data: { content: contentData.contentList } }
      if (contentData.assignmentType === 'CustomUser') {
        this.tpdsSvc.trainingPlanAssigneeData = { data: { content: contentData.assignmentTypeInfo } }
      } else {
        this.tpdsSvc.trainingPlanAssigneeData = { category: contentData.assignmentType, data: [contentData.assignmentTypeInfo] }
      }
      if (contentData.contentList && contentData.contentList.length > 0) {
        contentData.contentList.forEach((ele: any) => {
          this.tpdsSvc.trainingPlanStepperData['contentList'].push(ele.identifier)
        })
      }
      this.tpdsSvc.trainingPlanStepperData['contentType'] = contentData.contentType
      this.tpdsSvc.trainingPlanStepperData['assignmentType'] = contentData.assignmentType
      this.tpdsSvc.trainingPlanStepperData['assignmentTypeInfo'] = contentData.assignmentTypeInfo
      this.tpdsSvc.trainingPlanStepperData['endDate'] = contentData.endDate
      this.tpdsSvc.trainingPlanStepperData['status'] = contentData.status
    }
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
