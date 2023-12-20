import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core'
import { MatDialog } from '@angular/material'
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation.box.component'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'

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
  constructor(public dialog: MatDialog, private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
    // if(this.from === 'content') {
    //   this.handleCategorySelection.emit('Course');
    // } else if(this.from === 'assignee') {
    //   this.handleCategorySelection.emit('Designation');
    // }
    this.trainingPlanDataSharingService.trainingPlanCategoryChangeEvent.subscribe((data: any) => {
      if (data && data.event) {
        this.trainingPlanDataSharingService.trainingPlanStepperData.contentList = [];
        this.handleCategorySelection.emit(data.event)
      }
    })
  }

  ngOnChanges() {
    if (this.from === 'content') {
      this.trainingPlanDataSharingService.trainingPlanStepperData['contentType'] = 'Course'
      this.handleCategorySelection.emit('Course')
    } else if (this.from === 'assignee') {
      this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentType'] = 'Designation'
      this.handleCategorySelection.emit('Designation')
    }
  }

  showDialogBox(event: any) {
    const dialogData: any = {}
    switch (event) {
      case 'Course':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected content type?'
        dialogData['subTitle'] = `Changing it now will result in the loss of your current selection.
        It's advisable to save the current one as a draft and create a new one instead.`
        dialogData['primaryAction'] = 'I understand, change content type'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Course'
        this.trainingPlanDataSharingService.trainingPlanStepperData['contentType'] = event;
        this.trainingPlanDataSharingService.moderatedCourseSelectStatus.next(false);
        if(this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event);
        }
        break
      case 'Program':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected content type?'
        dialogData['subTitle'] = `Changing it now will result in the loss of your current selection.
        It's advisable to save the current one as a draft and create a new one instead.`
        dialogData['primaryAction'] = 'I understand, change content type'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Program'
        this.trainingPlanDataSharingService.trainingPlanStepperData['contentType'] = event;
        this.trainingPlanDataSharingService.moderatedCourseSelectStatus.next(false);
        if(this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event);
        }
        break
      case 'Blended program':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected content type?'
        dialogData['subTitle'] = `Changing it now will result in the loss of your current selection.
        It's advisable to save the current one as a draft and create a new one instead.`
        dialogData['primaryAction'] = 'I understand, change content type'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Blended program'
        this.trainingPlanDataSharingService.trainingPlanStepperData['contentType'] = event
        this.trainingPlanDataSharingService.moderatedCourseSelectStatus.next(false);
        if(this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event);
        }
        break
      case 'Curated program':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected content type?'
        dialogData['subTitle'] = `Changing it now will result in the loss of your current selection.
         It's advisable to save the current one as a draft and create a new one instead.`
        dialogData['primaryAction'] = 'I understand, change content type'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Curated program'
        this.trainingPlanDataSharingService.trainingPlanStepperData['contentType'] = event
        this.trainingPlanDataSharingService.moderatedCourseSelectStatus.next(false);
        if(this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event);
        }
        break
      case 'Moderated Course':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected content type?'
        dialogData['subTitle'] = `Changing it now will result in the loss of your current selection.
        It's advisable to save the current one as a draft and create a new one instead.`
        dialogData['primaryAction'] = 'I understand, change content type'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Moderated Course'
        this.trainingPlanDataSharingService.trainingPlanStepperData['contentType'] = event;
        if(this.trainingPlanDataSharingService.trainingPlanStepperData.contentList.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event);
        }        
        break
      case 'Designation':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected user type?'
        dialogData['subTitle'] = `By selecting all users, you've selected all the users from your Department of fisheries.;
        If you want to select custom users or by designation, use the above option`
        dialogData['primaryAction'] = 'I understand, change user type'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Designation'
        this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentType'] = event
        if(this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event);
        }
        break
      case 'All Users':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected user type?'
        dialogData['subTitle'] = `By selecting all users, you've selected all the users from your Department of fisheries.;
        If you want to select custom users or by designation, use the above option`
        dialogData['primaryAction'] = 'I understand, change user type'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'All Users'
        this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentType'] = event
        if(this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event);
        }
        break
      case 'Custom Users':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected user type?'
        dialogData['subTitle'] = `By selecting all users, you've selected all the users from your Department of fisheries.;
        If you want to select custom users or by designation, use the above option`
        dialogData['primaryAction'] = 'I understand, change user type'
        dialogData['secondaryAction'] = 'Cancel'
        dialogData['event'] = 'Custom Users'
        this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentType'] = event
        if(this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo.length) {
          this.openDialoagBox(dialogData)
        } else {
          this.handleCategorySelection.emit(event);
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
    })

    this.dialogRef.afterClosed().subscribe(() => {
    })
  }

  hideConfirmationBox() {
    this.dialogRef.close()
  }

}
