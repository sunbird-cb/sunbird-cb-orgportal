import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class TrainingPlanDataSharingService {
  trainingPlanTitle: string = ''
  trainingPlanContentData: any
  trainingPlanAssigneeData: any
  trainingPlanStepperData: any = {
    "name": "CBP Plan Name",
    "contentType": "",
    "contentList": [
    ],
    "assignmentType": "",
    "assignmentTypeInfo": [
    ],
    "endDate": ""
  };
  constructor() {

  }
}
