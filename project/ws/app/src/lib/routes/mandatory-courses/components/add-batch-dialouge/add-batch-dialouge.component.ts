import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialogRef } from '@angular/material'

@Component({
  selector: 'ws-app-add-batch-dialouge',
  templateUrl: './add-batch-dialouge.component.html',
  styleUrls: ['./add-batch-dialouge.component.scss'],
})
export class AddBatchDialougeComponent implements OnInit {

  addBatchForm: FormGroup

  constructor(public dialogRef: MatDialogRef<AddBatchDialougeComponent>, private fb: FormBuilder) {
    this.addBatchForm = this.fb.group({
      batchTitle: [''],
      startDate: [''],
      endDate: [''],

    })
  }

  ngOnInit() {
  }

  closeDialouge(): void {
    this.dialogRef.close()
  }

  addBatch() {
    const batchVal = this.addBatchForm.value
    if (batchVal && batchVal.length) {
      this.closeDialouge()
    }
  }

}
