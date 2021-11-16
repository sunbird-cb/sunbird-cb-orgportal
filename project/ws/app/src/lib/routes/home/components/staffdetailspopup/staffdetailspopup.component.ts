import { Component, OnInit, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { MdoInfoService } from '../../services/mdoinfo.service'

@Component({
  selector: 'ws-app-staffdetailspopup',
  templateUrl: './staffdetailspopup.component.html',
  styleUrls: ['./staffdetailspopup.component.scss'],
})
export class StaffdetailspopupComponent implements OnInit {
  staffform: FormGroup
  designationsMeta: any = []
  formInputData: any

  constructor(private dialogRef: MatDialogRef<StaffdetailspopupComponent>, @Inject(MAT_DIALOG_DATA) data: any,
    // tslint:disable-next-line:align
    private mdoinfoSrvc: MdoInfoService) {
    this.staffform = new FormGroup({
      designation: new FormControl('', [Validators.required]),
      posfilled: new FormControl('', [Validators.required]),
      posvacant: new FormControl('', [Validators.required]),
    })

    if (data.data) {
      this.formInputData = data.data
      this.staffform.controls['designation'].setValue(this.formInputData.position)
      this.staffform.controls['posfilled'].setValue(this.formInputData.totalPositionsFilled)
      this.staffform.controls['posvacant'].setValue(this.formInputData.totalPositionsVacant)
    }
  }

  ngOnInit() {
    const desreq = {
      searches: [
        {
          type: 'POSITION',
          field: 'name',
          keyword: '',
        },
        {
          field: 'status',
          keyword: 'VERIFIED',
          type: 'POSITION',
        },
      ],
    }
    this.mdoinfoSrvc.getDesignations(desreq).subscribe(
      (data: any) => {
        this.designationsMeta = data.responseData
      },
      (_err: any) => {
      })
  }

  addstaffdetails(form: any) {
    if (this.formInputData) {
      this.formInputData.position = this.staffform.value.designation
      this.formInputData.totalPositionsFilled = this.staffform.value.posfilled
      this.formInputData.totalPositionsVacant = this.staffform.value.posvacant
      this.dialogRef.close({ data: this.formInputData })
    } else {
      this.dialogRef.close({ data: form.value })
    }
  }

  otherDropDownChange(value: any, field: string) {
    if (field === 'designation' && value !== 'Other') {
      // this.staffform.controls['designation'].setValue('')
    }
  }

}
