import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
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
  editState = false;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    public tpdsSvc: TrainingPlanDataSharingService,
    private tpSvc: TrainingPlanService) { }

  ngOnInit() {
    this.editState = this.activeRoute.snapshot.data['contentData'] ? true : false
    this.checkIfDisabled()
  }

  cancel() {
    this.tpdsSvc.trainingPlanTitle = ''
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
      if (this.editState) {
        this.router.navigate(['app', 'home', 'training-plan-dashboard'], {
          queryParams: {
            type: this.tpdsSvc.trainingPlanStepperData.status.toLowerCase(),
            tabSelected: this.tpdsSvc.trainingPlanStepperData.assignmentType
          }
        })
      } else {
        this.router.navigate(['app', 'home', 'training-plan-dashboard'])
      }
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
    this.tpdsSvc.trainingPlanStepperData.name = this.tpdsSvc.trainingPlanTitle
    if (this.tpdsSvc.trainingPlanStepperData.assignmentType === 'AllUser') {
      this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo = [
        "AllUser"
      ]
    }
    const obj = { request: this.tpdsSvc.trainingPlanStepperData }
    this.showDialogBox('progress')
    this.tpSvc.createPlan(obj).subscribe((_data: any) => {
      this.dialogRef.close()
      this.showDialogBox('progress-completed')
      setTimeout(() => {
        this.dialogRef.close()
        this.tpdsSvc.trainingPlanTitle = ''
        this.router.navigate(['app', 'home', 'training-plan-dashboard'], {
          queryParams: {
            type: 'draft',
            tabSelected: this.tpdsSvc.trainingPlanStepperData.assignmentType
          }
        })
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

  updatePlan() {
    this.tpdsSvc.trainingPlanStepperData.name = this.tpdsSvc.trainingPlanTitle
    if (this.tpdsSvc.trainingPlanStepperData.assignmentType === 'AllUser') {
      this.tpdsSvc.trainingPlanStepperData.assignmentTypeInfo = [
        "AllUser"
      ]
    }
    const obj: any = { request: { ...this.tpdsSvc.trainingPlanStepperData, id: this.activeRoute.snapshot.data['contentData'].id } }
    if (obj.request.status.toLowerCase() === 'live') {
      delete obj.request.contentList
      delete obj.request.contentType
      delete obj.request.assignmentType
    }
    delete obj.request.status
    this.showDialogBox('progress')
    this.tpSvc.updatePlan(obj).subscribe((_data: any) => {
      this.dialogRef.close()
      this.showDialogBox('progress-completed')
      setTimeout(() => {
        this.dialogRef.close()
        this.tpdsSvc.trainingPlanTitle = ''
        this.router.navigate(['app', 'home', 'training-plan-dashboard'], {
          queryParams: {
            type: this.tpdsSvc.trainingPlanStepperData.status.toLowerCase(),
            tabSelected: this.tpdsSvc.trainingPlanStepperData.assignmentType
          }
        })
      }, 1000)
    })
  }
}
