import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'ws-auth-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {

  rejectComment = ''
  copyContentName = ''
  returnDataValue!: any
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

  getActionData() {
    if (this.data === 'rejectContent') {
      this.returnDataValue = {
        comment: this.rejectComment,
        action: true,
      }
    } else if (this.data === 'copyContent') {
      this.returnDataValue = {
        name: this.copyContentName,
      }
    } else {
      this.returnDataValue = true
    }
    return this.returnDataValue
  }

}
