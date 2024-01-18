import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core'
import { MatDialog } from '@angular/material'
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation.box.component'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'ws-app-category-drop-down',
  templateUrl: './category-drop-down.component.html',
  styleUrls: ['./category-drop-down.component.scss'],
})
export class CategoryDropDownComponent implements OnInit, OnChanges {
  @Input() categoryData: any[] = []
  @Input() from = ''
  @Output() handleCategorySelection: any = new EventEmitter()
  dialogRef: any
  selectedValue: any
  constructor(public dialog: MatDialog, private tpdsSvc: TrainingPlanDataSharingService) { }

  ngOnInit() {
    // if(this.from === 'content') {
    //   this.handleCategorySelection.emit('Course');
    // } else if(this.from === 'assignee') {
    //   this.handleCategorySelection.emit('Designation');
    // }
    this.tpdsSvc.trainingPlanCategoryChangeEvent.pipe(debounceTime(700)).subscribe((data: any) => {
      if (data && data.event) {
        if (data.event === 'Course' ||
          data.event === 'Standalone Assessment' ||
          data.event === 'Program' ||
          data.event === 'Blended program' ||
          data.event === 'Curated program' ||
          data.event === 'Moderated Course'
        ) {
          this.tpdsSvc.trainingPlanStepperData.contentList = []
          this.tpdsSvc.trainingPlanContentData.data = []
        } else if (data.event === 'Designation' || data.event === 'AllUser' || data.event === 'CustomUser') {
          this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo = []
          this.tpdsSvc.trainingPlanAssigneeData.data = []
          this.tpdsSvc.trainingPlanStepperData['assignmentTypeInfo'] = []
        }
        this.handleCategorySelection.emit(data.event)
      }
    })
  }

  ngOnChanges() {
    this.checkForContent()
  }

  checkForContent() {
    if (this.from === 'content') {
      if (this.tpdsSvc.trainingPlanStepperData['contentType']) {
        this.selectedValue = this.tpdsSvc.trainingPlanStepperData['contentType']
        this.handleCategorySelection.emit(this.tpdsSvc.trainingPlanStepperData['contentType'])
      } else {
        this.tpdsSvc.trainingPlanStepperData['contentType'] = 'Course'
        this.selectedValue = 'Course'
        this.handleCategorySelection.emit('Course')
      }
    } else if (this.from === 'assignee') {
      if (this.tpdsSvc.trainingPlanStepperData['assignmentType']) {
        this.selectedValue = this.tpdsSvc.trainingPlanStepperData['assignmentType']
        this.handleCategorySelection.emit(this.tpdsSvc.trainingPlanStepperData['assignmentType'])
      } else {
        this.tpdsSvc.trainingPlanStepperData['assignmentType'] = 'Designation'
        this.selectedValue = 'Designation'
        this.handleCategorySelection.emit('Designation')
      }
    }
  }

  showDialogBox(event: any) {
    const dialogData: any = {}
    switch (event) {
      case 'Course':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'Are you sure you want to alter the content type?'
        dialogData['subTitle'] = `This action will result in the loss of your currently selected content.`
        dialogData['primaryAction'] = 'Confirm'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Course'
        this.tpdsSvc.trainingPlanStepperData['contentType'] = event
        this.tpdsSvc.moderatedCourseSelectStatus.next(false)
        if (this.tpdsSvc.trainingPlanStepperData.contentList.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event)
        }
        break
      case 'Standalone Assessment':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'Are you sure you want to alter the content type?'
        dialogData['subTitle'] = `This action will result in the loss of your currently selected content.`
        dialogData['primaryAction'] = 'Confirm'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Standalone Assessment'
        this.tpdsSvc.trainingPlanStepperData['contentType'] = event
        this.tpdsSvc.moderatedCourseSelectStatus.next(false)
        if (this.tpdsSvc.trainingPlanStepperData.contentList.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event)
        }
        break
      case 'Program':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'Are you sure you want to alter the content type?'
        dialogData['subTitle'] = `This action will result in the loss of your currently selected content.`
        dialogData['primaryAction'] = 'Confirm'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Program'
        this.tpdsSvc.trainingPlanStepperData['contentType'] = event
        this.tpdsSvc.moderatedCourseSelectStatus.next(false)
        if (this.tpdsSvc.trainingPlanStepperData.contentList.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event)
        }
        break
      case 'Blended program':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'Are you sure you want to alter the content type?'
        dialogData['subTitle'] = `This action will result in the loss of your currently selected content.`
        dialogData['primaryAction'] = 'Confirm'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Blended program'
        this.tpdsSvc.trainingPlanStepperData['contentType'] = event
        this.tpdsSvc.moderatedCourseSelectStatus.next(false)
        if (this.tpdsSvc.trainingPlanStepperData.contentList.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event)
        }
        break
      case 'Curated program':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'Are you sure you want to alter the content type?'
        dialogData['subTitle'] = `This action will result in the loss of your currently selected content.`
        dialogData['primaryAction'] = 'Confirm'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Curated program'
        this.tpdsSvc.trainingPlanStepperData['contentType'] = event
        this.tpdsSvc.moderatedCourseSelectStatus.next(false)
        if (this.tpdsSvc.trainingPlanStepperData.contentList.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event)
        }
        break
      case 'Moderated Course':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'Are you sure you want to alter the content type?'
        dialogData['subTitle'] = `This action will result in the loss of your currently selected content.`
        dialogData['primaryAction'] = 'Confirm'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Moderated Course'
        this.tpdsSvc.trainingPlanStepperData['contentType'] = event
        if (this.tpdsSvc.trainingPlanStepperData.contentList.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event)
        }
        break
      case 'Designation':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'Are you sure you want to alter the type?'
        dialogData['subTitle'] = `This action will result in the loss of your currently selected content.`
        dialogData['primaryAction'] = 'Confirm'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Designation'
        this.tpdsSvc.trainingPlanStepperData['assignmentType'] = event
        if (this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event)
        }
        break
      case 'AllUser':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'Are you sure you want to alter the type?'
        dialogData['subTitle'] = `This action will result in the loss of your currently selected content.`
        dialogData['primaryAction'] = 'Confirm'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'AllUser'
        this.tpdsSvc.trainingPlanStepperData['assignmentType'] = event
        if (this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event)
        }
        break
      case 'CustomUser':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'Are you sure you want to alter the type?'
        dialogData['subTitle'] = `This action will result in the loss of your currently selected content.`
        dialogData['primaryAction'] = 'Confirm'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'CustomUser'
        this.tpdsSvc.trainingPlanStepperData['assignmentType'] = event
        if (this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event)
        }
        break
    }

    // this.handleCategorySelection.emit(event);
    // this.openDialoagBox(dialogData)
  }

  openDialoagBox(dialogData: any) {
    this.dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      data: {
        type: dialogData.type,
        icon: dialogData.icon,
        title: dialogData.title,
        subTitle: dialogData.subTitle,
        primaryAction: dialogData.primaryAction,
        secondaryAction: dialogData.secondaryAction,
        event: dialogData.event,
      },
      autoFocus: false
    })

    this.dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.toLowerCase() === 'cancel') {
        if (this.from === 'content') {
          this.selectedValue = this.tpdsSvc.trainingPlanContentData.category
          this.tpdsSvc.trainingPlanStepperData['contentType'] = this.selectedValue
        } else if (this.from === 'assignee') {
          this.selectedValue = this.tpdsSvc.trainingPlanAssigneeData.category
          this.tpdsSvc.trainingPlanStepperData['assignmentType'] = this.selectedValue
        }
      }
    })
  }

  hideConfirmationBox() {
    this.dialogRef.close()
  }

}
