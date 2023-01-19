import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material'
import { MandatoryCourseService } from '../../services/mandatory-course.service'

@Component({
  selector: 'ws-app-add-batch-dialouge',
  templateUrl: './add-batch-dialouge.component.html',
  styleUrls: ['./add-batch-dialouge.component.scss'],
})
export class AddBatchDialougeComponent implements OnInit {

  addBatchForm: FormGroup
  todayDate: Date = new Date()
  endDateStart = this.todayDate
  constructor(public dialogRef: MatDialogRef<AddBatchDialougeComponent>, private fb: FormBuilder,
              private mandatoryService: MandatoryCourseService, @Inject(MAT_DIALOG_DATA) public data: { batchInfo: any },
              private snackBar: MatSnackBar) {

    this.addBatchForm = this.fb.group({
      batchTitle: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.initBatchForm()
  }

  closeDialouge(): void {
    this.dialogRef.close()
  }
  onChangeStartDate() {
    this.endDateStart = this.addBatchForm.value.startDate
  }

  initBatchForm() {
    if (!this.data.batchInfo.batchId) {
      return
    }
    this.addBatchForm.controls.batchTitle.setValue(this.data.batchInfo.name)
    this.addBatchForm.controls.startDate.setValue(new Date(this.data.batchInfo.startDate))
    this.addBatchForm.controls.endDate.setValue(new Date(this.data.batchInfo.endDate))
  }
  addBatch() {
    if (this.addBatchForm.valid) {
      const requestParams = {
        request: {
          courseId: this.data.batchInfo,
          name: this.addBatchForm.value.batchTitle,
          description: '',
          enrollmentType: 'invite-only',
          startDate: this.addBatchForm.value.startDate.toISOString().slice(0, 10),
          endDate: this.addBatchForm.value.endDate.toISOString().slice(0, 10),
          enrollmentEndDate: this.addBatchForm.value.endDate.toISOString().slice(0, 10),
        },
      }
      if (!this.data.batchInfo.batchId) {
        this.mandatoryService.addBatch(requestParams).subscribe(() => {
          this.snackBar.open(`${requestParams.request.name} created successfully`, 'Close', { verticalPosition: 'top' })
          this.closeDialouge()
        },                                                      () => {
          this.snackBar.open('Please publish the goal to create batch', 'Close', { verticalPosition: 'top' })
        })
      } else {
        this.mandatoryService.updateBatch(requestParams, this.data.batchInfo.batchId).subscribe(() => {
          this.snackBar.open(`${requestParams.request.name} updated successfully`, 'Close', { verticalPosition: 'top' })
          this.closeDialouge()
        })
      }
    }
  }

}
