import { Injectable } from '@angular/core'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingPlanDataSharingService {
  trainingPlanCategoryChangeEvent = new Subject();
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
