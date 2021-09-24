import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material'
import { MdoInfoService } from '../../services/mdoinfo.service'

@Component({
  selector: 'ws-app-staffdetailspopup',
  templateUrl: './staffdetailspopup.component.html',
  styleUrls: ['./staffdetailspopup.component.scss']
})
export class StaffdetailspopupComponent implements OnInit {
  staffform: FormGroup
  designationsMeta: any = []

  constructor(private dialogRef: MatDialogRef<StaffdetailspopupComponent>,
              private mdoinfoSrvc: MdoInfoService) {
    this.staffform = new FormGroup({
      designation: new FormControl('', [Validators.required]),
      posfilled: new FormControl('', [Validators.required]),
      posvacant: new FormControl('', [Validators.required]),
    })
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
    console.log('form value', form.value)
    this.dialogRef.close({ data: form.value })
  }

  otherDropDownChange(value: any, field: string) {
    if (field === 'designation' && value !== 'Other') {
      // this.staffform.controls['designation'].setValue('')
    }
  }

}
