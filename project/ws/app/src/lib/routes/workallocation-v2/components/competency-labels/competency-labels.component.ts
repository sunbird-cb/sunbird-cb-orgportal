import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
// import { debounceTime } from 'rxjs/operators'
import { inspect } from 'util'
import { AllocationService } from '../../../workallocation/services/allocation.service'
import { debounceTime, first, map, switchMap, takeUntil } from 'rxjs/operators'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { WatStoreService } from '../../services/wat.store.service'
import { MatDialog, MatSnackBar } from '@angular/material'
import { NSWatCompetency } from '../../models/competency-wat.model'
import { NSWatActivity } from '../../models/activity-wot.model'
// tslint:disable
import _ from 'lodash'
import { WatCompPopupComponent } from './wat-comp-popup/wat-comp-popup.component'
import { ActivatedRoute } from '@angular/router'
import { DialogConfirmComponent } from '../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'
// import { DOCUMENT } from '@angular/common'
// tslint:enable

@Component({
  selector: 'ws-app-competency-labels',
  templateUrl: './competency-labels.component.html',
  styleUrls: ['./competency-labels.component.scss'],
})
export class CompetencyLabelsComponent implements OnInit, OnDestroy, AfterViewInit {
  private activitySubscription: any
  private unsubscribe = new Subject<void>()
  labels: NSWatCompetency.ICompActivity[] = []
  groups: NSWatActivity.IActivityGroup[] = []
  @Input() editData!: any
  activeGroupIdx = 0
  selectedCompIdx = 0
  untitedRole = 'Untitled role'
  activityForm!: FormGroup
  userslist!: any[]
  canshowName = 1
  canshow = -1
  filteredCompetencies!: Observable<any[]>
  filteredCompetenciesV1 = new BehaviorSubject<any[]>([])

  constructor(
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private allocateSrvc: AllocationService,
    private watStore: WatStoreService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private activated: ActivatedRoute,
    // @Inject(DOCUMENT) private document: Document
  ) {
  }

  get labelsList(): FormArray {
    return this.activityForm.get('labelsArray') as FormArray
  }

  get groupList(): FormArray {
    return this.activityForm.get('groupsArray') as FormArray
  }
  groupListByIndex(index: number): FormArray {
    return ((this.activityForm.get('groupsArray') as FormArray).at(index) as any).get('compDescription')
  }

  get groupcompetencyList(): FormArray {
    const lst = this.groupList.at(this.activeGroupIdx) as FormGroup
    const frmctrl = (lst ? lst.get('competincies') : new FormArray([])) as FormArray
    return frmctrl
  }
  get getActivityForm() {
    return JSON.stringify(inspect(this.activityForm.controls.groupsArray.value))
  }

  ngOnInit(): void {
    this.activityForm = new FormGroup({})
    this.createForm()
    this.initListen()
    this.activitySubscription = this.watStore.getactivitiesGroup.subscribe(groups => {
      if (groups) {
        this.groups = groups
        // console.log(groups)
        this.updateForm()
      }
    })
    // to fill edit data once
    this.watStore.getactivitiesGroup.pipe(first()).subscribe(() => {
      const grpData = _.get(this.editData, 'list')
      for (let i = 0; grpData && i < grpData.length && ((grpData.length || 0) + 1) === this.groups.length; i += 1) {
        const grpROle = _.get(grpData[i], 'roleDetails')
        const grp: NSWatCompetency.ICompActivityGroup = {
          localId: grpROle && grpROle.localId || this.watStore.getID,
          competincies: this.formBuilder.array([]) as unknown as NSWatCompetency.ICompActivity[],
          roleId: grpROle && grpROle.id || '',
          roleName: grpROle && grpROle.name || this.untitedRole,
          roleDescription: grpROle && grpROle.description || 'Role description',
        }
        if (!(this.groupcompetencyList && this.groupcompetencyList.value)) {
          this.addNewGroup(false, grp)
        }
        // debugger
        const complist = _.map(_.get(grpData[i], 'competencyDetails'), (numa: any) => {
          return {
            localId: this.watStore.getID,
            compId: _.get(numa, 'id') || '',
            compName: _.get(numa, 'name') || '',
            compDescription: _.get(numa, 'description') || '',
            compLevel: _.get(numa, 'level') || '',
            compType: _.get(numa, 'additionalProperties.competencyType') || '',
            compArea: _.get(numa, 'additionalProperties.competencyArea') || '',
            levelList: [_.get(numa, 'chield')] || [this.activated.snapshot.data.pageData.data.levels],
            compSource: _.get(numa, 'source') || 'Work Allocation Tool',
          }
        })
        this.activeGroupIdx = i + 1
        this.addNewGroupActivityCustom(i + 1, complist)
      }
      this.watStore.setgetcompetencyGroup(this.groupList.value, false, false)
      this.updateCompData()
    })
  }
  initListen() {
    this.activityForm.controls['groupsArray'].valueChanges
      .pipe(
        debounceTime(500),
        switchMap(async formValue => {
          let update = true
          _.each(_.flatten(_.map(formValue, 'competincies')), valu1 => {
            if (typeof (valu1.compName) === 'object') {
              update = false
            }
          })
          if (update) {
            this.watStore.setgetcompetencyGroup(formValue, false, true)
          }
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy() {
    this.unsubscribe.next()
    this.activitySubscription.unsubscribe()
  }
  drop(event: CdkDragDrop<NSWatCompetency.ICompActivity[]>) {
    if (event.previousContainer === event.container) {
      // tslint:disable
      moveItemInArray((this.activityForm.get('labelsArray') as FormArray)!.controls, event.previousIndex, event.currentIndex)
      moveItemInArray(this.activityForm.get('labelsArray')!.value, event.previousIndex, event.currentIndex)
      moveItemInArray(this.labelsList.controls, event.previousIndex, event.currentIndex)
      moveItemInArray(this.labelsList.value, event.previousIndex, event.currentIndex)
      // tslint:enable
      // this.changeDetector.detectChanges()
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
    }
  }

  dropgroup(event: CdkDragDrop<NSWatCompetency.ICompActivity[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.groupcompetencyList.controls, event.previousIndex, event.currentIndex)
      moveItemInArray(this.groupcompetencyList.value, event.previousIndex, event.currentIndex)
    } else {
      if (!event.item.data.compName) {
        this.snackBar.open('Competency Name is required to drag', undefined, { duration: 2000 })
        return
      }
      const previousContainerIndex = parseInt(event.previousContainer.id.replace('compe_', ''), 10)
      const targetContainerIndex = parseInt(event.container.id.replace('compe_', ''), 10)
      // tslint:disable
      // console.log(actualIdx)
      const oldArray = (this.activityForm.get('groupsArray') as any)!.at(previousContainerIndex).get('competincies')
      const newArray = (this.activityForm.get('groupsArray') as any)!.at(targetContainerIndex).get('competincies')

      if (targetContainerIndex === 0) {
        // means dropped to unmapped
        let aaa = (oldArray as FormArray).at(event.previousIndex) as FormGroup

        (oldArray as FormArray).at(event.previousIndex).patchValue({
          ...(aaa.value),
          roleId: '',
          roleName: this.untitedRole,
          roleDescription: 'Role description',
        })
      }

      // tslint:enable
      transferArrayItem(oldArray.controls, newArray.controls, event.previousIndex, event.currentIndex)
      transferArrayItem(oldArray.value, newArray.value, event.previousIndex, event.currentIndex)

      /**Please do not delete these methods : for testing Purpose */
      // this.addNewGroupActivityCustom(targetContainerIndex, newArray.value)
      // this.addNewGroupActivityCustom(previousContainerIndex, oldArray.value)
      // this.activityForm.reset()
      this.updateCompData()
      this.changeDetector.detectChanges()
    }
    // console.log(this.groupList.value)

    this.watStore.setgetcompetencyGroup(this.groupList.value, false, true)

  }
  // sortPredicate(index: number, item: CdkDrag<NSWatCompetency.ICompActivity>) {
  //   return (index + 1) % 2 === item.data % 2
  // }
  /** Predicate function that only allows non empty to be dropped into a list. */
  evenPredicate(item: CdkDrag<NSWatCompetency.ICompActivity>) {
    // return item.data % 2 === 0
    if (item.data) {
      return true
    }
    return false
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return true
  }
  setlabelsValues(val: any) {
    this.labelsList.patchValue(val)
  }
  setGroupValues(val: any) {
    this.groupList.patchValue(val)
  }
  setGroupActivityValues(val: any) {
    this.groupcompetencyList.patchValue(val)
  }

  addNewLabel() {
    const oldValue = this.labelsList
    const fg = this.formBuilder.group({
      localId: this.watStore.getID,
      activityName: '',
      compDescription: '',
      assignedTo: '',
    })

    oldValue.push(fg)
    this.setlabelsValues([...oldValue.value])
    // this.changeDetector.detectChanges()

  }
  addNewGroup(_needDefaultComp = true, grp?: NSWatCompetency.ICompActivityGroup) {
    const oldValue = this.groupList
    const fg = this.formBuilder.group({
      localId: this.watStore.getID,
      competincies: this.formBuilder.array([]),
      roleId: grp && grp.roleId || '',
      roleName: grp && grp.roleName || this.untitedRole,
      roleDescription: grp && grp.roleDescription || 'Role description',
    })
    if (_needDefaultComp) {
      const comps = fg.get('competincies') as FormArray
      const fga = this.formBuilder.group({
        localId: this.watStore.getID,
        compId: '',
        compName: '',
        compDescription: '',
        compLevel: '',
        compType: '',
        compArea: '',
        levelList: [],
        compSource: 'Work Allocation Tool',
      })
      comps.push(fga)
      fg.controls.competincies.patchValue([...comps.value])
    }
    oldValue.push(fg)
    this.setGroupValues([...oldValue.value])
    // to show hide Role name
    this.canshowName = this.groupList.length - 1
  }
  addNewGroupActivityCustom(idx: number, competincies: NSWatCompetency.ICompActivity[]) {
    if (idx >= 0) {
      const oldValue = this.groupcompetencyList as FormArray
      // const newForlAryList = this.formBuilder.array([])
      competincies.forEach((ac: NSWatCompetency.ICompActivity) => {
        const fga = this.formBuilder.group({
          localId: this.watStore.getID,
          compId: ac.compId,
          compName: ac.compName,
          compDescription: ac.compDescription,
          compLevel: ac.compLevel,
          compType: ac.compType,
          compArea: ac.compArea,
          levelList: ac.levelList || [],
          compSource: ac.compSource,
        })
        oldValue.push(fga)
      })
      if (oldValue && oldValue.value) {
        // tslint:disable-next-line: no-non-null-assertion
        this.setGroupActivityValues([...oldValue!.value])
      }
    }
  }
  addNewGroupActivity(idx: number) {
    if (idx >= 0) {
      const oldValue = this.groupcompetencyList as FormArray
      const fga = this.formBuilder.group({
        localId: this.watStore.getID,
        compId: '',
        compName: '',
        compDescription: '',
        compLevel: '',
        compType: '',
        compArea: '',
        compSource: '',
        levelList: [],
      })
      oldValue.push(fga)
      this.setGroupActivityValues([...oldValue.value])
    }
  }
  enter(i: number) {
    this.activeGroupIdx = i
  }
  updateForm() {
    if ((this.groups.length - 1) === this.groupList.length) {
      if (this.groups.length >= 2) {
        const lastGroup = _.last(this.groups)
        // tslint:disable-next-line: no-non-null-assertion
        const grp = {
          localId: _.get(lastGroup, 'localId') || this.watStore.getID,
          competincies: [],
          roleId: _.get(lastGroup, 'groupId') || '',
          roleName: _.get(lastGroup, 'groupName') || '',
          roleDescription: _.get(lastGroup, 'groupDescription') || '',
        }
        this.addNewGroup(false, grp)
      }
    } else {
      for (let index = 0; index < this.groups.length; index += 1) {
        // this.groupListByIndex(index).
        if (index > 0) {
          const grp = {
            localId: _.get(this.groups[index], 'localId') || this.watStore.getID,
            competincies: [],
            roleId: _.get(this.groups[index], 'groupId') || '',
            roleName: _.get(this.groups[index], 'groupName') || '',
            roleDescription: _.get(this.groups[index], 'groupDescription') || '',
          }
          if (!(this.groupList.at(index) && this.groupList.at(index).value)) {
            this.addNewGroup(false, grp)
          }
          const oldLocalValue = this.groupList.at(index).get('localId') as FormControl
          const oldRIdValue = this.groupList.at(index).get('roleId') as FormControl
          const oldRNameValue = this.groupList.at(index).get('roleName') as FormControl
          const oldRDescValue = this.groupList.at(index).get('roleDescription') as FormControl
          oldRIdValue.patchValue(this.groups[index].groupId)
          oldRNameValue.patchValue(this.groups[index].groupName)
          oldRDescValue.patchValue(this.groups[index].groupDescription)
          oldLocalValue.patchValue(this.groups[index].localId)
          // this.setGroupValues([...oldValue.value])
        }
      }
    }
    this.watStore.setgetcompetencyGroup(this.groupList.value, false, false)
  }
  createForm() {
    this.activityForm = this.formBuilder.group({
      labelsArray: this.formBuilder.array([]),
      groupsArray: this.formBuilder.array([]),
    })
    if (this.editData) {
      const unmappedCompetencies = _.get(this.editData, 'unmdC')
      if (unmappedCompetencies && unmappedCompetencies.length) {
        /**this will always be on index 0 */
        this.addNewGroup(false)
        this.addNewGroupActivityCustom(0, unmappedCompetencies)
        /**to update all comp store */
        this.watStore.setgetcompetencyGroup(this.groupList.value, false, false)
        this.updateCompData()
      } else {
        this.addNewGroup(true)
      }
    } else {
      this.addNewGroup()
    }
  }
  // **not in USE */
  createActivityControl(activityObj: NSWatCompetency.ICompActivity) {
    const newControl = this.formBuilder.group({
      localId: new FormControl(this.watStore.getID),
      compId: new FormControl(activityObj.compId),
      compName: new FormControl(activityObj.compName),
      compDescription: new FormControl(activityObj.compDescription),
      compLevel: new FormControl(activityObj.compLevel),
      compType: new FormControl(activityObj.compType),
      compArea: new FormControl(activityObj.compArea),
      compSource: new FormControl(activityObj.compSource),
    })
    const optionsArr = this.activityForm.controls['labelsArray'] as FormArray
    optionsArr.push(newControl)
  }
  createGroupControl(activityObj: NSWatCompetency.ICompActivityGroup) {
    const newControl = this.formBuilder.group({
      localId: this.watStore.getID,
      roleId: new FormControl(activityObj.roleId),
      roleName: new FormControl(activityObj.roleName),
      roleDescription: new FormControl(activityObj.roleDescription),
      competincies: this.createActivtyControl(activityObj.competincies),
    })
    const optionsArr = this.activityForm.controls['groupsArray'] as FormArray
    optionsArr.push(newControl)
  }
  createActivtyControl(activityObj: NSWatCompetency.ICompActivity[]) {
    return activityObj.map((v: NSWatCompetency.ICompActivity) => {
      return this.formBuilder.array([{
        localId: this.watStore.getID,
        activityId: new FormControl(v.compId),
        activityName: new FormControl(v.compName),
        compDescription: new FormControl(v.compDescription),
        // assignedTo: new FormControl(v.assignedTo),
      }])
    })
  }
  submitResult(qualityForm: any) {
    if (qualityForm) {

    }
  }
  public async filterUsers(value: string) {
    // if (value && value.length > 3) {
    const filterValue = value.toLowerCase()
    // tslint:disable-next-line: deprecation
    this.allocateSrvc.onSearchUser(filterValue).subscribe(res => {
      this.userslist = res.result.response.content
    })
    // } else {
    // this.userslist = []
    // }
  }

  public async filterCompetencies(val: string, index: number) {
    this.selectedCompIdx = index
    if (val.length > 2) {
      // this.filteredCompetencies = this.allocateSrvc.onSearchCompetency(val).pipe(
      //   map(res => {
      //     return res.responseData
      //   })
      // )
      this.allocateSrvc.onSearchCompetency(val).pipe(
        map(res => {
          return res.responseData
        })
      ).subscribe((response: any) => {
        this.filteredCompetenciesV1.next(response)
      })

    }
  }
  setSelectedFilter(index: number) {
    this.selectedCompIdx = index
  }
  public competencySelected(event: any, gIdx: number) {
    const lst = this.groupList.at(gIdx).get('competincies') as FormArray
    // tslint:disable
    const localOd = lst.at(this.selectedCompIdx).get('localId')!.value
    // tslint:enable
    // _.get(event, 'option.value.localId')
    let oldcompData = null
    if (localOd) {
      oldcompData = _.first(_.filter(lst.value, { localId: localOd }))
      if (typeof oldcompData.compName === 'object') {
        // **override object */
        if (!_.get(oldcompData, 'compName.id') || _.get(oldcompData, 'name.id')) {
          oldcompData = {
            localId: _.get(oldcompData, 'compName.localId') || _.get(oldcompData, 'localId') || this.watStore.getID,
            name: oldcompData.compName.name,
            id: oldcompData.compId,
            description: oldcompData.compDescription,
            type: oldcompData.compType,
            area: oldcompData.compArea,
            source: oldcompData.compSource,
            level: oldcompData.compLevel,
          }
        } else {
          const oldOptionData = _.get(oldcompData, 'compName')
          const finalLevel = this.watStore.getUpdateCompGroupById(localOd)
          oldcompData = {
            name: typeof (oldcompData.compName) === 'object' ? oldOptionData.name : oldcompData.compName,
            id: oldcompData.compId || oldOptionData.id,
            description: oldcompData.compDescription || oldOptionData.description,
            type: _.get(finalLevel, 'compType') || _.get(oldOptionData, 'additionalProperties.competencyType'),
            area: _.get(finalLevel, 'compArea') || _.get(oldOptionData, 'additionalProperties.competencyArea'),
            source: oldcompData.compSource || oldOptionData.source,
            level: _.get(finalLevel, 'compLevel'),
            localId: localOd,
          }
        }
      }
    } else {
      // ** if you are here meaning Something is wrong in code */
      // oldcompData = _.first(_.filter(lst.value, { compName: _.get(event, 'option.value.name') }))
    }
    const chldrnVal = _.get(event, 'option.value.children') ||
      this.activated.snapshot.data.pageData.data.levels || {}
    const children = [...chldrnVal]
    const dialogRef = this.dialog.open(WatCompPopupComponent, {
      restoreFocus: false,
      disableClose: true,
      data: { ...oldcompData, children } || event.option.value,
    })
    if (this.activated.snapshot.data && this.activated.snapshot.data.pageData) {
      dialogRef.componentInstance.defaultCompLevels = this.activated.snapshot.data.pageData
    }
    // Manually restore focus to the menu trigger since the element that
    // opens the dialog won't be in the DOM any more when the dialog closes.
    dialogRef.afterClosed().subscribe((val: any) => {
      if (val.ok) {
        const newVal = val.data
        const frmctrl0 = lst.at(this.selectedCompIdx).get('compId') as FormControl
        // frmctrl0.patchValue(_.get(event, 'option.value.id') || '')
        frmctrl0.patchValue(_.get(newVal, 'compId') || '')

        const frmctrl = lst.at(this.selectedCompIdx).get('compDescription') as FormControl
        frmctrl.patchValue(_.get(newVal, 'compDescription') || '')

        // frmctrl0.patchValue(_.get(newVal, 'localId') || '')
        const frmctrlw = lst.at(this.selectedCompIdx).get('localId') as FormControl
        frmctrlw.patchValue(_.get(newVal, 'localId') || localOd || this.watStore.getID)

        const frmctrl1 = lst.at(this.selectedCompIdx).get('compName') as FormControl
        frmctrl1.patchValue(_.get(newVal, 'compName') || '')

        const source = lst.at(this.selectedCompIdx).get('compSource') as FormControl
        source.patchValue(_.get(newVal, 'compSource') || '')

        const frmctrl2 = lst.at(this.selectedCompIdx).get('compLevel') as FormControl
        frmctrl2.patchValue(_.get(newVal, 'compLevel'))

        const frmctrl3 = lst.at(this.selectedCompIdx).get('compType') as FormControl
        frmctrl3.patchValue(_.get(newVal, 'compType') || '')

        const frmctrl4 = lst.at(this.selectedCompIdx).get('compArea') as FormControl
        frmctrl4.patchValue(_.get(newVal, 'compArea') || '')

        const levelList = lst.at(this.selectedCompIdx).get('levelList') as FormArray
        levelList.patchValue(_.get(newVal, 'levelList') || [])

        this.watStore.setgetcompetencyGroup(this.groupList.value, false, true)
        this.updateCompData()
      } else {
        const frmctrl1 = lst.at(this.selectedCompIdx).get('compName') as FormControl
        frmctrl1.patchValue(_.get(val, 'data.name') || '')
        // const frmctrl = lst.at(this.selectedCompIdx).get('compDescription') as FormControl
        // frmctrl.patchValue(_.get(event, 'option.value.description') || '')
        this.watStore.setgetcompetencyGroup(this.groupList.value, false, true)
        this.updateCompData()
      }
    })

  }
  updateCompData() {
    // // const existingCompList=this.watStore.
    // const list = _.compact(_.map(_.flatten(_.map(this.groupList.value, 'competincies')), c => {
    //   if (c) {
    //     // && c.compName
    //     return c
    //   }
    // }))
    /**not it's automated */
    // this.watStore.setCompGroup()
  }
  show(idx: number) {
    if (idx) { }
    this.canshow = -1
  }

  hide() {
    this.canshow = -1
  }

  showName(idx: number) {
    if (idx) { }

    this.canshowName = -1
  }

  hideName() {
    this.canshowName = -1
  }
  deleteRowCompetency(roleIdx: number, compIdx: number) {
    const roleGrp = this.groupList.at(roleIdx) as FormGroup
    const competinciesLst = roleGrp.get('competincies') as FormArray
    competinciesLst.removeAt(compIdx)
    this.watStore.setgetcompetencyGroup(this.groupList.value, false, true)
  }
  deleteSingleCompetency(grpIdx: number, compIdx: number) {
    if (grpIdx >= 0 && compIdx >= 0) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          title: 'Delete competency?',
          body: '  The competency will be deleted from this work order',
          ok: 'Delete',
          cancel: 'Go back',
        },
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteRowCompetency(grpIdx, compIdx)
          this.snackBar.open('Activity deleted successfully!! ', undefined, { duration: 2000 })
        }
      })
    }
  }
  log(val: any) {
    // tslint:disable-next-line
    console.log(val)
  }
}
