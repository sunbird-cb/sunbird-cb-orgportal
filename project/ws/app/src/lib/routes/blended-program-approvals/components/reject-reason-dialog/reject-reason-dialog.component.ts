import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'

@Component({
  selector: 'ws-app-reject-reason-dialog',
  templateUrl: './reject-reason-dialog.component.html',
  styleUrls: ['./reject-reason-dialog.component.scss'],
})
export class RejectReasonDialogComponent implements OnInit {

  reasonForm!: FormGroup
  constructor(public dialogRef: MatDialogRef<RejectReasonDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.reasonForm = new FormGroup({
      reason: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    // console.log('this.reasonForm.value', this.reasonForm.value)
    this.dialogRef.close(this.reasonForm.value)
  }

}
