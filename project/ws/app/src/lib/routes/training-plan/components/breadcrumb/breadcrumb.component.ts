import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material'
import { Router } from '@angular/router'
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation.box.component'
import { TrainingPlanContent } from '../../models/training-plan.model'
@Component({
  selector: 'ws-app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {

  @Input() showBreadcrumbAction = true
  @Input() selectedTab: string = ''
  @Output() changeToNextTab = new EventEmitter<any>()

  public dialogRef: any
  tabType = TrainingPlanContent.TTabLabelKey

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
  }

  cancel() {
    this.router.navigateByUrl('app/home/training-plan-dashboard')
  }

  nextStep() {
    // this.showDialogBox('progress-completed')
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
    }

  }

  performRoute(route: any) {
    if (route === 'list') {
      this.router.navigateByUrl('app/home/training-plan-dashboard')
    } else {
      this.router.navigateByUrl('app/training-plan/' + route)
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
      autoFocus: false
    })

    this.dialogRef.afterClosed().subscribe(() => {
      // console.log('The dialog was closed');
    })
  }

  hideConfirmationBox() {
    this.dialogRef.close()
  }
}
