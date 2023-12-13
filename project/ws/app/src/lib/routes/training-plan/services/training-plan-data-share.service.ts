import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class TrainingPlanDataSharingService {
  traingingPlanContentData: any;
  traingingPlanAssigneeData:any;
  trainingPlanStepperData:any = {
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
