import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { TrainingPlanDataSharingService } from './../../services/training-plan-data-share.service'
@Component({
  selector: 'ws-app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {

  @Output() addContentInvalid = new EventEmitter<any>()

  categoryData: any[] = []
  contentData: any[] = []
  from = 'content'
  selectedContentChips: any[] = []
  selectContentCount = 0
  constructor(private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
    this.categoryData = [
      {
        id: 1,
        name: 'Course',
        value: 'Course',
      },
      {
        id: 4,
        name: 'Curated program',
        value: 'Curated program',
      },
      {
        id: 3,
        name: 'Blended program',
        value: 'Blended program',
      },
      {
        id: 2,
        name: 'Program',
        value: 'Program',
      },
      {
        id: 5,
        name: 'Moderated Course',
        value: 'Moderated Course',
      },
    ]
    this.handleApiData(true)
  }

  handleApiData(event: any) {
    if (event && this.trainingPlanDataSharingService.trainingPlanContentData) {
      if (this.trainingPlanDataSharingService.trainingPlanStepperData &&
        this.trainingPlanDataSharingService.trainingPlanStepperData.contentList) {
        if (this.trainingPlanDataSharingService.trainingPlanContentData &&
          this.trainingPlanDataSharingService.trainingPlanContentData.data.content) {
          this.trainingPlanDataSharingService.trainingPlanContentData.data.content.map((sitem: any) => {
            if (this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.indexOf(sitem.identifier) > -1) {
              sitem['selected'] = true
            }
          })
        }
        this.contentData = this.trainingPlanDataSharingService.trainingPlanContentData.data.content
        this.handleSelectedChips(true)
      } else {
        this.contentData = this.trainingPlanDataSharingService.trainingPlanContentData.data.content
      }
    }
  }

  handleSelectedChips(event: any) {
    this.selectContentCount = 0
    if (event) {
      this.selectedContentChips = this.trainingPlanDataSharingService.trainingPlanContentData.data.content
      if (this.selectedContentChips) {
        this.selectedContentChips.map(sitem => {
          if (sitem.selected) {
            this.selectContentCount = this.selectContentCount + 1
          }
        })
      }
    }
    if (this.selectContentCount <= 0) {
      this.addContentInvalid.emit(true)
    } else {
      this.addContentInvalid.emit(false)
    }
  }

  itemsRemovedFromChip() {
    this.handleSelectedChips(true)
  }

}
