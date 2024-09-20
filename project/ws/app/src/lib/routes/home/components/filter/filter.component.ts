import {
  Component, ChangeDetectorRef, Input, ElementRef, EventEmitter, OnInit,
  Output, QueryList, ViewChildren, ChangeDetectionStrategy, AfterContentChecked,
} from '@angular/core'
import { FormControl } from '@angular/forms'
import { TrainingPlanService } from '../../../training-plan/services/traininig-plan.service'
import { UsersService } from '../../../users/services/users.service'
@Component({
  selector: 'ws-app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, AfterContentChecked {
  @Output() toggleFilter = new EventEmitter()
  // @Output() getFilterData = new EventEmitter()
  @Input() from: any
  @Input() filterFacetsData: any
  designationList: any = []
  providersList: any[] = []
  selectedProviders: any[] = []
  groupList: any = []
  rolesList: any = []
  tagsList: any = []
  competencyList: any = []
  competencyThemeList: any[] = []
  competencySubThemeList: any[] = []
  filterObj: any = { competencyArea: [], competencyTheme: [], competencySubTheme: [], providers: [] }
  assigneeFilterObj: any = {
    group: [],
    designation: [],
    roles: [],
    tags: [],
  }
  searchThemeControl = new FormControl()
  searchSubThemeControl = new FormControl()
  searchProviderControl = new FormControl()
  @ViewChildren('checkboxes') checkboxes!: QueryList<ElementRef>
  groupSearchKey = ''
  designationSearchKey = ''
  rolesSearchKey = ''
  tagsSearchKey = ''
  filteredGroupList: any = []
  filteredDesignationList: any = []
  filteredRolesList: any = []
  filteredTagsList: any = []
  constructor(
    private cdref: ChangeDetectorRef,
    private trainingPlanService: TrainingPlanService,
    private usersSvc: UsersService) {
  }

  ngOnInit() {
    if (!this.usersSvc.filterToggle) { return }
    this.usersSvc.filterToggle.subscribe((data: any) => {
      if (data && data.status) {
        this.filterFacetsData = data.data
        this.setData()
        //     // if (data.from === 'content') {
        //     //   this.getFilterEntity()
        //     // this.getProviders()
        //     // } else {
        //     // if(this.usersSvc.trainingPlanAssigneeData &&
        //     //   this.usersSvc.trainingPlanAssigneeData.category === 'Custom Users') {
        //     //   this.getDesignation();
        //     // }
        //     if (this.designationList && this.designationList.length > 0) {
        //       //   this.getDesignation()
        //       // } else {
        //       this.getFilteredDesignationList()
        //     }

        //     if (this.groupList && this.groupList.length > 0) {
        //       //   this.loadGroups()
        //       // } else {
        //       this.getFilteredGroupList()
        //     }

        //     if (this.rolesList && this.rolesList.length > 0) {
        //       //   this.loadRoles()
        //       // } else {
        //       this.getFilteredRolesList()
        //     }

        //     if (this.tagsList && this.tagsList.length > 0) {
        //       //   this.loadTags()
        //       // } else {
        //       this.getFilteredTagsList()
        //     }
        //     // }
      }
    })

    if (!this.usersSvc.clearFilter) { return }
    this.usersSvc.clearFilter.subscribe((result: any) => {
      if (result && result.status) {
        this.from = result.from
        this.clearFilter()
      }
    })
    this.resetFilter()
  }

  setData() {
    if (this.filterFacetsData) {
      this.filterFacetsData.forEach((item: any) => {
        if (item.name === 'profileDetails.professionalDetails.group') {
          if (item.values && item.values.length > 0) {
            this.groupList = item.values
            // this.filteredGroupList = this.groupList
            this.getFilteredGroupList()
          }
        }
        if (item.name === 'profileDetails.professionalDetails.designation') {
          if (item.values && item.values.length > 0) {
            this.designationList = item.values
            // this.filteredDesignationList = this.designationList
            this.getFilteredDesignationList()
          }
        }
        if (item.name === 'profileDetails.additionalDetails.tag') {
          if (item.values && item.values.length > 0) {
            this.tagsList = item.values
            // this.filteredTagsList = this.tagsList
            this.getFilteredTagsList()
          }
        }
      })
      // this.rolesList = this.filterFacetsData.rolesList && this.filterFacetsData.rolesList > 0 ? this.filterFacetsData.rolesList : []
    }
  }

  searchGroup(searchKey: string) {
    this.groupSearchKey = searchKey
    this.getFilteredGroupList()
  }

  searchDesignation(searchKey: string) {
    this.designationSearchKey = searchKey
    this.getFilteredDesignationList()
  }

  searchRoles(searchKey: string) {
    this.rolesSearchKey = searchKey
    this.getFilteredRolesList()
  }

  searchTags(searchKey: string) {
    this.tagsSearchKey = searchKey
    this.getFilteredTagsList()
  }

  getFilteredGroupList() {
    if (this.groupList.length) {
      const searchKey = this.groupSearchKey ? this.groupSearchKey.toUpperCase() : ''
      this.filteredGroupList = []
      this.groupList.forEach((groupName: any) => {
        if (groupName.name.toUpperCase().includes(searchKey)) {
          if (this.assigneeFilterObj['group'] && this.assigneeFilterObj['group'].indexOf(groupName.name) > -1) {
            groupName['selected'] = true
          } else {
            groupName['selected'] = false
          }
          this.filteredGroupList.push(groupName)
        }
      })
    }
  }

  getFilteredDesignationList() {
    if (this.designationList.length) {
      const searchKey = this.designationSearchKey ? this.designationSearchKey.toUpperCase() : ''
      this.filteredDesignationList = []
      this.designationList.forEach((designation: any) => {
        if (designation.name.toUpperCase().includes(searchKey)) {
          if (this.assigneeFilterObj['designation'] && this.assigneeFilterObj['designation'].indexOf(designation.name) > -1) {
            designation['selected'] = true
          } else {
            designation['selected'] = false
          }
          this.filteredDesignationList.push(designation)
        }
      })
    }
  }

  getFilteredRolesList() {
    if (this.rolesList.length) {
      const searchKey = this.rolesSearchKey ? this.rolesSearchKey.toUpperCase() : ''
      this.filteredRolesList = []
      this.rolesList.forEach((rolesName: any) => {
        if (rolesName.name.toUpperCase().includes(searchKey)) {
          if (this.assigneeFilterObj['roles'] && this.assigneeFilterObj['roles'].indexOf(rolesName.name) > -1) {
            rolesName['selected'] = true
          } else {
            rolesName['selected'] = false
          }
          this.filteredRolesList.push(rolesName)
        }
      })
    }
  }

  getFilteredTagsList() {
    if (this.tagsList.length) {
      const searchKey = this.tagsSearchKey ? this.tagsSearchKey.toUpperCase() : ''
      this.filteredTagsList = []
      this.tagsList.forEach((tagsName: any) => {
        if (tagsName.name.toUpperCase().includes(searchKey)) {
          if (this.assigneeFilterObj['tags'] && this.assigneeFilterObj['tags'].indexOf(tagsName.name) > -1) {
            tagsName['selected'] = true
          } else {
            tagsName['selected'] = false
          }
          this.filteredTagsList.push(tagsName)
        }
      })
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges()
  }

  hideFilter(filter: string) {
    const event = {
      filter,
      filtersList: this.assigneeFilterObj,
    }
    this.toggleFilter.emit(event)
    this.usersSvc.filterToggle.next({ from: '', status: false })
  }

  checkedProviders(event: any, item: any) {
    if (event.checked) {
      item['checked'] = true
      this.providersList.map((pitem: any) => {
        if (item.name === pitem.name) {
          pitem['selected'] = true
        }

      })
      if (this.filterObj['providers']) {
        this.filterObj['providers'].push(item.name)
      }
    } else {
      item['checked'] = false
      this.providersList.map((pitem: any) => {
        if (item.name === pitem.name) {
          pitem['selected'] = false
        }
      })
      if (this.filterObj['providers'].indexOf(item.name) > -1) {
        const index = this.filterObj['providers'].findIndex((x: any) => x === item.name)
        item['selected'] = false
        this.filterObj['providers'].splice(index, 1)
      }
    }
  }

  getCompetencyTheme(event: any, ctype: any) {
    if (event.checked) {
      ctype['selected'] = true
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
      ctype['selected'] = false
      this.competencyList.map((citem: any) => {
        if (citem.name === ctype.id) {
          citem['selected'] = false
        }
      })

      if (this.filterObj['competencyArea'] &&
        this.filterObj['competencyArea'].indexOf(ctype.id) > -1) {
        const index = this.filterObj['competencyArea'].findIndex((x: any) => x === ctype.id)
        this.filterObj['competencyArea'].splice(index, 1)
      }
      if (this.filterObj['competencyTheme']) {
        this.competencyThemeList.map(sitem => {
          if (sitem.parent === ctype.id) {
            if (this.filterObj['competencyTheme'].indexOf(sitem.name) > -1) {
              const index = this.filterObj['competencyTheme'].findIndex((x: any) => x === sitem.name)
              this.filterObj['competencyTheme'].splice(index, 1)
            }
          }
        })
      }
      if (this.filterObj['competencySubTheme']) {
        this.competencySubThemeList.map(ssitem => {
          if (ssitem.parentType === ctype.id) {
            if (this.filterObj['competencySubTheme'].indexOf(ssitem.name) > -1) {
              const index = this.filterObj['competencySubTheme'].findIndex((x: any) => x === ssitem.name)
              this.filterObj['competencySubTheme'].splice(index, 1)
            }
          }
        })
      }
      this.competencyThemeList = this.competencyThemeList.filter(sitem => {
        if (sitem.parent === ctype.id) {
          sitem['selected'] = false
        }
        return sitem.parent !== ctype.id
      })
      this.competencySubThemeList = this.competencySubThemeList.filter(pitem => {
        if (pitem.parentType === ctype.id) {
          pitem['selected'] = false
        }
        return pitem.parentType !== ctype.id
      })
      this.searchThemeControl.reset()
      this.searchSubThemeControl.reset()
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
          if (this.filterObj['competencyTheme']) {
            this.filterObj['competencyTheme'].push(cstype.name)
          }

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
      if (this.filterObj['competencyTheme'] &&
        this.filterObj['competencyTheme'].indexOf(cstype.name) > -1) {
        const index = this.filterObj['competencyTheme'].findIndex((x: any) => x === cstype.name)
        this.filterObj['competencyTheme'].splice(index, 1)
      }
      this.searchSubThemeControl.reset()
    }
  }

  manageCompetencySubTheme(event: any, csttype: any) {
    if (event.checked) {
      this.competencySubThemeList.map((cstlitem: any) => {
        if (csttype.name === cstlitem.name) {
          cstlitem['selected'] = true
        }
      })
      if (this.filterObj['competencySubTheme']) {
        this.filterObj['competencySubTheme'].push(csttype.name)
      }

    } else {
      this.competencySubThemeList.map((cstlitem: any) => {
        if (csttype.name === cstlitem.name) {
          cstlitem['selected'] = false
        }
      })
      if (this.filterObj['competencySubTheme'] &&
        this.filterObj['competencySubTheme'].indexOf(csttype.name) > -1) {
        const index = this.filterObj['competencySubTheme'].findIndex((x: any) => x === csttype.name)
        this.filterObj['competencySubTheme'].splice(index, 1)
      }
    }

  }

  applyFilter() {
    if (this.from === 'content') {
      // this.getFilterData.emit(this.filterObj)
      this.usersSvc.getFilterDataObject.next(this.filterObj)
    } else {
      this.usersSvc.getFilterDataObject.next(this.assigneeFilterObj)
      // this.getFilterData.emit(this.assigneeFilterObj)
    }
    this.hideFilter('applyFilter')
  }

  clearFilter() {
    if (this.from === 'content') {
      this.filterObj = { competencyArea: [], competencyTheme: [], competencySubTheme: [], providers: [] }
      this.selectedProviders = []
      this.competencyThemeList = []
      this.competencySubThemeList = []
      this.searchThemeControl.reset()
      this.searchSubThemeControl.reset()
      this.searchProviderControl.reset()
      this.resetFilter()
    } else {
      this.assigneeFilterObj = { group: [], designation: [], roles: [], tags: [] }
      // this.resetAssigneeFilter()
      if (this.groupList) {
        this.assigneeFilterObj['group'] = []
        this.groupSearchKey = ''
      }
      this.assigneeFilterObj['designation'] = []
      this.designationSearchKey = ''

      this.assigneeFilterObj['roles'] = []
      this.rolesSearchKey = ''

      this.assigneeFilterObj['tags'] = []
      this.tagsSearchKey = ''

    }

    if (this.from === 'content') {
      // this.getFilterData.emit(this.filterObj)
      // this.usersSvc.getFilterDataObject.next(this.filterObj)
    } else {
      // this.getFilterData.emit(this.assigneeFilterObj)
      // this.usersSvc.getFilterDataObject.next(this.assigneeFilterObj)
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

  // loadGroups() {
  //   this.groupList = []
  //   this.filteredGroupList = []
  //   this.usersSvc.getGroups().subscribe(
  //     (data: any) => {
  //       const res = data.result.response
  //       this.groupList = res
  //       this.getFilteredGroupList()
  //     },
  //     (_err: any) => {
  //     })
  // }

  // loadRoles() {
  //   this.rolesList = this.groupList
  //   this.getFilteredRolesList()
  // }

  // loadTags() {
  //   this.tagsList = this.groupList
  //   this.getFilteredTagsList()
  // }

  getDesignation() {
    this.trainingPlanService.getDesignations().subscribe((res: any) => {
      if (res && res.result && res.result.response) {
        this.designationList = res.result.response.content
        this.getFilteredDesignationList()
      }

    })
  }

  manageSelectedGroup(event: any, group: any) {
    if (event.checked) {
      this.filteredGroupList.map((grp: any, index: any) => {
        if (grp && grp.name === group.name) {
          this.filteredGroupList[index]['selected'] = true
        }
      })
      if (group) {
        group['selected'] = true
      }
      this.assigneeFilterObj['group'].push(group.name)
    } else {
      if (this.assigneeFilterObj['group'] &&
        this.assigneeFilterObj['group'].indexOf(group.name) > -1) {
        const index = this.assigneeFilterObj['group'].findIndex((x: any) => x === group.name)
        this.assigneeFilterObj['group'].splice(index, 1)
      }
      this.filteredGroupList.map((grp: any, index: any) => {
        if (grp && grp.name === group.name) {
          this.filteredGroupList[index]['selected'] = false
        }
      })
      if (group) {
        group['selected'] = false
      }
    }
  }

  manageSelectedDesignation(event: any, designation: any) {
    if (event.checked) {
      this.filteredDesignationList.map((ditem: any) => {
        if (ditem && ditem['name'] === designation.name) {
          ditem['selected'] = true
        }
      })

      this.assigneeFilterObj['designation'].push(designation.name)
    } else {
      this.filteredDesignationList.map((ditem: any) => {
        if (ditem && ditem['name'] === designation.name) {
          ditem['selected'] = false
        }
      })
      if (this.assigneeFilterObj['designation'] &&
        this.assigneeFilterObj['designation'].indexOf(designation.name) > -1) {
        const index = this.assigneeFilterObj['designation'].findIndex((x: any) => x === designation.name)
        this.assigneeFilterObj['designation'].splice(index, 1)
      }
    }
  }

  manageSelectedTags(event: any, tags: any) {
    if (event.checked) {
      this.filteredTagsList.map((grp: any, index: any) => {
        if (grp && grp.name === tags.name) {
          this.filteredTagsList[index]['selected'] = true
        }
      })
      this.assigneeFilterObj['tags'].push(tags.name)
    } else {
      if (this.assigneeFilterObj['tags'] &&
        this.assigneeFilterObj['tags'].indexOf(tags.name) > -1) {
        const index = this.assigneeFilterObj['tags'].findIndex((x: any) => x === tags.name)
        this.assigneeFilterObj['tags'].splice(index, 1)
      }
      this.filteredTagsList.map((grp: any, index: any) => {
        if (grp && grp.name === tags.name) {
          this.filteredTagsList[index]['selected'] = false
        }
      })
    }
  }

  manageSelectedRoles(event: any, role: any) {
    if (event.checked) {
      this.filteredRolesList.map((grp: any, index: any) => {
        if (grp && grp.name === role.name) {
          this.filteredRolesList[index]['selected'] = true
        }
      })
      this.assigneeFilterObj['roles'].push(role.name)
    } else {
      if (this.assigneeFilterObj['roles'] &&
        this.assigneeFilterObj['roles'].indexOf(role.name) > -1) {
        const index = this.assigneeFilterObj['roles'].findIndex((x: any) => x === role.name)
        this.assigneeFilterObj['roles'].splice(index, 1)
      }
      this.filteredRolesList.map((grp: any, index: any) => {
        if (grp && grp.name === role.name) {
          this.filteredRolesList[index]['selected'] = false
        }
      })
    }
  }

  resetFilter() {
    if (this.competencyThemeList) {
      this.competencyThemeList.map((titem: any) => {
        if (titem && titem['selected']) {
          titem['selected'] = false
        }
      })
    }
    if (this.competencySubThemeList) {
      this.competencySubThemeList.map((sitem: any) => {
        if (sitem && sitem['selected']) {
          sitem['selected'] = false
        }
      })
    }
    if (this.providersList) {
      this.providersList.map((pitem: any) => {
        if (pitem && pitem['selected']) {
          pitem['selected'] = false
        }
      })
    }

  }

  resetAssigneeFilter() {
    if (this.groupList) {
      this.assigneeFilterObj['group'] = []
      this.groupSearchKey = ''
      // this.getFilteredGroupList()
      // this.groupList.map((pitem: any) => {
      //   if (pitem && pitem['selected']) {
      //     pitem['selected'] = false
      //   }
      // })
    }

    // if (this.designationList) {
    //   this.designationList.map((pitem: any) => {
    //     if (pitem && pitem['selected']) {
    //       pitem['selected'] = false
    //     }
    //   })
    // }

    this.assigneeFilterObj['designation'] = []
    this.designationSearchKey = ''

    this.assigneeFilterObj['roles'] = []
    this.rolesSearchKey = ''

    this.assigneeFilterObj['tags'] = []
    this.tagsSearchKey = ''

    this.hideFilter('clearFilter')
  }
}
