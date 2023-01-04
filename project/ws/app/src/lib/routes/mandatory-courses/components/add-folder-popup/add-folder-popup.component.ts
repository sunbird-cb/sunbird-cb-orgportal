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
  pageData: any
  constructor(public dialogRef: MatDialogRef<AddFolderPopupComponent>, private fb: FormBuilder,
              private router: Router, private mandatoryCourseService: MandatoryCourseService) {
    this.addFolderForm = this.fb.group({
      folderName: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.pageData = this.mandatoryCourseService.getPageData()
  }

  closeDialouge(): void {
    this.dialogRef.close()
  }

  addFolder() {
    if (this.addFolderForm.valid) {
      this.closeDialouge()
      const metaData = {
        name: this.addFolderForm.value.folderName,
        ...this.pageData.folder,
      }
      this.mandatoryCourseService.createContent(metaData).subscribe(res => {
        this.router.navigateByUrl(`/app/mandatory-courses/${res}`)
      })
    }
  }

}
