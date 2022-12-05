import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material'

@Component({
  selector: 'ws-app-add-batch-dialouge',
  templateUrl: './add-batch-dialouge.component.html',
  styleUrls: ['./add-batch-dialouge.component.scss'],
})
export class AddBatchDialougeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddBatchDialougeComponent>) { }

  ngOnInit() {
  }

  closeDialouge(): void {
    this.dialogRef.close()
  }

}
