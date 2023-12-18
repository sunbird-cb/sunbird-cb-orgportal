import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef, ViewChild, OnChanges } from '@angular/core'
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
@Component({
  selector: 'ws-app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit, OnChanges {
  @Input() checkboxVisibility = true
  @Input() showDeleteFlag = false
  @Input() assigneeData: any
  @Input() showPagination = false;
  @Output() handleSelectedChips = new EventEmitter()
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | any
  dataSource: any
  startIndex = 0;
  lastIndex = 10;
  pageSize = 10;
  constructor(private trainingPlanDataSharingService: TrainingPlanDataSharingService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges()
    console.log('this.assigneeData', this.assigneeData)
    this.dataSource = new MatTableDataSource<any>(this.assigneeData.data)
    this.dataSource.paginator = this.paginator
    console.log('this.dataSource', this.dataSource)
  }

  onChangePage(pe: PageEvent) {
    console.log(pe.pageIndex)
    console.log(pe.pageSize)
    this.startIndex = pe.pageIndex * pe.pageSize
    this.lastIndex = (pe.pageIndex + 1) * pe.pageSize

    // this.startIndex = this.pageIndex
  }

  selectAssigneeItem(event: any, item: any) {
    if (event.checked) {
      // this.selectedContent.push(item);
      if (this.assigneeData && this.assigneeData.category === 'Designation') {
        this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any, index: any) => {
          if (sitem.name === item.name) {
            sitem['selected'] = true
            this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.splice(index, 1)
            this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.unshift(sitem)
          }
        })
        if (this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentTypeInfo']) {
          this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentTypeInfo'].push(item.name)
        }
      }
      if (this.assigneeData && this.assigneeData.category === 'Custom Users') {
        this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any, index: any) => {
          if (sitem.userId === item.userId) {
            sitem['selected'] = true
            this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.splice(index, 1)
            this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.unshift(sitem)
          }
        })
        if (this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentTypeInfo']) {
          this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentTypeInfo'].push(item.userId)
        }
      }

    } else {
      // this.selectedContent = this.selectedContent.filter( sitem  => sitem.identifier !== item.identifier)
      if (this.assigneeData && this.assigneeData.category === 'Designation') {
        this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any) => {
          if (sitem.name === item.name) {
            sitem['selected'] = false
          }
        })
        this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentTypeInfo'].filter((identifier: any, index: any) => {
          if (identifier === item.name) {
            this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentTypeInfo'].splice(index, 1)
          }
        })
      }
      if (this.assigneeData && this.assigneeData.category === 'Custom Users') {
        this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any) => {
          if (sitem.userId === item.userId) {
            sitem['selected'] = false
          }
        })
        this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentTypeInfo'].filter((identifier: any, index: any) => {
          if (identifier === item.userId) {
            this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentTypeInfo'].splice(index, 1)
          }
        })
      }

    }
    this.handleSelectedChips.emit(true)
  }

  deleteItem(item: any) {
    if (this.assigneeData && this.assigneeData.category === 'Designation') {
      this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any) => {
        if (sitem.name === item.name) {
          sitem['selected'] = false
        }
      })
      this.assigneeData.data.map((sitem: any, index: any) => {
        if (sitem.name === item.name) {
          this.assigneeData.data.splice(index, 1)
        }
      })
      this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentTypeInfo'].filter((identifier: any, index: any) => {
        if (identifier === item.name) {
          this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentTypeInfo'].splice(index, 1)
        }
      })
    } else if (this.assigneeData && this.assigneeData.category === 'Custom Users') {
      this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.map((sitem: any) => {
        if (sitem.userId === item.userId) {
          sitem['selected'] = false
        }
      })
      this.assigneeData.data.map((sitem: any, index: any) => {
        if (sitem.userId === item.userId) {
          this.assigneeData.data.splice(index, 1)
        }
      })
      this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentTypeInfo'].filter((identifier: any, index: any) => {
        if (identifier === item.userId) {
          this.trainingPlanDataSharingService.trainingPlanStepperData['assignmentTypeInfo'].splice(index, 1)
        }
      })
    }
  }

  createInititals(name: string): string {
    let initials = ''
    const array = `${name} `.toString().split(' ')
    if (array[0] !== 'undefined' && typeof array[1] !== 'undefined') {
      initials += array[0].charAt(0)
      initials += array[1].charAt(0)
    } else {
      for (let i = 0; i < name.length; i += 1) {
        if (name.charAt(i) === ' ') {
          continue
        }

        if (name.charAt(i) === name.charAt(i)) {
          initials += name.charAt(i)

          if (initials.length === 2) {
            break
          }
        }
      }
    }
    return initials.toUpperCase()
  }

}
