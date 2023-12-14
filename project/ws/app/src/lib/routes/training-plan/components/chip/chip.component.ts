import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service';
import { Router } from '@angular/router'
@Component({
  selector: 'ws-app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent implements OnInit {
  @Input() selectedContentChips: any[] = [];
  @Input() selectContentCount: number = 0;
  @Input() from: any
  @Input() selectedAssigneeChips: any[] = [];
  @Input() selectAssigneeCount: number = 0;
  @Output() itemRemoved = new EventEmitter<any>()

  constructor(private trainingPlanDataSharingService: TrainingPlanDataSharingService, private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('selectedAssigneeChips--', this.selectedAssigneeChips)
  }

  clearAll() {
    if (this.from === 'content') {
      this.selectContentCount = 0
      this.trainingPlanDataSharingService.trainingPlanContentData.data.content.map((sitem: any) => {
        if (sitem['selected']) {
          sitem['selected'] = false
        }
      })
      this.trainingPlanDataSharingService.trainingPlanStepperData.contentList = []
      this.trainingPlanDataSharingService.trainingPlanStepperData.contentType = ''
    }
    if (this.from === 'assignee') {
      this.selectAssigneeCount = 0
      console.log('this.trainingPlanDataSharingService.trainingPlanAssigneeData', this.trainingPlanDataSharingService.trainingPlanAssigneeData)
      if(this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'Designation') {
        this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any) => {
          if (sitem['selected']) {
            sitem['selected'] = false
          }
        })
      } else if(this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'Custom Users') {
        this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.content.map((sitem: any) => {
          if (sitem['selected']) {
            sitem['selected'] = false
          }
        })
      }
     
      this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo = []
      this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentType = ''
    }
    this.itemRemoved.emit(true)
  }

  removeContent(item: any) {
    console.log('item', item)
    this.trainingPlanDataSharingService.trainingPlanContentData.data.content.map((sitem: any) => {
      if (sitem['selected'] && sitem['identifier'] === item['identifier']) {
        sitem['selected'] = false
      }
    })
    if (this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.indexOf(item['identifier']) > -1) {
      let index = this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.findIndex((x: any) => x === item['identifier'])
      this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.splice(index, 1)
    }
    this.itemRemoved.emit(true)
  }

  removeAssignee(item: any) {
    console.log('item', item, this.trainingPlanDataSharingService.trainingPlanAssigneeData)
    if(this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'Designation') {
      this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any) => {
        if (sitem['selected'] && sitem['id'] === item['id']) {
          sitem['selected'] = false
        }
      })
      if (this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo.indexOf(item['identifier']) > -1) {
        let index = this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo.findIndex((x: any) => x === item['id'])
        this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo.splice(index, 1)
      }
    } else if (this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'Custom Users') {
      this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.content.map((sitem: any) => {
        if (sitem['selected'] && sitem['userId'] === item['userId']) {
          sitem['selected'] = false
        }
      })
      if (this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo.indexOf(item['identifier']) > -1) {
        let index = this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo.findIndex((x: any) => x === item['userId'])
        this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo.splice(index, 1)
      }
    }
    
  }

  navigateToPreviewPage() {
    this.router.navigate(['app', 'training-plan', 'preview-plan'], { queryParams: {from : this.from}})
  }

}
