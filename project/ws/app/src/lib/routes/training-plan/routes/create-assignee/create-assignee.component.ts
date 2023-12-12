import { Component, OnInit } from '@angular/core';
import { TrainingPlanDataSharingService } from './../../services/training-plan-data-share.service';

@Component({
  selector: 'ws-app-create-assignee',
  templateUrl: './create-assignee.component.html',
  styleUrls: ['./create-assignee.component.scss'],
})
export class CreateAssigneeComponent implements OnInit {
  categoryData: any[] = [];
  assigneeData:any[] = [];
  constructor(private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }
  from = 'assignee';
  ngOnInit() {
    this.categoryData = [
      {
       id: 1,
       name: 'Designation',
       value: 'Designation',
      },
      {
        id: 2,
        name: 'All Users',
        value: 'All Users',
      },
      {
        id: 3,
        name: 'Custom Users',
        value: 'Custom Users',
      },
    ]    
  }

  handleApiData(event:any) {
    if(event) {
      console.log(this.trainingPlanDataSharingService.traingingPlanAssigneeData);
      this.assigneeData = this.trainingPlanDataSharingService.traingingPlanAssigneeData;
    }
  }

}
