import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
// tslint:disable
import _ from 'lodash'
// tslint:enable
import { NSWatCompetency } from '../../models/competency-wat.model'
import { WatStoreService } from '../../services/wat.store.service'

@Component({
  selector: 'ws-app-comp-details',
  templateUrl: './comp-details.component.html',
  styleUrls: ['./comp-details.component.scss'],
  // tslint:disable
  encapsulation: ViewEncapsulation.None,
  // tslint:enable
})
export class CompDetailsComponent implements OnInit, OnDestroy {
  dataStructure: NSWatCompetency.ICompActivity[] = []
  groupSubscription: any
  compDetailForm!: FormGroup
  subscribeForm: any
  levelLest = ['Basic', 'Proficient', 'Advanced', 'Expert', 'Ustad']
  compTypList = ['Behavioural', 'Domain', 'Functional']
  constructor(private watStore: WatStoreService, private formBuilder: FormBuilder, activated: ActivatedRoute) {
    this.generateForm()
    this.levelLest = activated.snapshot.data.pageData.data.levels
    this.compTypList = activated.snapshot.data.pageData.data.compTypes
  }
  ngOnInit() {
    this.fetchData()
    this.subscribeForm = this.compDetailForm.valueChanges.subscribe(val => {
      if (val) {
        this.watStore.updateCompGroup(_.get(val, 'competencyList'), false, true)
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
        const lst = _.map(_.get(this.dataStructure[index], 'levelList') || [], r => {
          return { alias: r.alias, level: r.level }
        })
        // debugger
        const fg = this.formBuilder.group({
          localId: this.dataStructure[index].localId,
          compId: this.dataStructure[index].compId,
          compName: new FormControl({ value: this.dataStructure[index].compName, disabled: true }),
          compDescription: this.dataStructure[index].compDescription,
          compLevel: new FormControl({ value: this.dataStructure[index].compLevel, disabled: false }),
          compType: this.dataStructure[index].compType,
          compArea: this.dataStructure[index].compArea,
          compSource: this.dataStructure[index].compSource,
          levelList: lst && lst.length > 0 ? [lst] : [this.levelLest],
        })
        oldValue.push(fg)
      }
    }
    this.setCompValues([...oldValue.value])
    // to show hide Role name
  }
  getLocalPrint(data: string) {
    return `<ul>${(_.compact(data.split('• '))
      .map(i => { if (i) { return `<li>${i}</li>` } return null })).join('')}</ul>`
  }
  log(a: any) {
    // tslint:disable-next-line
    console.log(a)
  }
}
