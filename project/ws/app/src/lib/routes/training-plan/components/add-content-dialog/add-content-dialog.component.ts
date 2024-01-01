import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { TrainingPlanService } from '../../services/traininig-plan.service'
import { map, startWith } from 'rxjs/operators'
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddContentDialogComponent>,
    private trainingplanSvc: TrainingPlanService
  ) {
    this.contentForm = new FormGroup({
      competencyArea: new FormControl('', Validators.required),
      provider: new FormControl('', Validators.required),
      providerText: new FormControl('', Validators.required),
      contentdescription: new FormControl('', Validators.required),
    })
  }

  ngOnInit() {
    this.getCompetencies()
    this.getProviders()
    // this.contentForm = this.data.from
    // this.competencyArea.valueChanges.subscribe((newValue: any) => {
    //   if (newValue) {
    //     this.filteredallCompetencies = this.allCompetencies
    //   }
    // })
    // this.competencyTheme.valueChanges.subscribe((newValue: any) => {
    //   this.filteredallCompetencyTheme = this.filterValues(newValue, this.allCompetencyTheme)
    // })
    // this.competencySubtheme.valueChanges.subscribe((newValue: any) => {
    //   this.filteredallCompetencySubtheme = this.filterValues(newValue, this.allCompetencySubtheme)
    // })

    this.filteredProviders = this.contentForm.controls['providerText'].valueChanges
      .pipe(
        startWith<string>(''),
        map((name: any) => this.filter(name))
      )
  }

  filter(name: string): String[] {
    const filterValue = name.toLowerCase()
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues()
    this.contentForm.controls['provider'].patchValue(this.selectedValues)
    const filteredList = this.data.filter((option: any) => option.toLowerCase().indexOf(filterValue) === 0)
    return filteredList
  }

  filterValues(searchValue: string, array: any) {
    return array.filter((value: any) =>
      // value.name.toLowerCase().indexOf(searchValue.toLowerCase()) === 0)
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
    })
  }

  compAreaSelected(option: any) {
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
    this.allCompetencyTheme.forEach((val: any) => {
      if (option.name === val.name) {
        val.selected = true
        this.seletedCompetencyTheme.push(val)
        // this.allCompetencySubtheme = val.children
        val.children.forEach((item: any) => {
          item.selected = false
          this.allCompetencySubtheme.push(item)
        })
      }
    })
  }

  compSubThemeSelected(option: any) {
    this.enableCompetencyAdd = true
    this.allCompetencySubtheme.forEach((val: any) => {
      if (option.name === val.name) {
        val.selected = true
        this.seletedCompetencySubTheme.push(val)
      }
    })
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
    const themeNames: any[] = []
    const themeIds: any[] = []
    const subthemeNames: any[] = []
    const subthemeIds: any[] = []
    const providersIds: any[] = []
    this.seletedCompetencyTheme.forEach((item: any) => {
      themeNames.push(item.name)
      themeIds.push(item.id)
    })

    this.seletedCompetencySubTheme.forEach((item: any) => {
      subthemeNames.push(item.name)
      subthemeIds.push(item.id)
    })
    this.selectedProvidersList.forEach((item: any) => {
      providersIds.push(item.orgId)
    })
    if (this.contentForm && this.contentForm.value) {
      const req = {
        competencyArea: this.seletedCompetencyArea.name,
        competencyAreaId: this.seletedCompetencyArea.id,
        competencyTheme: themeNames,
        competencyThemeId: themeIds,
        competencySubTheme: subthemeNames,
        competencySubThemeId: subthemeIds,
        listOfProviders: providersIds,
        descriptionOfTheContent: this.contentForm.value.contentdescription || '',
      }
      this.trainingplanSvc.createNewContentrequest(req).subscribe((result: any) => {
      })
    }

  }
}
