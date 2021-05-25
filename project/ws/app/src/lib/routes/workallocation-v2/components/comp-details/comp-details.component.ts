import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
// tslint:disable
import _ from 'lodash'
// tslint:enable
import { NSWatCompetency } from '../../models/competency-wat.model'
import { WatStoreService } from '../../services/wat.store.service'

@Component({
  selector: 'ws-app-comp-details',
  templateUrl: './comp-details.component.html',
  styleUrls: ['./comp-details.component.scss'],
})
export class CompDetailsComponent implements OnInit, OnDestroy {
  dataStructure: NSWatCompetency.ICompActivity[] = []
  groupSubscription: any
  compDetailForm!: FormGroup
  subscribeForm: any
  levelLest = ['Basic', 'Proficient', 'Advanced', 'Expert', 'Ustad']
  compTypList = ['Behavioural', 'Domain', 'Functional']
  constructor(private watStore: WatStoreService, private formBuilder: FormBuilder) {
    this.generateForm()
  }
  ngOnInit() {
    this.fetchData()
    this.subscribeForm = this.compDetailForm.valueChanges.subscribe(val => {
      if (val) {
        this.watStore.setCompGroup(val)
      }
    })
  }
  ngOnDestroy(): void {
    this.groupSubscription.unsubscribe()
    this.subscribeForm.unsubscribe()
  }
  fetchData() {
    this.groupSubscription = this.watStore.get_compGrp.subscribe(comp => {
      if (comp.length > 0) {
        this.dataStructure = comp
        this.updateForm()
      }
    })
  }
  get compList(): FormArray {
    return this.compDetailForm.get('competencyList') as FormArray
  }
  setCompValues(val: any) {
    this.compList.patchValue(val)
  }
  generateForm() {
    this.compDetailForm = this.formBuilder.group({
      competencyList: this.formBuilder.array([]),
    })
  }
  updateForm() {
    this.compList.clear()
    const oldValue = this.compList
    for (let index = 0; index < this.dataStructure.length; index += 1) {
      if (this.dataStructure && this.dataStructure[index] && this.dataStructure[index].compName) {
        const fg = this.formBuilder.group({
          compName: this.dataStructure[index].compName,
          compDescription: this.dataStructure[index].compDescription,
          compLevel: this.dataStructure[index].compLevel,
          compType: this.dataStructure[index].compType,
          compArea: this.dataStructure[index].compArea,
        })
        oldValue.push(fg)
      }
    }
    this.setCompValues([...oldValue.value])
    // to show hide Role name
  }
}
