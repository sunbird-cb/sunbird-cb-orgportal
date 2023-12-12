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
  selectAssigneeCount:number = 0;
  selectedAssigneeChips:any[] = [];
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

  handleSelectedChips(event:any) {
    console.log('event', event);
    this.selectAssigneeCount = 0;
    if(event) {
      this.selectedAssigneeChips = this.trainingPlanDataSharingService.traingingPlanAssigneeData.data;
      console.log('this.selectedAssigneeChips', this.selectedAssigneeChips);
      this.selectedAssigneeChips.map((sitem)=>{
        if(sitem.selected) {
          this.selectAssigneeCount = this.selectAssigneeCount + 1;
          console.log('this.selectContentCount', this.selectAssigneeCount);
        }
      })
    }
    
  }

}
