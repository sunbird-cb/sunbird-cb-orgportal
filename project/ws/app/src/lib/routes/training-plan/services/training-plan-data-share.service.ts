import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TrainingPlanDataSharingService {
  trainingPlanCategoryChangeEvent = new Subject()
  trainingPlanTitle = ''
  trainingPlanContentData: any
  trainingPlanAssigneeData: any
  trainingPlanStepperData: any = {
    name: '',
    contentType: '',
    contentList: [
    ],
    assignmentType: '',
    assignmentTypeInfo: [
    ],
    endDate: '',
  }
  constructor() {

  }
}
