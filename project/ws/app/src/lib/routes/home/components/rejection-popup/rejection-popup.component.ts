import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-rejection-popup',
  templateUrl: './rejection-popup.component.html',
  styleUrls: ['./rejection-popup.component.scss'],
})
export class RejectionPopupComponent implements OnInit {

  rejectionsDetails: any
  reason: FormControl = new FormControl(null, [Validators.required, Validators.maxLength(100)])

  constructor(
    private dialogRef: MatDialogRef<RejectionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.rejectionsDetails = data
  }

  ngOnInit() {
    this.intialisation()
  }

  intialisation() {
    this.reason.setValue(_.get(this.rejectionsDetails, 'body.reason'))
  }

  editReason() {
    this.rejectionsDetails['header']['showEditButton'] = false
    this.rejectionsDetails['body']['showTextArea'] = true
    this.rejectionsDetails['footer']['showFooter'] = true
  }

  onButtonClick(btnDetails: any) {
    const responce = {
      btnResponse: btnDetails.response,
      reason: this.reason.value,
    }
    if (btnDetails.btnType === 'cancel' || this.reason.valid) {
      this.dialogRef.close(responce)
    }
  }

}
