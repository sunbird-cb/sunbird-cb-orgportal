import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TrainingPlanDataSharingService {
  clearFilter = new Subject()
  trainingPlanCategoryChangeEvent = new Subject()
  moderatedCourseSelectStatus = new Subject()
  handleContentPageChange = new Subject()
  filterToggle = new Subject();
  getFilterDataObject = new Subject();
  trainingPlanTitle = ''
  trainingPlanContentData: any
  trainingPlanAssigneeData: any
  selectedTabType: any = ''
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

  resetAllObjects() {
    this.trainingPlanTitle = ''
    this.trainingPlanContentData = {}
    this.trainingPlanAssigneeData = {}
    this.selectedTabType = ''
    this.trainingPlanStepperData = {
      name: '',
      contentType: '',
      contentList: [
      ],
      assignmentType: '',
      assignmentTypeInfo: [
      ],
      endDate: '',
    }
  }
}
