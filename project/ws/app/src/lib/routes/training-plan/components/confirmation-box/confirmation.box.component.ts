import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
@Component({
  selector: 'ws-app-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrls: ['./confirmation-box.component.scss'],
})
export class ConfirmationBoxComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmationBoxComponent>,
    private trainingPlanDataSharingService: TrainingPlanDataSharingService
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.dialogRef.close()
  }

  performAction(data: any) {
    if (data && data.type === 'conformation') {
      this.dialogRef.close('confirmed')
    } else {
      this.dialogRef.close()
      this.trainingPlanDataSharingService.trainingPlanCategoryChangeEvent.next(data)
    }
  }
}
