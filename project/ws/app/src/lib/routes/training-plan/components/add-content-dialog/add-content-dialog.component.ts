import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { TrainingPlanService } from '../../services/traininig-plan.service'
@Component({
  selector: 'ws-app-add-content-dialog',
  templateUrl: './add-content-dialog.component.html',
  styleUrls: ['./add-content-dialog.component.scss'],
})
export class AddContentDialogComponent implements OnInit {
  contentForm!: FormGroup
  specialCharList = `( a-z/A-Z , 0-9 . - _ $ / \ : [ ]' ' !)`
  filteredCompetencies!: any[]
  allCompetencies: any = []
  allCompetencyTheme: any = []
  filteredallCompetencyTheme: any = []
  allCompetencySubtheme: any = []
  filteredallCompetencySubtheme: any = []
  enableCompetencyAdd = false
  seletedCompetencyArea: any
  seletedCompetencyTheme: any = []
  seletedCompetencySubTheme: any = []
  providersList: any = []
  filteredProviders: any = []
  selectedValues = []

  checkedList: any = []
  currentSelected: any
  selectedProvidersList: any = []
  competencyObj: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddContentDialogComponent>,
    private trainingplanSvc: TrainingPlanService
  ) {
    this.contentForm = new FormGroup({
      competencyArea: new FormControl('', Validators.required),
      provider: new FormControl('', Validators.required),
      providerText: new FormControl(''),
      contentdescription: new FormControl('', Validators.required),
    })
    this.contentForm.markAsPristine()
  }

  ngOnInit() {
    this.getCompetencies()
    this.getProviders()
    this.contentForm.controls['providerText'].valueChanges.subscribe((newValue: any) => {
      this.filteredProviders = this.filterValues(newValue, this.providersList)
    })
  }

  filterValues(searchValue: string, array: any) {
    return array.filter((value: any) =>
      value.name.toLowerCase().includes(searchValue.toLowerCase()))
  }

  closeModal() {
    this.dialogRef.close()
  }

  getCompetencies() {
    const searchObj = {
      search: {
        type: 'Competency Area',
      },
      filter: {
        isDetail: true,
      },
    }
    this.trainingplanSvc.getFilterEntity(searchObj).subscribe((res: any) => {
      this.allCompetencies = res
    })
  }

  getProviders() {
    this.trainingplanSvc.getProviders().subscribe((res: any) => {
      this.providersList = res
      this.providersList.forEach((val: any) => {
        val.checked = false
      })
      this.filteredProviders = this.providersList
    })
  }

  compAreaSelected(option: any) {
    this.allCompetencyTheme = []
    this.resetCompSubfields()
    this.allCompetencies.forEach((val: any) => {
      if (option.name === val.name) {
        this.seletedCompetencyArea = val
        // this.allCompetencyTheme = val.children
        val.children.forEach((item: any) => {
          item.selected = false
          this.allCompetencyTheme.push(item)
        })
      }
    })
  }

  compThemeSelected(option: any) {
    this.enableCompetencyAdd = false
    const index = this.seletedCompetencyTheme.findIndex((object: any) => object.name === option.name)
    if (index === -1) {
      this.allCompetencyTheme.forEach((val: any) => {
        if (option.name === val.name) {
          val.selected = true
          this.seletedCompetencyTheme.push(val)
          // this.allCompetencySubtheme = val.children
          val.children.forEach((item: any) => {
            item.selected = false
            item.compThemeID = val.id
            this.allCompetencySubtheme.push(item)
          })
        }
      })
    } else {
      this.seletedCompetencyTheme[index].selected = false

      const id = this.seletedCompetencyTheme[index].id
      this.seletedCompetencyTheme.splice(index, 1)
      this.allCompetencySubtheme = this.allCompetencySubtheme.filter((item: any) => item.compThemeID !== id)
    }
  }

  compSubThemeSelected(option: any) {
    this.enableCompetencyAdd = true
    const index = this.seletedCompetencySubTheme.findIndex((object: any) => object.name === option.name)
    if (index === -1) {
      this.allCompetencySubtheme.forEach((val: any) => {
        if (option.name === val.name) {
          val.selected = true
          this.seletedCompetencySubTheme.push(val)
        }
      })
    } else {
      this.seletedCompetencySubTheme[index].selected = false
      this.seletedCompetencySubTheme.splice(index, 1)
    }
  }

  resetCompfields() {
    this.enableCompetencyAdd = false
    this.contentForm.reset()
    this.allCompetencyTheme = []
    this.allCompetencySubtheme = []
  }

  resetCompSubfields() {
    this.enableCompetencyAdd = false
    this.allCompetencySubtheme = []
    this.seletedCompetencyTheme = []
    this.seletedCompetencySubTheme = []
  }

  openedChange(e: any) {
    // Set search textbox value as empty while opening selectbox
    this.contentForm.controls['providerText'].patchValue('')
    // Focus to search textbox while clicking on selectbox
    if (e === true) {
      // this.contentForm.value.provider.focus()
    }
  }

  clearSearch(event: any) {
    event.stopPropagation()
    this.contentForm.controls['providerText'].patchValue('')
  }

  setSelectedValues() {
    if (this.contentForm.value.provider && this.contentForm.value.provider.length > 0) {
      this.contentForm.value.provider.forEach((e: any) => {
        if (this.contentForm.value.provider.indexOf(e) === -1) {
          this.contentForm.value.provider.push(e)
          this.selectedProvidersList.push(e)
        }
      })
    }
  }

  selectionChange(event: any, option: any) {
    if (event.isUserInput) {
      const index = this.selectedProvidersList.findIndex((object: any) => object.id === option.orgId)
      if (index === -1) {
        this.selectedProvidersList.push(option)
      } else {
        this.selectedProvidersList.splice(index, 1)
      }
      this.contentForm.value.provider = this.selectedProvidersList
    }
  }

  submit() {
    const providersIds: any[] = []
    this.selectedProvidersList.forEach((item: any) => {
      providersIds.push(item.orgId)
    })

    this.competencyObj = {
      id: this.seletedCompetencyArea.id,
      type: this.seletedCompetencyArea.type,
      name: this.seletedCompetencyArea.name,
      children: []
    }
    const compTheme: any[] = []
    this.seletedCompetencyTheme.forEach((item: any) => {
      const obj = {
        id: item.id,
        type: item.type,
        name: item.name,
        children: []
      }
      compTheme.push(obj)
    })
    this.competencyObj.children = compTheme

    this.competencyObj.children.forEach((item: any) => {
      this.seletedCompetencySubTheme.forEach((subitem: any) => {
        if (subitem.compThemeID === item.id) {
          const subobj = {
            id: subitem.id,
            type: subitem.type,
            name: subitem.name,
          }
          item.children.push(subobj)
        }
      })
    })

    if (this.contentForm && this.contentForm.valid) {
      const req = {
        request: {
          competency: this.competencyObj,
          providerList: providersIds,
          description: this.contentForm.value.contentdescription || '',
        }
      }
      this.trainingplanSvc.createNewContentrequest(req).subscribe((response: any) => {
        if (response) {
          this.dialogRef.close({ event: 'close', data: response })
        } else {
          this.closeModal()
        }
      })
    }
  }
}
