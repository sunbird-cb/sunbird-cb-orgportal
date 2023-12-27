import { Component, ChangeDetectorRef, Input, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChildren, ChangeDetectionStrategy, AfterContentChecked } from '@angular/core'
import { TrainingPlanService } from './../../services/traininig-plan.service'
import { FormControl } from '@angular/forms'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
@Component({
  selector: 'ws-app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, AfterContentChecked {
  @Output() toggleFilter = new EventEmitter()
  @Output() getFilterData = new EventEmitter()
  @Input() clearFilterFlag: any
  @Input() from: any
  @Input() designationList: any
  providersList: any[] = []
  selectedProviders: any[] = []
  competencyTypeList = [{ id: 'Behavioral', name: 'Behavioural' }, { id: 'Functional', name: 'Functional' }, { id: 'Domain', name: 'Domain' }]
  groupList = [{ id: 'groupA', name: 'Group A' }, { id: 'groupB', name: 'Group B' }, { id: 'groupC', name: 'Group C' }, { id: 'groupD', name: 'Group D' }, { id: 'groupE', name: 'Group E' }]
  competencyList: any = []
  competencyThemeList: any[] = []
  competencySubThemeList: any[] = []
  filterObj: any = { competencyArea: [], competencyTheme: [], competencySubTheme: [], providers: [] }
  assigneeFilterObj: any = { group: [], designation: [] }
  searchThemeControl = new FormControl()
  searchSubThemeControl = new FormControl()
  @ViewChildren('checkboxes') checkboxes!: QueryList<ElementRef>
  constructor(private cdref: ChangeDetectorRef, private trainingPlanService: TrainingPlanService, private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
    if (this.from === 'content') {
      this.getFilterEntity()
      this.getProviders()
    } else {
      // if(this.trainingPlanDataSharingService.trainingPlanAssigneeData &&
      //   this.trainingPlanDataSharingService.trainingPlanAssigneeData.category === 'Custom Users') {
      //   this.getDesignation();
      // }

    }

    this.trainingPlanDataSharingService.clearFilter.subscribe((result: any) => {
      if (result) {
        this.clearFilterWhileSearch()
      }
    })
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges()
 }

  getFilterEntity() {
    const filterObj = {
      search: {
        type: 'Competency Area',
      },
      filter: {
        isDetail: true,
      },
    }
    this.trainingPlanService.getFilterEntity(filterObj).subscribe((res: any) => {

      this.competencyList = res

    })
  }
  getProviders() {
    this.trainingPlanService.getProviders().subscribe((res: any) => {
      this.providersList = res
    })
  }

  hideFilter() {
    this.toggleFilter.emit(false)
  }

  checkedProviders(event: any, item: any) {
    if (event) {
      this.selectedProviders.push(item)
      this.filterObj['providers'].push(item.name)
    } else {
      if (this.filterObj['provider'].indexOf(item.name) > -1) {
        const index = this.filterObj['providers'].findIndex((x: any) => x === item.name)
        this.filterObj['providers'].splice(index, 1)
      }
    }
  }

  getCompetencyTheme(event: any, ctype: any) {
    if (event.checked) {
      this.competencyList.map((citem: any) => {
        if (citem.name === ctype.id) {
          citem['selected'] = true
          citem.children.map((themechild: any) => {
            themechild['parent'] = ctype.id
          })
          if (this.filterObj['competencyArea']) {
            this.filterObj['competencyArea'].push(citem.name)
          }
          this.competencyThemeList = this.competencyThemeList.concat(citem.children)
        }
      })
    } else {
      this.competencyList.map((citem: any) => {
        if (citem.name === ctype.id) {
          citem['selected'] = false
        }
      })
      this.competencyThemeList = this.competencyThemeList.filter(sitem => {
        return sitem.parent !== ctype.id
      })
      if (this.filterObj['competencyArea'].indexOf(ctype.id) > -1) {
        const index = this.filterObj['competencyArea'].findIndex((x: any) => x === ctype.id)
        this.filterObj['competencyArea'].splice(index, 1)
      }
    }
  }

  getCompetencySubTheme(event: any, cstype: any) {
    if (event.checked) {
      this.competencyThemeList.map((csitem: any) => {
        if (csitem.name === cstype.name) {
          csitem['selected'] = true
          csitem.children.map((subthemechild: any) => {
            subthemechild['parentType'] = csitem.parent
            subthemechild['parent'] = csitem.name
          })
          this.competencySubThemeList = this.competencySubThemeList.concat(csitem.children)
          this.filterObj['competencyTheme'].push(cstype.name)
        }
      })
    } else {
      this.competencyThemeList.map((csitem: any) => {
        if (csitem.name === cstype.name) {
          csitem['selected'] = false
        }
      })
      this.competencySubThemeList = this.competencySubThemeList.filter(sitem => {
        return sitem.parent !== cstype.name
      })
      if (this.filterObj['competencyTheme'].indexOf(cstype.name) > -1) {
        const index = this.filterObj['competencyTheme'].findIndex((x: any) => x === cstype.name)
        this.filterObj['competencyTheme'].splice(index, 1)
      }
    }
  }

  manageCompetencySubTheme(event: any, csttype: any) {
    if (event.checked) {
      this.competencySubThemeList.map((cstlitem: any) => {
        if (csttype.name === cstlitem.name) {
          cstlitem['selected'] = true
        }
      })
      this.filterObj['competencySubTheme'].push(csttype.name)
    } else {
      this.competencySubThemeList.map((cstlitem: any) => {
        if (csttype.name === cstlitem.name) {
          cstlitem['selected'] = false
        }
      })
      if (this.filterObj['competencySubTheme'].indexOf(csttype.name) > -1) {
        const index = this.filterObj['competencySubTheme'].findIndex((x: any) => x === csttype.name)
        this.filterObj['competencySubTheme'].splice(index, 1)
      }
    }

  }

  applyFilter() {
    if (this.from === 'content') {
      this.getFilterData.emit(this.filterObj)
    } else {
      this.getFilterData.emit(this.assigneeFilterObj)
    }
    this.toggleFilter.emit(false)
  }

  clearFilter() {
    if (this.from === 'content') {
      this.filterObj = {}
    } else {
      this.assigneeFilterObj = {}
    }

    if (this.from === 'content') {
      this.getFilterData.emit(this.filterObj)
    } else {
      this.getFilterData.emit(this.assigneeFilterObj)
    }
    if (this.checkboxes) {
      this.checkboxes.forEach((element: any) => {
        element['checked'] = false
      })
    }

  }

  clearFilterWhileSearch() {
    if (this.checkboxes) {
      this.checkboxes.forEach((element: any) => {
        element['checked'] = false
      })
    }
  }

  // getDesignation() {
  //   this.trainingPlanService.getDesignations().subscribe((res: any) => {
  //     console.log('res', res)
  //     if(res && res.result && res.result.response) {
  //       this.designationList = res.result.response.content;
  //     }

  //   })
  // }

  manageSelectedGroup(event: any, group: any) {
    if (event) {
      this.assigneeFilterObj['group'].push(group.name)
    } else {
      if (this.assigneeFilterObj['group'].indexOf(group.name) > -1) {
        const index = this.assigneeFilterObj['group'].findIndex((x: any) => x === group.name)
        this.assigneeFilterObj['group'].splice(index, 1)
      }
    }
  }

  manageSelectedDesignation(event: any, designation: any) {
    if (event) {
      this.assigneeFilterObj['designation'].push(designation.name)
    } else {
      if (this.assigneeFilterObj['designation'].indexOf(designation.name) > -1) {
        const index = this.assigneeFilterObj['designation'].findIndex((x: any) => x === designation.name)
        this.assigneeFilterObj['designation'].splice(index, 1)
      }
    }
  }
}
