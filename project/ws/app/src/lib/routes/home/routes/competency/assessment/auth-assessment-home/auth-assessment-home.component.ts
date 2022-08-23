import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core'
import { MatTabGroup } from '@angular/material'

@Component({
  selector: 'ws-auth-assessment-home',
  templateUrl: './auth-assessment-home.component.html',
  styleUrls: ['./auth-assessment-home.component.scss'],
})
export class AuthAssessmentHomeComponent implements OnChanges {

  @Output() closeModel = new EventEmitter<any>()
  @Output() assessmentData = new EventEmitter<any>()
  @Input() typeOfData!: string
  @Input() selectedDataIdentifier!: string
  @Input() assessmentPrimaryCategory!: string

  @ViewChild('tabgroup', { static: false }) tabgroup!: MatTabGroup

  typeOfSelectedData!: any
  isEditEnabled = false
  allPrimaryCategory = 'Course Assessment'

  constructor(
    // private snackBar: MatSnackBar,
  ) { }

  async ngOnChanges() {
    this.typeOfSelectedData = {
      type: this.typeOfData,
      identifier: this.selectedDataIdentifier,
      primaryCategory: this.assessmentPrimaryCategory,
    }
  }

  changeIndex(tabgroup: MatTabGroup, numberData: number) {
    tabgroup.selectedIndex = numberData
  }

  takeAction(item: any) {
    if (item.isParentCreated) {
      switch (item.action) {
        case 'next':
          this.changeIndex(this.tabgroup, 1)
          break
      }
    } else {
      this.showMessage('createParent')
    }
  }

  showMessage(item: string) {
    // switch (item) {
    //   case 'createParent':
    //     this.snackBar.openFromComponent(NotificationComponent, {
    //       data: {
    //         type: Notify.CREATE_CONTENT,
    //       },
    //       duration: NOTIFICATION_TIME * 1000,
    //     })
    //     break
    //   case 'fail':
    //     this.snackBar.openFromComponent(NotificationComponent, {
    //       data: {
    //         type: Notify.SAVE_FAIL,
    //       },
    //       duration: NOTIFICATION_TIME * 1000,
    //     })
    //     break
    // }

  }

  takeActionOnData(item: any) {
    this.assessmentData.emit(item)
  }

  selectedTab() {
    this.typeOfSelectedData = {
      type: this.typeOfData,
      identifier: this.selectedDataIdentifier,
      primaryCategory: this.assessmentPrimaryCategory,
    }
  }

}
