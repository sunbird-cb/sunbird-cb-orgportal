import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { NSWatActivity } from '../../models/activity-wot.model'
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
// import { debounceTime } from 'rxjs/operators'
import { inspect } from 'util'
import { AllocationService } from '../../../workallocation/services/allocation.service'
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs'
import { WatStoreService } from '../../services/wat.store.service'
import { MatDialog, MatSnackBar } from '@angular/material'
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations'
import { WatRolePopupComponent } from './wat-role-popup/wat-role-popup.component'
import { DialogConfirmComponent } from 'src/app/component/dialog-confirm/dialog-confirm.component'
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
    // private appRef: ApplicationRef
  ) {
    this.evenPredicate = this.evenPredicate.bind(this)
  }

  get labelsList(): FormArray {
    return this.activityForm.get('labelsArray') as FormArray
  }

  get groupList(): FormArray {
    // console.log(this.activityForm.get('groupsArray'))
    return this.activityForm.get('groupsArray') as FormArray
  }
  get grpArray(): FormArray | null {
    // console.log(this.activityForm.get('groupsArray'))
    return this.activityForm ? this.activityForm.get('groupsArray') as FormArray : null
  }
  get getControls(): AbstractControl[] {
    return this.grpArray ? this.grpArray.controls : []
  }
  get groupActivityList(): FormArray {
    const lst = this.groupList.at(this.activeGroupIdx) as FormGroup
    const frmctrl = (lst ? lst.get('activities') : new FormArray([])) as FormArray
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
          this.watStore.setgetactivitiesGroup(formValue, false, true)
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
      if (!(event.item.data.activityDescription || event.item.data.submissionFrom || event.item.data.assignedTo)) {
        this.snackBar.open('Empty activity!! You can not drag', undefined, { duration: 2000 })
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

    this.watStore.setgetactivitiesGroup(this.groupList.value, false, true)
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
  addNewGroup(_needDefaultActivity = true, grp?: NSWatActivity.IActivityGroup) {
    const oldValue = this.groupList
    const fg = this.formBuilder.group({
      activities: this.formBuilder.array([]),
      localId: (grp && grp.localId) || this.watStore.getID,
      groupId: grp && grp.groupId || '',
      groupName: grp && grp.groupName || this.untitedRole,
      groupDescription: grp && grp.groupDescription || '',
    })
    if (_needDefaultActivity) {
      const activits = fg.get('activities') as FormArray
      const fga = this.formBuilder.group({
        localId: this.watStore.getID,
        activityId: '',
        activityName: '',
        activityDescription: '',
        assignedTo: '',
        assignedToId: '',
        assignedToEmail: '',
        submissionFrom: '',
        submissionFromId: '',
        submissionFromEmail: '',
      })
      activits.push(fga)
      fg.controls.activities.patchValue([...activits.value])
    }
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
          localId: ac.localId,
          activityId: ac.activityId,
          activityName: ac.activityName,
          activityDescription: ac.activityDescription,
          submissionFrom: ac.submissionFrom,
          submissionFromId: ac.submissionFromId,
          submissionFromEmail: ac.submissionFromEmail,
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
        localId: this.watStore.getID,
        activityId: '',
        activityName: '',
        activityDescription: '',
        assignedTo: '',
        assignedToId: '',
        assignedToEmail: '',
        submissionFrom: '',
        submissionFromId: '',
        submissionFromEmail: '',
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
    if (this.editData) {
      const unmappedActivities = _.get(this.editData, 'unmdA')
      if (unmappedActivities && unmappedActivities.length) {
        /**this will always be on index 0 */
        this.addNewGroup(false)
        this.addNewGroupActivityCustom(0, unmappedActivities)
      } else {
        this.addNewGroup(true)
      }
      const grpData = _.get(this.editData, 'list')
      for (let i = 0; i < grpData.length; i += 1) {
        const actlist = _.map(_.get(grpData[i], 'roleDetails.childNodes'), (numa: any) => {
          return {
            localId: this.watStore.getID,
            activityId: _.get(numa, 'id'),
            activityName: _.get(numa, 'name'),
            activityDescription: _.get(numa, 'description'),
            submissionFrom: _.get(numa, 'submissionFrom'),
            submissionFromId: _.get(numa, 'submissionFromId'),
            submissionFromEmail: _.get(numa, 'submissionFromEmail'),
            assignedTo: _.get(numa, 'submittedToName'),
            assignedToId: _.get(numa, 'submittedToId'),
            assignedToEmail: _.get(numa, 'submittedToEmail'),
          }
        })
        const grp = {
          activities: [],
          localId: this.watStore.getID,
          groupId: _.get(grpData[i], 'roleDetails.id'),
          groupName: _.get(grpData[i], 'roleDetails.name'),
          groupDescription: _.get(grpData[i], 'roleDetails.description') || '',
        }
        this.addNewGroup(false, grp)
        this.activeGroupIdx = i + 1
        this.addNewGroupActivityCustom(i + 1, actlist)
        this.watStore.setgetactivitiesGroup(this.groupList.value, false, false)
      }
    } else {
      this.addNewGroup()
    }
  }

  createActivityControl(activityObj: NSWatActivity.IActivity) {
    const newControl = this.formBuilder.group({
      localId: activityObj.localId || this.watStore.getID,
      activityId: new FormControl(activityObj.activityId),
      activityName: new FormControl(activityObj.activityName),
      activityDescription: new FormControl(activityObj.activityDescription),
      assignedTo: new FormControl(activityObj.assignedTo),
      assignedToId: new FormControl(activityObj.assignedToId),
      assignedToEmail: new FormControl(activityObj.assignedToEmail),
      submissionFrom: new FormControl(activityObj.submissionFrom),
      submissionFromId: new FormControl(activityObj.submissionFromId),
      submissionFromEmail: new FormControl(activityObj.submissionFromEmail),
    })
    const optionsArr = this.activityForm.controls['labelsArray'] as FormArray
    optionsArr.push(newControl)
  }
  createGroupControl(activityObj: NSWatActivity.IActivityGroup) {
    const newControl = this.formBuilder.group({
      localId: activityObj.localId || this.watStore.getID,
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
        localId: v.localId || this.watStore.getID,
        activityId: new FormControl(v.activityId),
        activityName: new FormControl(v.activityName),
        activityDescription: new FormControl(v.activityDescription),
        assignedTo: new FormControl(v.assignedTo),
        assignedToId: new FormControl(v.assignedToId),
        assignedToEmail: new FormControl(v.assignedToEmail),
        submissionFrom: new FormControl(v.submissionFrom),
        submissionFromId: new FormControl(v.submissionFromId),
        submissionFromEmail: new FormControl(v.submissionFromEmail),
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
      this.userslist = res.result.response.content
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

        this.watStore.setgetactivitiesGroup(this.groupList.value, false, false)
      }
      this.watStore.setgetactivitiesGroup(this.groupList.value, false, true)
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

    this.watStore.setgetactivitiesGroup(this.groupList.value, false, true)
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

  userClicked(event: any, gIdx: number, type = 'to') {
    if (event) {
      if (type === 'to') {
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
          assignedTo = _.get(event, 'option.value.firstName') + ' ' + _.get(event, 'option.value.lastName')
          assignedToId = _.get(event, 'option.value.userId'),
            assignedToEmail = _.get(event, 'option.value.profileDetails.personalDetails.primaryEmail')
        }
        const lst = this.groupList.at(this.activeGroupIdx).get('activities') as FormArray
        const frmctrl = lst.at(this.selectedActivityIdx).get('assignedTo') as FormControl
        frmctrl.patchValue(assignedTo || '')

        const frmctrl1 = lst.at(this.selectedActivityIdx).get('assignedToId') as FormControl
        frmctrl1.patchValue(assignedToId || '')

        const frmctrl2 = lst.at(this.selectedActivityIdx).get('assignedToEmail') as FormControl
        frmctrl2.patchValue(assignedToEmail || '')
      } else {
        this.activeGroupIdx = gIdx
        // let submissionFrom = ''
        // let submissionFromId = ''
        // let submissionFromEmail = ''
        // if (_.get(event, 'option.value') === 'Final authority') {
        //   submissionFrom = 'Final authority'
        //   submissionFromId = '',
        //     submissionFromEmail = ''
        // } else {
        //   // tslint:disable-next-line: prefer-template
        //   submissionFrom = _.get(event, 'option.value.userDetails.first_name') + ' ' + _.get(event, 'option.value.userDetails.last_name')
        //   submissionFromId = _.get(event, 'option.value.userDetails.wid')
        //   submissionFromEmail = _.get(event, 'option.value.userDetails.email')
        // }
        // const lst = this.groupList.at(this.activeGroupIdx).get('activities') as FormArray
        // const frmctrl = lst.at(this.selectedActivityIdx).get('submissionFrom') as FormControl
        // frmctrl.patchValue(submissionFrom || '')

        // const frmctrl1 = lst.at(this.selectedActivityIdx).get('submissionFromId') as FormControl
        // frmctrl1.patchValue(submissionFromId)

        // const frmctrl2 = lst.at(this.selectedActivityIdx).get('submissionFromEmail') as FormControl
        // frmctrl2.patchValue(submissionFromEmail)
      }
      this.watStore.setgetactivitiesGroup(this.groupList.value, false, true)
    }
  }
  deleteRowActivity(roleIdx: number, activityIdx: number) {
    const roleGrp = this.groupList.at(roleIdx) as FormGroup
    const activitiesLst = roleGrp.get('activities') as FormArray
    activitiesLst.removeAt(activityIdx)
    this.watStore.setgetactivitiesGroup(this.groupList.value, false, true)
  }
  deleteSingleActivity(roleIdx: number, activityIdx: number) {
    if (roleIdx >= 0 && activityIdx >= 0) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          title: 'Delete activity?',
          body: '  The activity will be deleted from this work order',
          ok: 'Delete',
          cancel: 'Go back',
        },
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteRowActivity(roleIdx, activityIdx)
          this.snackBar.open('Activity deleted successfully!! ', undefined, { duration: 2000 })
        }
      })
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
  trackByFn(index: number, item: FormGroup) {
    if (index) { }
    return item.value.localId
  }
  getCompCount(roleName: string, localId: number, roleId: any) {
    let count = 0
    const values = this.watStore.getcompetencyGroupValue
    _.each(values, i => {
      if (i.roleName === roleName || i.localId === localId || i.roleId === roleId) {
        count += i.competincies.length
      }
    })
    return count
  }
  deleteGrp(grpidx: number) {
    if (!this.watStore.getOfficerId) {
      this.snackBar.open('Please save work order and open in edit mode !! ', undefined, { duration: 2000 })
      return
    }
    // this.snackBar.open('This feature will be available soon!! ', undefined, { duration: 2000 })
    if (grpidx >= 0) {
      const role = this.groupList.at(grpidx).value
      const countA = (this.groupList.at(grpidx).get('activities') as FormArray || []).length
      const countC = this.getCompCount(_.get(role, 'groupName'), _.get(role, 'localId'), _.get(role, 'roleId'))
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          title: 'Delete role?',
          body: `  <div>Deleting this role will also delete the following
                      <br>
                     <ul><li>Associated activities (${countA})</li><li>Associated competencies (${countC})</li></ul>
            <div class="custom-delete">
              <span>
               To keep the activities/competencies, 'Go back' and move them to the unmapped activities/competencies before
              </span>
             </div>
            </div>`,
          cancel: 'Go back',
          ok: 'Delete',
        },
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.snackBar.open('This feature will be available soon!! ', undefined, { duration: 2000 })
          (this.activityForm.controls['groupsArray'] as FormArray).removeAt(grpidx)
          this.changeDetector.detectChanges()
          this.watStore.setgetactivitiesGroup(this.groupList.value, true, true)
          this.snackBar.open('Role removed successfully, Please sit back, Page will reload.!! ', undefined, { duration: 2000 })
        }
      })
    }
  }
}
