import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material'
import { Router } from '@angular/router'
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation.box.component'
import { TrainingPlanContent } from '../../models/training-plan.model'
import { TrainingPlanService } from '../../services/traininig-plan.service'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
@Component({
  selector: 'ws-app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {

  @Input() showBreadcrumbAction = true
  @Input() selectedTab = ''
  @Input() validationList: any
  @Output() changeToNextTab = new EventEmitter<any>()

  public dialogRef: any
  tabType = TrainingPlanContent.TTabLabelKey

  constructor(private router: Router, public dialog: MatDialog,
    public trainingPlanDataSharingService: TrainingPlanDataSharingService,
    private trainingPlanService: TrainingPlanService) { }

  ngOnInit() {
    this.checkIfDisabled()
  }

  cancel() {
    this.trainingPlanDataSharingService.trainingPlanTitle = ''
    this.router.navigateByUrl('app/home/training-plan-dashboard')
  }

  nextStep() {
    switch (this.selectedTab) {
      case TrainingPlanContent.TTabLabelKey.CREATE_PLAN:
        this.changeToNextTab.emit(TrainingPlanContent.TTabLabelKey.ADD_CONTENT)
        break
      case TrainingPlanContent.TTabLabelKey.ADD_CONTENT:
        this.changeToNextTab.emit(TrainingPlanContent.TTabLabelKey.ADD_ASSIGNEE)
        break
      case TrainingPlanContent.TTabLabelKey.ADD_ASSIGNEE:
        this.changeToNextTab.emit(TrainingPlanContent.TTabLabelKey.ADD_TIMELINE)
        break
      case TrainingPlanContent.TTabLabelKey.ADD_TIMELINE:
        this.createPlanDraftView()
        break
    }

  }

  changeTabFromBreadCrumb(_item: string) {
    switch (_item) {
      case TrainingPlanContent.TTabLabelKey.CREATE_PLAN:
        this.changeToNextTab.emit(TrainingPlanContent.TTabLabelKey.CREATE_PLAN)
        break
    }
  }

  performRoute(route: any) {
    if (route === 'list') {
      this.trainingPlanDataSharingService.trainingPlanTitle = ''
      this.router.navigateByUrl('app/home/training-plan-dashboard')
    } else {
      this.router.navigateByUrl(`app/training-plan/${route}`)
    }

  }

  showDialogBox(event: any) {
    const dialogData: any = {}
    switch (event) {
      case 'progress':
        dialogData['type'] = 'progress'
        dialogData['icon'] = 'vega'
        dialogData['title'] = 'Processing your request'
        dialogData['subTitle'] = `Wait a second , your request is processing………`
        break
      case 'progress-completed':
        dialogData['type'] = 'progress-completed'
        dialogData['icon'] = 'accept_icon'
        dialogData['title'] = 'Your processing has been done.'
        dialogData['subTitle'] = `Updated to Draft`
        dialogData['primaryAction'] = 'Redirecting....'
        break
    }

    this.openDialoagBox(dialogData)
  }

  openDialoagBox(dialogData: any) {
    this.dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      disableClose: true,
      data: {
        type: dialogData.type,
        icon: dialogData.icon,
        title: dialogData.title,
        subTitle: dialogData.subTitle,
        primaryAction: dialogData.primaryAction,
        secondaryAction: dialogData.secondaryAction,
      },
      autoFocus: false,
    })

    this.dialogRef.afterClosed().subscribe(() => {
    })
  }

  hideConfirmationBox() {
    this.dialogRef.close()
  }

  createPlanDraftView() {
    this.trainingPlanDataSharingService.trainingPlanStepperData.name = this.trainingPlanDataSharingService.trainingPlanTitle
    if(this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentType === 'All Users') {
      this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentType = "allUsers";
      this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentTypeInfo = [
        "allUsers"
      ];
    }
    if(this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentType === 'Custom Users') {
      this.trainingPlanDataSharingService.trainingPlanStepperData.assignmentType = "custom";
    }
    const obj = { request: this.trainingPlanDataSharingService.trainingPlanStepperData }
    this.showDialogBox('progress')
    this.trainingPlanService.createPlan(obj).subscribe((_data: any) => {
      this.dialogRef.close()
      this.showDialogBox('progress-completed')
      setTimeout(() => {
        this.dialogRef.close()
        this.trainingPlanDataSharingService.trainingPlanTitle = ''
        this.router.navigateByUrl('app/home/training-plan-dashboard')
      }, 1000)
    })
  }

  checkIfDisabled() {
    if (this.tabType.CREATE_PLAN === this.selectedTab && this.validationList && !this.validationList.titleIsInvalid) {
      return this.validationList.titleIsInvalid
    }
    if (this.tabType.ADD_CONTENT === this.selectedTab && this.validationList && !this.validationList.addContentIsInvalid) {
      return this.validationList.addContentIsInvalid
    }
    if (this.tabType.ADD_ASSIGNEE === this.selectedTab && this.validationList && !this.validationList.addAssigneeIsInvalid) {
      return this.validationList.addAssigneeIsInvalid
    }
    return true
  }
}
