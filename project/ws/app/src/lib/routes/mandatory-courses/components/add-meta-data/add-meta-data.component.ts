import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'ws-app-add-meta-data',
  templateUrl: './add-meta-data.component.html',
  styleUrls: ['./add-meta-data.component.scss'],
})
export class AddMetaDataComponent implements OnInit {
  mataDataForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.mataDataForm = this.fb.group({
      title: ['',],
      subtitle: [''],
      description: [''],
    })
  }

  ngOnInit() {
  }

}
