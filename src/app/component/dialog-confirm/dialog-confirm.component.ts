import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

interface IPopData {
  title: string
  body: string
  cancel?: string
  ok?: string
}
@Component({
  selector: 'ws-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss'],
})
export class DialogConfirmComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IPopData,
    private dialogRef: MatDialogRef<DialogConfirmComponent>,
  ) {
    if (!data.ok) {
      data.ok = 'Yes'
    }
    if (!data.cancel) {
      data.cancel = 'No'
    }
  }

  confirmed() {
    this.dialogRef.close(true)
  }
}
