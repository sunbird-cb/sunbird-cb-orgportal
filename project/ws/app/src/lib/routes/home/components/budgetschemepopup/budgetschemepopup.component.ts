import { Component, OnInit, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'ws-app-budgetschemepopup',
  templateUrl: './budgetschemepopup.component.html',
  styleUrls: ['./budgetschemepopup.component.scss'],
})
export class BudgetschemepopupComponent implements OnInit {
  schemeform: FormGroup
  formInputData: any
  yearsList = ['2020-2021' , '2021-2022']

  constructor(private dialogRef: MatDialogRef<BudgetschemepopupComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.schemeform = new FormGroup({
      budgetyear: new FormControl('', [Validators.required]),
      schemename: new FormControl('', [Validators.required]),
      budgetallocated: new FormControl('', [Validators.required]),
      budgetutilized: new FormControl('', [Validators.required]),
    })

    if (data.data) {
      this.formInputData = data.data
      console.log('formInputData', this.formInputData)
      this.schemeform.controls['budgetyear'].setValue(this.formInputData.budgetyear)
      this.schemeform.controls['schemename'].setValue(this.formInputData.schemename)
      this.schemeform.controls['budgetallocated'].setValue(this.formInputData.trainingBudgetAllocated)
      this.schemeform.controls['budgetutilized'].setValue(this.formInputData.trainingBudgetUtilization)
    }
  }

  ngOnInit() {
  }

  addsheme(form: any) {
    console.log('form value', form.value)
    if (this.formInputData) {
      this.formInputData.budgetyear = this.schemeform.value.budgetyear
      this.formInputData.schemename = this.schemeform.value.schemename
      this.formInputData.trainingBudgetAllocated = this.schemeform.value.budgetallocated
      this.formInputData.trainingBudgetUtilization = this.schemeform.value.budgetutilized
      this.dialogRef.close({ data: this.formInputData })
    } else {
      this.dialogRef.close({ data: form.value })
    }
    this.dialogRef.close({ data: form.value })
  }

}
