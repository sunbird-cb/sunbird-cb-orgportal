import { Component, Input, OnInit } from '@angular/core'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service';
@Component({
  selector: 'ws-app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent implements OnInit {
  @Input() selectedContentChips:any[] = [];
  @Input() selectContentCount:number = 0;
  @Input() from:any;
  @Input() selectedAssigneeChips:any[] = [];
  @Input() selectAssigneeCount:number = 0;
  constructor(private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('selectedAssigneeChips--', this.selectedAssigneeChips);
  }

  clearAll() {
    if(this.from === 'content') {
      this.selectContentCount = 0;
      this.trainingPlanDataSharingService.traingingPlanContentData.data.content.map((sitem:any)=>{
        if(sitem['selected']) {
          sitem['selected'] = false;
        }
      })
      this.trainingPlanDataSharingService.trainingPlanStepperData.contentList = [];
      this.trainingPlanDataSharingService.trainingPlanStepperData.contentType = '';
    }
    if(this.from === 'assignee') {
      this.selectContentCount = 0;
      console.log('this.trainingPlanDataSharingService.traingingPlanAssigneeData',this.trainingPlanDataSharingService.traingingPlanAssigneeData);
      this.trainingPlanDataSharingService.traingingPlanAssigneeData.data.map((sitem:any)=>{
        if(sitem['selected']) {
          sitem['selected'] = false;
        }
      })
      this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo = [];
      this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentType = '';
    }
    
  }

  removeContent(item:any) {
    console.log('item', item);
    this.trainingPlanDataSharingService.traingingPlanContentData.data.content.map((sitem:any)=>{
      if(sitem['selected'] && sitem['identifier'] === item['identifier']) {
        sitem['selected'] = false;
      }
    })
    if(this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.indexOf(item['identifier']) > -1) {
      let index = this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.findIndex((x:any) => x === item['identifier']);
      this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.splice(index,1);
    }
  }

  removeAssignee(item:any) {
    console.log('item', item, this.trainingPlanDataSharingService.traingingPlanAssigneeData);
    this.trainingPlanDataSharingService.traingingPlanAssigneeData.data.map((sitem:any)=>{
      if(sitem['selected'] && sitem['id'] === item['id']) {
        sitem['selected'] = false;
      }      
    })
    if(this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.indexOf(item['identifier']) > -1) {
      let index = this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.findIndex((x:any) => x === item['id']);
      this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.splice(index,1);
    }
  }

}
