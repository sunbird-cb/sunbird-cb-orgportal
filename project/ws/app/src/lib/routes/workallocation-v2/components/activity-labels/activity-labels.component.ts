import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { NSWatActivity } from '../../models/activity-wot.model'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
// import { debounceTime } from 'rxjs/operators'
import { inspect } from 'util'
import { AllocationService } from '../../../workallocation/services/allocation.service'
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs'
import { WatStoreService } from '../../services/wat.store.service'
import { MatDialog, MatSnackBar } from '@angular/material'
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations'
import { WatRolePopupComponent } from './wat-role-popup/wat-role-popup.component'
// tslint:disable
import * as _ from 'lodash'
// tslint:enable
@Component({
  selector: 'ws-app-activity-labels',
  templateUrl: './activity-labels.component.html',
  styleUrls: ['./activity-labels.component.scss'],
  animations: [
    trigger('fadeInGrow', [
      state('in', style({ transform: 'translateY(0)' })),
      transition('void => *', [
        animate(
          500,
          keyframes([
            style({ opacity: 0, transform: 'translateY(-100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(15px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
          ])
        ),
      ]),
      transition('* => void', [
        animate(
          500000,
          keyframes([
            style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(-15px)', offset: 0.7 }),
            style({ opacity: 0, transform: 'translateY(100%)', offset: 1.0 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class ActivityLabelsComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe = new Subject<void>()
  @Input() editData!: any
  labels: NSWatActivity.IActivity[] = []
  groups: NSWatActivity.IActivityGroup[] = []
  selectedActivityIdx = 0
  activeGroupIdx = 0
  untitedRole = 'Untitled role'
  activityForm!: FormGroup
  userslist!: any[]
  filteredActivityDesc!: Observable<any[]>
  filteredRoles!: Observable<any[]>
  canshowName = 1
  canshow = -1
  constructor(
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private allocateSrvc: AllocationService,
    private watStore: WatStoreService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.evenPredicate = this.evenPredicate.bind(this)
    if (this.editData) {

    }
  }

  get labelsList(): FormArray {
    return this.activityForm.get('labelsArray') as FormArray
  }

  get groupList(): FormArray {
    return this.activityForm.get('groupsArray') as FormArray
  }

  get groupActivityList(): FormArray {
    const lst = this.groupList.at(this.activeGroupIdx) as FormGroup
    const frmctrl = lst.get('activities') as FormArray
    return frmctrl
  }
  get getActivityForm() {
    return JSON.stringify(inspect(this.activityForm.controls.groupsArray.value))
  }

  ngOnInit(): void {
    this.activityForm = new FormGroup({})
    this.createForm()
    this.initListen()
  }
  initListen() {
    this.activityForm.controls['groupsArray'].valueChanges
      .pipe(
        debounceTime(500),
        switchMap(async formValue => {
          this.watStore.setgetactivitiesGroup(formValue)
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy() {
    this.unsubscribe.next()
  }
  drop(event: CdkDragDrop<NSWatActivity.IActivity[]>) {
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

  dropgroup(event: CdkDragDrop<NSWatActivity.IActivity[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.groupActivityList.controls, event.previousIndex, event.currentIndex)
      moveItemInArray(this.groupActivityList.value, event.previousIndex, event.currentIndex)
    } else {
      if (!event.item.data.activityDescription) {
        this.snackBar.open('Activity is required to drag', undefined, { duration: 2000 })
        return
      }
      const previousContainerIndex = parseInt(event.previousContainer.id.replace('groups_', ''), 10)
      const targetContainerIndex = parseInt(event.container.id.replace('groups_', ''), 10)
      // tslint:disable
      // console.log(actualIdx)
      const oldArray = (this.activityForm.get('groupsArray') as any)!.at(previousContainerIndex).get('activities')
      const newArray = (this.activityForm.get('groupsArray') as any)!.at(targetContainerIndex).get('activities')
      // tslint:enable
      transferArrayItem(oldArray.controls, newArray.controls, event.previousIndex, event.currentIndex)
      transferArrayItem(oldArray.value, newArray.value, event.previousIndex, event.currentIndex)
      /**Please do not delete these methods : for testing Purpose */
      // this.addNewGroupActivityCustom(targetContainerIndex, newArray.value)
      // this.addNewGroupActivityCustom(previousContainerIndex, oldArray.value)
      // this.activityForm.reset()
      this.changeDetector.detectChanges()
      // console.log(this.watStore.getactivitiesGroup)

      // console.log(oldArray, newArray)
    }
    // console.log(this.groupList.value)

    this.watStore.setgetactivitiesGroup(this.groupList.value)
  }
  // sortPredicate(index: number, item: CdkDrag<NSWatActivity.IActivity>) {
  //   return (index + 1) % 2 === item.data % 2
  // }
  /** Predicate function that only allows non empty to be dropped into a list. */
  evenPredicate(item: CdkDrag<NSWatActivity.IActivity>) {
    // return item.data % 2 === 0
    if (item.data) {
      return true
    }
    // this.snackBar.open('Activity is required to drag', undefined, { duration: 200 })
    return false
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return true
  }
  log(value: any) {
    if (value) {
      // console.log(value)
    }
  }
  setlabelsValues(val: any) {
    this.labelsList.patchValue(val)
  }
  setGroupValues(val: any) {
    this.groupList.patchValue(val)
  }
  deleteActivityGromGrp(index: number) {
    if (index >= 0) {
      this.groupActivityList.removeAt(index)
    }
  }
  setGroupActivityValues(val: any) {
    this.groupActivityList.patchValue(val)
  }

  addNewLabel() {
    const oldValue = this.labelsList
    const fg = this.formBuilder.group({
      activityId: '',
      activityName: '',
      activityDescription: '',
      assignedTo: '',
      assignedToId: '',
      assignedToEmail: '',
    })

    oldValue.push(fg)
    this.setlabelsValues([...oldValue.value])
    // this.changeDetector.detectChanges()

  }
  addNewGroup() {
    const oldValue = this.groupList
    const fg = this.formBuilder.group({
      activities: this.formBuilder.array([]),
      groupId: '',
      groupName: this.untitedRole,
      groupDescription: '',
    })
    const activits = fg.get('activities') as FormArray
    const fga = this.formBuilder.group({
      activityId: '',
      activityName: '',
      activityDescription: '',
      assignedTo: '',
      assignedToId: '',
      assignedToEmail: '',
    })
    activits.push(fga)
    fg.controls.activities.patchValue([...activits.value])
    oldValue.push(fg)
    this.setGroupValues([...oldValue.value])
    // to show hide Role name
    this.canshowName = this.groupList.length - 1
  }
  addNewGroupActivityCustom(idx: number, activities: NSWatActivity.IActivity[]) {
    if (idx >= 0) {
      const oldValue = this.groupActivityList as FormArray
      // const newForlAryList = this.formBuilder.array([])
      activities.forEach((ac: NSWatActivity.IActivity) => {
        const fga = this.formBuilder.group({
          activityId: ac.activityId,
          activityName: ac.activityName,
          activityDescription: ac.activityDescription,
          assignedTo: ac.assignedTo,
          assignedToId: ac.assignedToId,
          assignedToEmail: ac.assignedToEmail,
        })
        oldValue.push(fga)
      })
      // const newValues = _.filter(oldValue.controls, vall => !!vall.value.activityDescription) as FormArray
      // tslint:disable-next-line: no-non-null-assertion
      this.setGroupActivityValues([...oldValue!.value])
    }
  }
  addNewGroupActivity(idx: number) {
    if (idx >= 0) {
      const oldValue = this.groupActivityList as FormArray
      const fga = this.formBuilder.group({
        activityId: '',
        activityName: '',
        activityDescription: '',
        assignedTo: '',
        assignedToId: '',
        assignedToEmail: '',
      })
      oldValue.push(fga)
      this.setGroupActivityValues([...oldValue.value])
    }
  }
  enter(i: number) {
    this.activeGroupIdx = i
  }
  createForm() {
    this.activityForm = this.formBuilder.group({
      labelsArray: this.formBuilder.array([]),
      groupsArray: this.formBuilder.array([]),
    })
    // if (this.labels && this.labels.length) {
    //   this.labels.forEach((v: NSWatActivity.IActivity) => {
    //     if (v) {
    // this.createActivityControl({
    //   activityName: '',
    //   activityDescription: '',
    //   assignedTo: '',
    // })
    this.addNewGroup()
    // this.addNewGroupActivity(0)
    // this.createGroupControl({
    //   groupName: 'Untitled role',
    //   groupDescription: 'Role description',
    //   activities: [{
    //     activityName: 'unmed',
    //     activityDescription: 'desc',
    //     assignedTo: ''
    //   }]
    // })
    //     }
    //   })
    // }
    // this.activityForm.valueChanges.pipe(debounceTime(100)).subscribe(() => {
    //   // this.value.emit(JSON.parse(JSON.stringify(this.qualityForm.value)))
    // })
  }
  createActivityControl(activityObj: NSWatActivity.IActivity) {
    const newControl = this.formBuilder.group({
      activityId: new FormControl(activityObj.activityId),
      activityName: new FormControl(activityObj.activityName),
      activityDescription: new FormControl(activityObj.activityDescription),
      assignedTo: new FormControl(activityObj.assignedTo),
      assignedToId: new FormControl(activityObj.assignedToId),
      assignedToEmail: new FormControl(activityObj.assignedToEmail),
    })
    const optionsArr = this.activityForm.controls['labelsArray'] as FormArray
    optionsArr.push(newControl)
  }
  createGroupControl(activityObj: NSWatActivity.IActivityGroup) {
    const newControl = this.formBuilder.group({
      groupId: new FormControl(activityObj.groupId),
      groupName: new FormControl(activityObj.groupName),
      groupDescription: new FormControl(activityObj.groupDescription),
      activities: this.createActivtyControl(activityObj.activities),
    })
    const optionsArr = this.activityForm.controls['groupsArray'] as FormArray
    optionsArr.push(newControl)
  }
  createActivtyControl(activityObj: NSWatActivity.IActivity[]) {
    return activityObj.map((v: NSWatActivity.IActivity) => {
      return this.formBuilder.array([{
        activityId: new FormControl(v.activityId),
        activityName: new FormControl(v.activityName),
        activityDescription: new FormControl(v.activityDescription),
        assignedTo: new FormControl(v.assignedTo),
        assignedToId: new FormControl(v.assignedToId),
        assignedToEmail: new FormControl(v.assignedToEmail),
      }])
    })
  }
  submitResult(qualityForm: any) {
    if (qualityForm) { }
    // console.log(qualityForm)
  }
  public async filterUsers(value: string) {
    // if (value && value.length > 3) {
    const filterValue = value.toLowerCase()
    // tslint:disable-next-line: deprecation
    this.allocateSrvc.onSearchUser(filterValue).subscribe(res => {
      this.userslist = res.result.data
    })
    // } else {
    // this.userslist = []
    // }
  }

  public async filterActivities(val: string, index: number) {
    this.selectedActivityIdx = index
    // this.filteredActivityDesc = this.allocateSrvc.onSearchRole(val).pipe(
    //   map(res => res.filter((role: any) => {
    //     role.childNodes.map((node: any) => {
    //       if (node.description.indexOf(val) >= 0) {
    //         return node
    //       }
    //     })
    //   }))
    // )
    if (val.length > 2) {
      const req = {
        searches: [
          {
            type: 'ACTIVITY',
            field: 'description',
            keyword: val,
          },
          {
            type: 'ACTIVITY',
            field: 'status',
            keyword: 'VERIFIED',
          },
        ],
      }
      this.filteredActivityDesc = this.allocateSrvc.onSearchActivity(req).pipe(
        map(res => {
          return res.responseData
        })
      )
    }
  }

  public async filterRoles(val: string) {
    this.filteredRoles = this.allocateSrvc.onSearchRole(val).pipe(
      map(res => res.filter((role: any) => {
        return role.name.toLowerCase().indexOf(val.toLowerCase()) >= 0
      }))
    )
  }

  public roleSelected(event: any, gIdx: number) {
    this.activeGroupIdx = gIdx
    const lst = this.groupList.at(this.activeGroupIdx) as FormGroup

    const dialogRef = this.dialog.open(WatRolePopupComponent, {
      restoreFocus: false,
      disableClose: true,
      data: event.option.value,
    })

    // Manually restore focus to the menu trigger since the element that
    // opens the dialog won't be in the DOM any more when the dialog closes.
    dialogRef.afterClosed().subscribe((val: any) => {
      if (val.ok) {
        const frmctrl = lst.get('groupDescription') as FormControl
        frmctrl.patchValue(event.option.value.description)

        const frmctrl1 = lst.get('groupName') as FormControl
        frmctrl1.patchValue(event.option.value.name)

        const frmctrl2 = lst.get('groupId') as FormControl
        frmctrl2.patchValue(event.option.value.id)

        // wait 200ms
        // setTimeout(() => {
        if (val.data && val.data.length > 0) {
          /**Reject Already Exist values */
          const newValues = _.reject(val.data, item =>
            _.find(
              _.get(lst.get('activities'), 'value'),
              { activityDescription: item.activityDescription }
            )
          )
          // console.log(newValues)
          const unselectVals =
            _.reject(_.get(lst.get('activities'), 'value'), item =>
              _.find(val.data, { activityDescription: item.activityDescription }))
          if (newValues && newValues.length > 0) {
            this.addNewGroupActivityCustom(this.activeGroupIdx, [...newValues])
          }
          this.deleteUnselectedActivities(unselectVals, this.activeGroupIdx)
          // this.deleteActivityGromGrp(_.findIndex(_.get(lst.get('activities'), 'value'), (itm: any) => !itm.activityDescription))

        } else {
          this.deleteUnselectedActivities([], this.activeGroupIdx)
        }
        // }, 200)
        // add a blank Activity
        this.addNewGroupActivity(this.activeGroupIdx)
        // to get focus back
        // this.menuTrigger.focus()
      } else {
        const frmctrl = lst.get('groupDescription') as FormControl
        frmctrl.patchValue(event.option.value.description || '')

        const frmctrl1 = lst.get('groupName') as FormControl
        frmctrl1.patchValue(event.option.value.name || '')

        const frmctrl2 = lst.get('groupId') as FormControl
        frmctrl2.patchValue(event.option.value.id || '')

        this.watStore.setgetactivitiesGroup(this.groupList.value)
      }
      this.watStore.setgetactivitiesGroup(this.groupList.value)
    })

  }
  deleteUnselectedActivities(unselectVals: any, gIdx: number) {
    const lst = this.groupList.at(gIdx) as FormGroup
    if (unselectVals && unselectVals.length > 0) {
      /**Delete unselected Values */
      for (let i = unselectVals.length - 1; i >= 0; i -= 1) {
        this.deleteActivityGromGrp(_.findIndex(_.get(lst.get('activities'), 'value'), (itm: any) =>
          unselectVals[i].activityDescription === itm.activityDescription))
      }
    } else {
      const existingLst = _.get(lst.get('activities'), 'value')
      for (let i = existingLst.length - 1; i >= 0; i -= 1) {
        this.deleteActivityGromGrp(i)
      }
    }
  }

  activitySelected(event: any, gIdx: number) {
    this.activeGroupIdx = gIdx
    const lst = this.groupList.at(this.activeGroupIdx).get('activities') as FormArray
    const frmctrl = lst.at(this.selectedActivityIdx).get('activityDescription') as FormControl
    frmctrl.patchValue(event.option.value.description)

    const frmctrl1 = lst.at(this.selectedActivityIdx).get('activityId') as FormControl
    frmctrl1.patchValue(event.option.value.id)

    this.watStore.setgetactivitiesGroup(this.groupList.value)
  }

  setSelectedFilter(index: number) {
    this.selectedActivityIdx = index
  }

  displayFn(data: any): string {
    return data ? data.name : ''
  }
  displayActivityFn(data: any): string {
    // this.selectedActivityIdx = aIdx
    // this.activeGroupIdx = gIdx
    return data ? data.activityDescription : ''
  }

  userClicked(event: any, gIdx: number) {
    if (event) {
      this.activeGroupIdx = gIdx
      let assignedTo = ''
      let assignedToId = ''
      let assignedToEmail = ''
      if (_.get(event, 'option.value') === 'Final authority') {
        assignedTo = 'Final authority'
        assignedToId = '',
          assignedToEmail = ''
      } else {
        // tslint:disable-next-line: prefer-template
        assignedTo = _.get(event, 'option.value.userDetails.first_name') + ' ' + _.get(event, 'option.value.userDetails.last_name')
        assignedToId = _.get(event, 'option.value.userDetails.wid'),
          assignedToEmail = _.get(event, 'option.value.userDetails.email')
      }
      const lst = this.groupList.at(this.activeGroupIdx).get('activities') as FormArray
      const frmctrl = lst.at(this.selectedActivityIdx).get('assignedTo') as FormControl
      frmctrl.patchValue(assignedTo || '')

      const frmctrl1 = lst.at(this.selectedActivityIdx).get('assignedToId') as FormControl
      frmctrl1.patchValue(assignedToId)

      const frmctrl2 = lst.at(this.selectedActivityIdx).get('assignedToEmail') as FormControl
      frmctrl2.patchValue(assignedToEmail)

      this.watStore.setgetactivitiesGroup(this.groupList.value)
    }
  }

  show(idx: number) {
    this.canshow = idx
  }

  hide() {
    this.canshow = -1
  }
  showName(idx: number) {
    this.canshowName = idx
  }

  hideName() {
    this.canshowName = -1
  }
}
