import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service';
@Component({
  selector: 'ws-app-create-timeline',
  templateUrl: './create-timeline.component.html',
  styleUrls: ['./create-timeline.component.scss'],
})
export class CreateTimelineComponent implements OnInit {
  contentData:any[] = [];
  assigneeData:any;
  constructor(private router: Router, private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
    if(this.trainingPlanDataSharingService.traingingPlanContentData && 
      this.trainingPlanDataSharingService.traingingPlanContentData.data && 
      this.trainingPlanDataSharingService.traingingPlanContentData.data.content
      ) {
        this.contentData = this.trainingPlanDataSharingService.traingingPlanContentData.data.content.filter((item:any)=>{
          return item.selected
        })

    }
    
    console.log('this.contentData', this.contentData);
    console.log('this.trainingPlanDataSharingService.traingingPlanAssigneeData', this.trainingPlanDataSharingService.traingingPlanAssigneeData);
    if(this.trainingPlanDataSharingService.traingingPlanAssigneeData &&
      this.trainingPlanDataSharingService.traingingPlanAssigneeData.data
      ) {
        let category = this.trainingPlanDataSharingService.traingingPlanAssigneeData.category;
    let assigneeData = this.trainingPlanDataSharingService.traingingPlanAssigneeData.data.filter((item:any)=>{
      return item.selected;
    });
    this.assigneeData = {'category':category,data:assigneeData};

    console.log('this.assigneeData', this.assigneeData);
  }
  }

  showAll() {
    this.router.navigate(['app', 'training-plan', 'preview-plan'])
  }

}
