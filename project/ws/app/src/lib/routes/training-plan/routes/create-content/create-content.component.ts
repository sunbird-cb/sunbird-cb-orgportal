import { Component, OnInit } from '@angular/core'
import { TrainingPlanDataSharingService } from './../../services/training-plan-data-share.service';
@Component({
  selector: 'ws-app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {
  categoryData: any[] = [];
  contentData:any[] = [];
  from = 'content';
  selectedContentChips:any[] = [];
  selectContentCount:number = 0;
  constructor(private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
    this.categoryData = [
      {
       id: 1,
       name: 'Course',
       value: 'Course',
      },
      {
        id: 2,
        name: 'Program',
        value: 'Program',
      },
      {
        id: 3,
        name: 'Blended program',
        value: 'Blended program',
      },
      {
        id: 4,
        name: 'Curated program',
        value: 'Curated program',
      },
      {
        id: 5,
        name: 'Moderated Course',
        value: 'Moderated Course',
      },
    ];
    
    
  }

  handleApiData(event:any) {
    if(event) {
      console.log(this.trainingPlanDataSharingService.traingingPlanContentData);
      if(this.trainingPlanDataSharingService.trainingPlanStepperData &&
        this.trainingPlanDataSharingService.trainingPlanStepperData.contentList) {
        console.log('this.trainingPlanDataSharingService.traingingPlanContentData.data.content', this.trainingPlanDataSharingService.trainingPlanStepperData.contentList);
        this.trainingPlanDataSharingService.traingingPlanContentData.data.content.map((sitem:any)=> {
          if(this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.indexOf(sitem.identifier) > -1) {
            sitem['selected'] = true;
          }
        })
        this.contentData = this.trainingPlanDataSharingService.traingingPlanContentData.data.content;
        this.handleSelectedChips(true);
      } else {
        this.contentData = this.trainingPlanDataSharingService.traingingPlanContentData.data.content;
      }
      

    }
  }

  handleSelectedChips(event:any) {
    console.log('event', event);
    this.selectContentCount = 0;
    if(event) {
      this.selectedContentChips = this.trainingPlanDataSharingService.traingingPlanContentData.data.content;
      console.log('this.selectedContentChips', this.selectedContentChips);
      this.selectedContentChips.map((sitem)=>{
        if(sitem.selected) {
          this.selectContentCount = this.selectContentCount + 1;
          console.log('this.selectContentCount', this.selectContentCount);
        }
      })
    }
    
  }

}
