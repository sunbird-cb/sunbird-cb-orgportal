import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service';
@Component({
  selector: 'ws-app-preview-plan',
  templateUrl: './preview-plan.component.html',
  styleUrls: ['./preview-plan.component.scss'],
})
export class PreviewPlanComponent implements OnInit {
  contentData:any = [];
  from:any = '';
  constructor(private router: Router, private route: ActivatedRoute, private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
    this.from = this.route.snapshot.queryParams['from'];
    console.log('from', this.from, this.trainingPlanDataSharingService);
    if(this.from === 'content') {
      if( this.trainingPlanDataSharingService.trainingPlanContentData &&
        this.trainingPlanDataSharingService.trainingPlanContentData.data ) {
          this.contentData = this.trainingPlanDataSharingService.trainingPlanContentData.data.content.filter((item: any) => {
            return item.selected
          })
        }
      
    } else if(this.from === 'assignee') {
      let category = this.trainingPlanDataSharingService.trainingPlanAssigneeData.category
      let assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.filter((item: any) => {
        return item.selected
      })
      this.contentData = { 'category': category, data: assigneeData }
    }
    
  }

  goBack() {
    this.router.navigateByUrl('/app/training-plan/create-plan')
  }

}