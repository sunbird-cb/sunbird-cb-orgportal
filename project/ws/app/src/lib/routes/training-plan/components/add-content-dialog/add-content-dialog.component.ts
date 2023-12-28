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
  seletedCompetencyTheme: any
  seletedCompetencySubTheme: any
  providersList: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddContentDialogComponent>,
    private trainingplanSvc: TrainingPlanService
  ) {
    this.contentForm = new FormGroup({
      competencyArea: new FormControl('', Validators.required),
      provider: new FormControl('', Validators.required),
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
    })
  }

  compAreaSelected(option: any) {
    this.resetCompSubfields()
    this.allCompetencies.forEach((val: any) => {
      if (option.name === val.name) {
        this.seletedCompetencyArea = val
        this.allCompetencyTheme = val.children
      }
    })
  }

  compThemeSelected(option: any) {
    this.enableCompetencyAdd = false
    this.allCompetencyTheme.forEach((val: any) => {
      if (option.name === val.name) {
        this.seletedCompetencyTheme = val
        this.allCompetencySubtheme = val.children
      }
    })
  }

  compSubThemeSelected(option: any) {
    this.enableCompetencyAdd = true
    this.allCompetencySubtheme.forEach((val: any) => {
      if (option.name === val.name) {
        this.seletedCompetencySubTheme = val
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
    this.seletedCompetencyTheme = ''
    this.seletedCompetencySubTheme = ''
  }

  providerSelected(option: any) {
    console.log(option)
  }

  submit() {
    console.log('submit -----------', this.contentForm.value)
    if (this.contentForm && this.contentForm.valid) {
      const req = {
        competencyArea: this.seletedCompetencyArea.name,
        competencyAreaId: this.seletedCompetencyArea.id,
        competencyTheme: this.seletedCompetencyTheme.name,
        competencyThemeId: this.seletedCompetencyTheme.id,
        competencySubTheme: this.seletedCompetencySubTheme.name,
        competencySubThemeId: this.seletedCompetencySubTheme.id,
        listOfProviders: this.contentForm.value.provider,
        descriptionOfTheContent: this.contentForm.value.contentdescription || ''
      }
      console.log('req', req)
    }

  }
}
