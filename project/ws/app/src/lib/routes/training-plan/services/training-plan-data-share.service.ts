import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class TrainingPlanDataSharingService {
  trainingPlanTitle: string = ''
  traingingPlanContentData: any
  traingingPlanAssigneeData: any
  constructor() {

  }
}
