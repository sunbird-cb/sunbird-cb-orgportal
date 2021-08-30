import { Component, Inject, Input, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatCheckboxChange, MatRadioChange } from '@angular/material'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */

export interface IWatCompPopupData {
  level?: string
  children: IChield[]
  description: string
  id: string
  name: string
  area: string
  source: string
  status: string
  type: string
}
export interface IChield {
  isSelected: boolean
  description: string
  id: string
  name: string
  level: string
  alias: string[]
  // parentRole?: any
  source: string
  status: string
  type: string
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'ws-app-wat-comp-popup',
  templateUrl: './wat-comp-popup.component.html',
  styleUrls: ['./wat-comp-popup.component.scss'],
})
export class WatCompPopupComponent implements OnInit {
  isChecked = true
  isCheckedAllA = true
  watForm!: FormGroup
  isNew = false
  selectedLevel = ''
  compTypList!: string[]
  @Input() defaultCompLevels!: any
  constructor(
    public dialogRef: MatDialogRef<WatCompPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IWatCompPopupData,
    private formBuilder: FormBuilder) {
    this.watForm = new FormGroup({})

    this.watForm = this.formBuilder.group({
      compName: new FormControl(data.name, [Validators.required]),
      compDescription: new FormControl(data.description, [Validators.required]),
      compId: new FormControl(data.id, []),
      compType: new FormControl(data.type, []),
      compArea: new FormControl(data.area, []),
      compSource: new FormControl(data.source, []),
      acDetail: this.formBuilder.array([]),
      IsRoleSelected: new FormControl(true, []),
    })
    this.selectedLevel = data.level || ''
  }
  get getList() {
    return this.watForm.get('acDetail') as FormArray
  }
  setWatValues(val: any) {
    this.watForm.patchValue(val)
  }
  ngOnInit(): void {
    if (this.defaultCompLevels.data && this.defaultCompLevels.data.compTypes) {
      this.compTypList = this.defaultCompLevels.data.compTypes
    }
    if (!!!this.data.id) {
      this.isNew = true
    }
    const oldValue = this.getList
    if (this.data.children && this.data.children.length > 0) {
      _.each(this.data.children, itm => {
        oldValue.push(this.createItem(itm))
      })
      this.setWatValues([...oldValue.value])

    } else {
      if (this.defaultCompLevels && this.defaultCompLevels.data && this.defaultCompLevels.data.levels) {
        for (let i = 0; i < this.defaultCompLevels.data.levels.length; i += 1) {
          const defObj = this.defaultCompLevels.data.levels[i] as IChield
          oldValue.push(this.createItem({
            description: defObj.description,
            id: defObj.id || '',
            alias: defObj.alias,
            isSelected: false,
            level: defObj.level,
            name: defObj.name,
            source: defObj.source,
            status: defObj.status,
            type: defObj.type,
          }))
        }
        this.setWatValues([...oldValue.value])
      }
    }
  }
  createItem(itm: IChield): import('@angular/forms').AbstractControl {
    const ctrl = this.formBuilder.group({
      isSelected: false,
      description: itm.description,
      id: itm.id,
      name: itm.name,
      level: itm.level,
      alias: itm.alias,
      // parentRole: itm.parentRole,
      source: itm.source,
      status: itm.status,
      type: itm.type,
    })
    return ctrl
  }
  radioChange(event: MatRadioChange) {
    this.selectedLevel = event.value
  }
  onNoClick(): void {
    this.dialogRef.close({
      ok: false,
      data: this.data,
    })
  }
  onOkClick(): void {

  }
  getLocalPrint(data: string) {
    return `<ul>${(_.compact(data.split('\n'))
      .map(i => { if (i) { return `<li>${i}</li>` } return null })).join('')}</ul>`
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
    return {
      // description: "Work relating to financial inclusion"
      // assignedTo: '',
      compId: _.get(val, 'compId'),
      compName: _.get(val, 'compName'),
      compDescription: _.get(val, 'compDescription'),
      compLevel: this.selectedLevel,
      compType: _.get(val, 'compType'),
      compArea: _.get(val, 'compArea'),
      localId: _.get(this.data, 'localId'),
      levelList: _.get(this.data, 'children'),
      compSource: _.get(val, 'compSource') || _.get(val, 'source'),
      // type: _.get(val, 'type'),
      // isSelected: undefined
      // name: "Work relating to financial inclusion"
      // parentRole: "RID003"
      // source: "ISTM"
      // status: "UNVERIFIED"
      // type: "ACTIVITY"acDetail
    }

  }
}
