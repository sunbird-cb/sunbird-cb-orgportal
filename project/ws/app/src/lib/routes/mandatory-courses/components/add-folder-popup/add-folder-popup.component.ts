import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { FormBuilder, FormGroup } from '@angular/forms'


@Component({
  selector: 'ws-app-add-folder-popup',
  templateUrl: './add-folder-popup.component.html',
  styleUrls: ['./add-folder-popup.component.scss']
})
export class AddFolderPopupComponent implements OnInit {
  addFolderForm: FormGroup

  constructor(public dialogRef: MatDialogRef<AddFolderPopupComponent>, private fb: FormBuilder) {
    this.addFolderForm = this.fb.group({
      folderName: [''],

    })
  }

  ngOnInit() {  
  }


  closeDialouge(): void {
    this.dialogRef.close()
  }

  addFolder() {

  }

}
