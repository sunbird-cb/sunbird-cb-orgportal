import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { NSWat } from './activity-wot.model'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { debounceTime } from 'rxjs/operators'


@Component({
  selector: 'ws-app-activity-labels',
  templateUrl: './activity-labels.component.html',
  styleUrls: ['./activity-labels.component.scss'],
})
export class ActivityLabelsComponent implements OnInit, OnDestroy, AfterViewInit {
  labels: NSWat.IActivity[] = [];
  groups: NSWat.IActivityGroup[] = [];
  activeGroupIdx = 0
  untitedRole = 'Untited role'
  activityForm!: FormGroup
  constructor(
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {

  }
  ngOnInit(): void {
    this.activityForm = new FormGroup({})
    this.createForm()
  }
  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
  }
  drop(event: CdkDragDrop<NSWat.IActivity[]>) {
    if (event.previousContainer === event.container) {
      // moveItemInArray(this.activityForm.controls.labelsArray.controls, event.previousIndex, event.currentIndex)
      // moveItemInArray(this.activityForm.controls.labelsArray.value, event.previousIndex, event.currentIndex)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex)
    }
  }
  dropgroup(event: CdkDragDrop<NSWat.IActivity[]>) {
    if (event.previousContainer === event.container) {
      // moveItemInArray(this.activityForm.controls.labelsArray.controls, event.previousIndex, event.currentIndex)
      // moveItemInArray(this.activityForm.controls.labelsArray.value, event.previousIndex, event.currentIndex)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex)
    }
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  evenPredicate(item: CdkDrag<NSWat.IActivity>) {
    // return item.data % 2 === 0
    if (item) {
      return true
    }
    return false
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return true
  }
  log(value: any) {
    console.log(value)
  }
  get labelsList(): FormArray {
    return this.activityForm.get('labelsArray') as FormArray
  }
  setlabelsValues(val: any) {
    this.labelsList.patchValue(val)
  }
  addNewLabel() {
    // if (this.activityForm.get('labelsArray') != null) {
    const oldValue = this.labelsList
    let fg = this.formBuilder.group({
      activityName: 'unmed',
      activityDescription: 'desc',
      assignedTo: ''
    })

    oldValue.push(fg)
    this.setlabelsValues([...oldValue.value])
    // this.changeDetector.detectChanges()

  }
  addNewGroup() {
    this.groups.push({
      activities: [],
      groupDescription: '',
      groupName: this.untitedRole
    })
  }
  addNewGroupActivity(index: number) {
    if (!this.groups[index]) {
      return
      // need to display tost
    }
    this.groups[index].activities.push({
      activityName: 'unmed',
      activityDescription: 'desc',
      assignedTo: ''
    })
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
    //   this.labels.forEach((v: NSWat.IActivity) => {
    //     if (v) {
    this.createActivityControl({
      activityName: 'unmed',
      activityDescription: 'desc',
      assignedTo: ''
    })
    //     }
    //   })
    // }
    // this.activityForm.valueChanges.pipe(debounceTime(100)).subscribe(() => {
    //   // this.value.emit(JSON.parse(JSON.stringify(this.qualityForm.value)))
    // })
  }
  createActivityControl(activityObj: NSWat.IActivity) {
    const newControl = this.formBuilder.group({
      activityName: new FormControl(activityObj.activityName),
      activityDescription: new FormControl(activityObj.activityDescription),
      assignedTo: new FormControl(activityObj.assignedTo),
    })
    const optionsArr = this.activityForm.controls['labelsArray'] as FormArray
    optionsArr.push(newControl)
  }
  createGroupControl(activityObj: NSWat.IActivityGroup) {
    const newControl = this.formBuilder.group({
      groupName: new FormControl(activityObj.groupName),
      groupDescription: new FormControl(activityObj.groupDescription),
      activities: this.createActivtyControl(activityObj.activities),
    })
    const optionsArr = this.activityForm.controls['groupsArray'] as FormArray
    optionsArr.push(newControl)
  }
  createActivtyControl(activityObj: NSWat.IActivity[]) {
    return activityObj.map((v: NSWat.IActivity) => {
      return this.formBuilder.group({
        activityName: new FormControl(v.activityName),
        activityDescription: new FormControl(v.activityDescription),
        assignedTo: new FormControl(v.assignedTo),
      })
    })
  }
  submitResult(qualityForm: any) {
    console.log(qualityForm)
  }
}
