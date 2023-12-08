import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { Router } from '@angular/router'
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation.box.component'
@Component({
  selector: 'ws-app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() showBreadcrumbAction = true
  public dialogRef: any
  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
  }

  cancel() {
    this.router.navigateByUrl('app/home/training-plan-dashboard')
  }

  nextStep() {
    this.showDialogBox('progress-completed')
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
      disableClose: true,
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
    this.dialogRef.close()
  }
}
