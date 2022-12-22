import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MandatoryCourseService } from '../../services/mandatory-course.service'
@Component({
  selector: 'ws-app-add-folder-popup',
  templateUrl: './add-folder-popup.component.html',
  styleUrls: ['./add-folder-popup.component.scss'],
})
export class AddFolderPopupComponent implements OnInit {
  addFolderForm: FormGroup

  constructor(public dialogRef: MatDialogRef<AddFolderPopupComponent>, private fb: FormBuilder, private router: Router, private mandatoryCourseService: MandatoryCourseService) {
    this.addFolderForm = this.fb.group({
      folderName: ['', Validators.required]
    })
  }

  ngOnInit() { }

  closeDialouge(): void {
    this.dialogRef.close()
  }

  addFolder() {
    console.log(this.addFolderForm.value)
    if (this.addFolderForm.valid) {
      this.closeDialouge()
      this.mandatoryCourseService.createContent(this.addFolderForm.value.folderName).subscribe(res => {
        this.router.navigate([`/app/mandatory-courses/${res}}`])
      })
    }
  }

}
