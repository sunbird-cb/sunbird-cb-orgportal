import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material'

@Component({
  selector: 'ws-app-budgetschemepopup',
  templateUrl: './budgetschemepopup.component.html',
  styleUrls: ['./budgetschemepopup.component.scss'],
})
export class BudgetschemepopupComponent implements OnInit {
  schemeform: FormGroup

  constructor(private dialogRef: MatDialogRef<BudgetschemepopupComponent>) {
    this.schemeform = new FormGroup({
      schemename: new FormControl('', [Validators.required]),
      budgetallocated: new FormControl('', [Validators.required]),
      budgetutilized: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
  }

  addsheme(form: any) {
    console.log('form value', form.value)
    this.dialogRef.close({ data: form.value })
  }

}
