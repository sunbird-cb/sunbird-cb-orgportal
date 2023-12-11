import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material'
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation.box.component';
import { TrainingPlanService } from './../../services/traininig-plan.service';
/* tslint:disable */
import _ from 'lodash'
@Component({
  selector: 'ws-app-category-drop-down',
  templateUrl: './category-drop-down.component.html',
  styleUrls: ['./category-drop-down.component.scss'],
})
export class CategoryDropDownComponent implements OnInit {
  @Input() categoryData: any[] = []
  @Output() closeDropDown: any = new EventEmitter()
  dialogRef: any
  constructor(public dialog: MatDialog, private trainingPlanService: TrainingPlanService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getAllUsers();
    this.getDesignations();
  }

  getAllUsers() {
    const rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    const filterObj = {
      request: {
        query: '',
        filters: {
          rootOrgId,
          status: 1,
        },
        limit: 100,
        offset: 0,
      },
    }
    this.trainingPlanService.getAllUsers(filterObj).subscribe((res:any) => {
        console.log('res-->', res);
    })
  }

  getDesignations() {
    this.trainingPlanService.getDesignations().subscribe((res:any)=>{
      console.log('res-->', res);
    })
  }

  showDialogBox(event: any) {
    const dialogData: any = {}
    switch (event) {
      case 'Course':
        // `Changing it now will result in the loss of your current selection. It's advisable to save the current one as a draft and create a new one instead.`
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected content type?'
        dialogData['subTitle'] = 'Test'
        dialogData['primaryAction'] = 'I understand, change content type'
        dialogData['secondaryAction'] = 'Cancel'
      break
      case 'Program':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected content type?'
        dialogData['subTitle'] = `Changing it now will result in the loss of your current selection. It's advisable to save the current one as a draft and create a new one instead.`
        dialogData['primaryAction'] = 'I understand, change content type'
        dialogData['secondaryAction'] = 'Cancel'
      break
      case 'Blended program':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected content type?'
        dialogData['subTitle'] = `Changing it now will result in the loss of your current selection. It's advisable to save the current one as a draft and create a new one instead.`
        dialogData['primaryAction'] = 'I understand, change content type'
        dialogData['secondaryAction'] = 'Cancel'
      break
      case 'Curated program':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected content type?'
        dialogData['subTitle'] = `Changing it now will result in the loss of your current selection. It's advisable to save the current one as a draft and create a new one instead.`
        dialogData['primaryAction'] = 'I understand, change content type'
        dialogData['secondaryAction'] = 'Cancel'
      break
      case 'Moderated Course':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected content type?'
        dialogData['subTitle'] = `Changing it now will result in the loss of your current selection. It's advisable to save the current one as a draft and create a new one instead.`
        dialogData['primaryAction'] = 'I understand, change content type'
        dialogData['secondaryAction'] = 'Cancel'
      break
      case 'Designation':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected user type?'
        dialogData['subTitle'] = `By selecting all users, you've selected all the users from your Department of fisheries.
        If you want to select custom users or by designation, use the above option`
        dialogData['primaryAction'] = 'I understand, change user type'
        dialogData['secondaryAction'] = 'Cancel'
      break
      case 'All Users':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected user type?'
        dialogData['subTitle'] = `By selecting all users, you've selected all the users from your Department of fisheries.
        If you want to select custom users or by designation, use the above option`
        dialogData['primaryAction'] = 'I understand, change user type'
        dialogData['secondaryAction'] = 'Cancel'
      break
      case 'Custom Users':
        dialogData['type'] = 'normal'
        dialogData['icon'] = 'radio_on'
        dialogData['title'] = 'You are attempting to change the selected user type?'
        dialogData['subTitle'] = `By selecting all users, you've selected all the users from your Department of fisheries.
        If you want to select custom users or by designation, use the above option`
        dialogData['primaryAction'] = 'I understand, change user type'
        dialogData['secondaryAction'] = 'Cancel'
      break
    }

    this.openDialoagBox(dialogData)
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
      },
    })

    this.dialogRef.afterClosed().subscribe(() => {
      // console.log('The dialog was closed');
    })
  }

  hideConfirmationBox() {
    // console.log('close', event)
    this.dialogRef.close()
  }

}
