
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TrainingPlanService } from '../../services/traininig-plan.service';
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service';
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
  planId: string = '';
  constructor(private route: ActivatedRoute, private trainingPlanService: TrainingPlanService,
    private trainingPlanDataSharingService: TrainingPlanDataSharingService) {
  }
  ngOnDestroy() {

  }
  ngOnInit() {
    console.log("this.route", this.route, this.trainingPlanService);
    this.route.params.subscribe(params => {
      console.log('parans', params);
      this.planId = params['planId'];
      // let response  = {
      //   "id": "api.cbplan.read.byId",
      //   "ver": "1.0",
      //   "ts": "2023-12-04T05:53:32.031Z",
      //   "params": {
      //       "resmsgid": "749690f0-9269-11ee-80e8-4dda841c8af0",
      //       "msgid": "74879cd0-9269-11ee-82b8-cfe1f59faeaf",
      //       "status": "successful",
      //       "err": null,
      //       "errmsg": null
      //   },
      //   "responseCode": "OK",
      //   "result": {
      //       "content": {
      //           "id": 1,
      //           "name": "CBP Plan Name",
      //           "description": "CBP Plan Description",
      //           "contentList": [
      //               {
      //                   "identifier" : "doId1",
      //                   "name": "Course Name 1",
      //                   "description" : "Description",
      //                   "avgRating": 4.0,
      //                   "competencies_v5" : []
      //               },
      //               {
      //                   "identifier" : "doId2",
      //                   "name": "Course Name 2",
      //                   "description" : "Description",
      //                   "avgRating": 4.0,
      //                   "competencies_v5" : []
      //               }
      //           ],
      //           "userType": "custom",
      //           "userDetails": [
      //               {
      //                   "userId": "userId1",
      //                   "firstName": "User Name"
      //               },
      //               {
      //                   "userId": "userId2",
      //                   "firstName" : "User Name"
      //               }
      //           ],
      //           "endDate": "2023-12-14T10:00:00",
      //           "status": "Draft",
      //           "createdBy" : "adminUserId",
      //           "createdAt" : "timeStamp"
      //       }
      //   }
      // };


      this.trainingPlanService.readPlan(this.planId).subscribe((response: any) => {
        console.log('read data', response);
        if (response && response.result && response.result.content) {
          console.log('trainingPlanDataSharingService', this.trainingPlanDataSharingService);
          this.trainingPlanDataSharingService.trainingPlanTitle = response.result.content.name;
          this.trainingPlanDataSharingService.trainingPlanContentData = { data: { content: response.result.content.contentList } };
          if (this.trainingPlanDataSharingService.trainingPlanAssigneeData) {
            if (response.result.content.userType === 'custom') {
              this.trainingPlanDataSharingService.trainingPlanAssigneeData['category'] = 'Custom Users';
            } else {
              this.trainingPlanDataSharingService.trainingPlanAssigneeData['category'] = response.result.content.userType;
            }

          }

          if (response.result.content.userType === 'custom') {
            this.trainingPlanDataSharingService.trainingPlanAssigneeData = { data: { content: response.result.content.userDetails } }
          } else {
            this.trainingPlanDataSharingService.trainingPlanAssigneeData = response.result.content.userDetails;
          }

          this.trainingPlanDataSharingService.trainingPlanStepperData['endDate'] = response.result.content.endDate;
          this.trainingPlanDataSharingService.trainingPlanStepperData['status'] = response.result.content.status;
        }
      })
    });
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

  archivePlan() {
    let obj = {
      "request": {
        "id": this.planId,
        "comment": ""
      }
    }
    this.trainingPlanService.archivePlan(obj).subscribe((data: any) => {
      console.log('data', data);
    })
  }

  publishPlan() {
    let obj = {
      "request": {
        "id": this.planId,
        "comment": ""
      }
    }
    this.trainingPlanService.publishPlan(obj).subscribe((data: any) => {
      console.log('data', data);
    })
  }
}
