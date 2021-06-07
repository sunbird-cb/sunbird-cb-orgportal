import { Component, Inject, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { MatCheckboxChange } from '@angular/material'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import * as _ from 'lodash'

export interface IWatRolePopupData {
  childNodes: IChield[],
  description: string,
  id: string,
  name: string,
  source: string,
  status: string,
  type: string,
}
export interface IChield {
  isSelected: boolean
  description: string
  id: string
  name: string
  parentRole?: any
  source: string
  status: string
  type: string
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'ws-app-wat-role-popup',
  templateUrl: './wat-role-popup.component.html',
  styleUrls: ['./wat-role-popup.component.scss'],
})
export class WatRolePopupComponent implements OnInit {
  isChecked = true
  isCheckedAllA = true
  watForm!: FormGroup
  constructor(
    public dialogRef: MatDialogRef<WatRolePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IWatRolePopupData,
    private formBuilder: FormBuilder) {
    this.watForm = new FormGroup({})
    this.watForm = this.formBuilder.group({
      acDetail: this.formBuilder.array([]),
      IsRoleSelected: new FormControl(true, []),
    })

  }
  get getList() {
    return this.watForm.get('acDetail') as FormArray
  }
  setWatValues(val: any) {
    this.watForm.patchValue(val)
  }
  ngOnInit(): void {
    if (this.data.childNodes) {
      const oldValue = this.getList
      _.each(this.data.childNodes, itm => {
        oldValue.push(this.createItem(itm))
      })
      this.setWatValues([...oldValue.value])

    }
  }
  createItem(itm: IChield): import('@angular/forms').AbstractControl {
    const ctrl = this.formBuilder.group({
      isSelected: itm.description ? true : false,
      description: itm.description,
      id: itm.id,
      name: itm.name,
      parentRole: itm.parentRole,
      source: itm.source,
      status: itm.status,
      type: itm.type,
    })
    return ctrl
  }

  onNoClick(): void {
    this.dialogRef.close({
      ok: false,
    })
  }
  onOkClick(): void {

  }
  onChange($event: any) {
    if ($event) {
      $event.preventDefault()
      this.isChecked = true
    }
  }
  onChangeAllAct($event: MatCheckboxChange) {
    if ($event) {
      if ($event.checked) {
        this.checkAll()
      } else {
        this.deselectAll()
      }
    }
  }
  checkAll() {
    const onj = { isSelected: true }
    this.getList.controls.map(value => value.setValue({ ...value.value, ...onj }))
  }

  deselectAll() {
    const onj = { isSelected: false }
    this.getList.controls.map(value => value.setValue({ ...value.value, ...onj }))
    // this.setWatValues([...this.getList.controls.map(value => value.setValue(false))])
  }
  get checkedAllActivities() {
    return ((_.filter(this.getList.value, (i: IChield) => !i.isSelected) || []).length === 0)
  }
  submitResult(val: any) {
    if (val) {
      this.dialogRef.close({
        ok: true,
        data: this.generateData(val),
      })
    }
  }
  generateData(val: any) {
    return _.map(_.filter(val.acDetail, (vall: IChield) => vall.isSelected), val1 => {
      return {
        // description: "Work relating to financial inclusion"
        activityId: _.get(val1, 'id'),
        activityName: _.get(val1, 'name'),
        activityDescription: _.get(val1, 'description'),
        assignedTo: '',
        // isSelected: undefined
        // name: "Work relating to financial inclusion"
        // parentRole: "RID003"
        // source: "ISTM"
        // status: "UNVERIFIED"
        // type: "ACTIVITY"
      }
    })
  }
}
