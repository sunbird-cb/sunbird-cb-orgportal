import { Component, OnInit, Inject, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { FormGroup } from '@angular/forms'
import { UploadFileService } from '../../services/uploadfile.service'
import { ConfigurationsService } from '@sunbird-cb/utils'
@Component({
  selector: 'ws-app-publish-popup',
  templateUrl: './publish-popup.component.html',
  styleUrls: ['./publish-popup.component.scss'],
})
export class PublishPopupComponent implements OnInit {
  @ViewChild('file', { static: false }) file: any
  public files: Set<File> = new Set()
  progress: any
  uploading = false
  uploadSuccessful = false
  workorderData: any
  fileInfo: any
  form!: FormGroup
  userData: any
  uploadedFile: any
  comparePDF = false
  signedPDF: any
  draftPDF: any

  constructor(private uploadService: UploadFileService, private router: Router,
    // tslint:disable-next-line:align
    private dialogRef: MatDialogRef<PublishPopupComponent>,
    // tslint:disable-next-line:align
    private configSvc: ConfigurationsService,
    // tslint:disable-next-line:align
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.workorderData = data.data

    this.uploadService.getProfile().subscribe((userdata: any) => {
      this.userData = userdata.result.response
    })
  }

  ngOnInit() { }

  addFiles() {
    this.file.nativeElement.click()
  }

  onFilesAdded(files: any) {
    this.uploading = true
    const fileList = (<HTMLInputElement>files.target).files
    if (fileList && fileList.length > 0) {
      const file: File = fileList[0]
      this.uploadedFile = file
      this.closeDialog()
    }
  }

  closeDialog() {
    const username = `${this.userData.firstName} ${this.userData.lastName}`
    const org = []
    const createdforarray: any[] = []
    if (this.configSvc.userProfile) {
      createdforarray.push(this.configSvc.userProfile.rootOrgId)
      org.push(this.configSvc.userProfile.departmentName)
    }

    const request = {
      request: {
        content: {
          name: 'PDF Asset',
          creator: username,
          createdBy: this.userData.id,
          code: 'pdf asset',
          mimeType: 'application/pdf',
          contentType: 'Asset',
          primaryCategory: 'Asset',
          organisation: org,
          createdFor: createdforarray,
        },
      },
    }
    // start the upload and save the progress map
    this.progress = this.uploadService.crreateAsset(request).subscribe((res: any) => {
      const contentID = res.result.identifier
      const formData: FormData = new FormData()
      formData.append('data', this.uploadedFile)

      this.uploadService.uploadFile(contentID, formData).subscribe((fdata: any) => {
        const artifactUrl = fdata.result.artifactUrl
        this.workorderData.signedPdfLink = artifactUrl
        // this.workorderData.publishedPdfLink = artifactUrl
        const req = this.workorderData

        this.uploadService.updateWorkOrder(req).subscribe((fres: any) => {
          if (fres.result.message === 'Successful') {
            this.uploading = false
          }
        })
      })
    })
    // tslint:disable-next-line:forin
    // for (const key in this.progress) {
    //   this.progress[key].progress.subscribe((val: any) => console.log(val))
    // }
  }

  compareFiles() {
    this.uploadService.getDraftPDF(this.workorderData.id).subscribe((fileurl: any) => {
      this.comparePDF = true
      const file = new Blob([fileurl], { type: 'application/pdf' })
      const fileURL = URL.createObjectURL(file)
      this.signedPDF = this.workorderData.signedPdfLink
      this.draftPDF = fileURL
    })
  }

  publishOrder() {
    this.comparePDF = false
    this.uploading = false
    this.uploadedFile = ''
    this.uploadSuccessful = true
    this.workorderData.status = 'Published'
    const req = this.workorderData

    this.uploadService.updateWorkOrder(req).subscribe((fres: any) => {
      if (fres) {
        this.uploadSuccessful = true
      }
    })
  }

  dismiss() {
    this.dialogRef.close()
    this.router.navigate([`/app/home/workallocation`, { tab: 'Published' }])
  }

  reupload() {
    this.comparePDF = false
    this.uploadedFile = ''
    this.uploading = false
    this.uploadSuccessful = false
  }
}
