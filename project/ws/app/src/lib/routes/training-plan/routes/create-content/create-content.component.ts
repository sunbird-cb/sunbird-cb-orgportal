import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { TrainingPlanDataSharingService } from './../../services/training-plan-data-share.service'
import { MatDialog, MatSnackBar } from '@angular/material'
import { AddContentDialogComponent } from '../../components/add-content-dialog/add-content-dialog.component'
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
  pageIndex: any
  pageSize: any
  count = 0
  constructor(private tpdsSvc: TrainingPlanDataSharingService, public dialog: MatDialog, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.categoryData = [
      {
        id: 1,
        name: 'Courses',
        value: 'Course',
      },
      {
        id: 4,
        name: 'Curated Programs',
        value: 'Curated program',
      },
      // {
      //   id: 6,
      //   name: 'Programs',
      //   value: 'Program',
      // },
      {
        id: 3,
        name: 'Blended Programs',
        value: 'Blended program',
      },
      {
        id: 2,
        name: 'Standalone Assessments',
        value: 'Standalone Assessment',
      },
      {
        id: 5,
        name: 'Moderated Courses',
        value: 'Moderated Course',
      },
    ]
    // this.handleApiData(true)
  }

  handleApiData(event: any) {
    if (event && this.tpdsSvc.trainingPlanContentData) {
      if (this.tpdsSvc.trainingPlanStepperData &&
        this.tpdsSvc.trainingPlanStepperData.contentList) {
        if (this.tpdsSvc.trainingPlanContentData.data.content) {
          this.tpdsSvc.trainingPlanContentData.data.content.map((sitem: any) => {
            if (this.tpdsSvc.trainingPlanStepperData.contentList.filter((v: any) => (sitem && v === sitem.identifier)).length > 0) {
              sitem['selected'] = true
            }
          })
          this.tpdsSvc.trainingPlanContentData.data.content.map((sitem: any, index: any) => {
            if (sitem && sitem.selected) {
              this.tpdsSvc.trainingPlanContentData.data.content.splice(index, 1)
              this.tpdsSvc.trainingPlanContentData.data.content.unshift(sitem)
            }
          })
        }
        this.contentData = this.tpdsSvc.trainingPlanContentData.data.content
        this.count = this.tpdsSvc.trainingPlanContentData.data.count
        this.handleSelectedChips(true)
      } else {
        this.contentData = this.tpdsSvc.trainingPlanContentData.data.content
        this.count = this.tpdsSvc.trainingPlanContentData.data.count
      }
    }
  }

  handleSelectedChips(event: any) {
    this.selectContentCount = 0
    if (event) {
      this.selectedContentChips = this.tpdsSvc.trainingPlanContentData.data.content
      if (this.selectedContentChips) {
        this.selectedContentChips.map(sitem => {
          if (sitem && sitem.selected) {
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

  showAddContentDialog() {
    const dialogRef = this.dialog.open(AddContentDialogComponent, {
      maxHeight: 'auto',
      height: '75%',
      width: '60%',
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        if (response.data.responseCode === 'OK') {
          this.snackbar.open('Request shared successfully')
        } else {
          this.snackbar.open('Something went wrong please try again later!!')
        }
      }
    })
  }
}
