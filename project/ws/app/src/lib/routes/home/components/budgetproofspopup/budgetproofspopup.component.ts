import { Component, OnInit, Inject, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material'
import { UploadService } from '../../services/upload.service'
// import { Observable } from 'rxjs'
// import { HttpEventType, HttpResponse } from '@angular/common/http'
// import { ConfigurationsService } from '@sunbird-cb/utils'
import { SelectionModel } from '@angular/cdk/collections'

// tslint:disable-next-line:interface-name
export interface PeriodicElement {
  srno: number
  filename: string
  filetype: string
  filesize: string
  uploadedon: Date
  uploadstatus: number
}

@Component({
  selector: 'ws-app-budgetproofspopup',
  templateUrl: './budgetproofspopup.component.html',
  styleUrls: ['./budgetproofspopup.component.scss'],
})
export class BudgetproofspopupComponent implements OnInit {
  @ViewChild('file', { static: false }) file: any
  uploadedFilesAssets: PeriodicElement[] = []
  uploadform: FormGroup
  sectioname: any

  // selectedFiles!: FileList
  progressInfos: any[] = []
  // message: any

  // fileInfos?: Observable<any> = []

  public files: Set<File> = new Set()
  progress: any
  uploading = false
  uploadSuccessful = false
  uploadedFiles: any = []
  userData: any
  dataSource = new MatTableDataSource<PeriodicElement>(this.uploadedFilesAssets)
  selection = new SelectionModel<PeriodicElement>(true, [])

  constructor(
    private dialogRef: MatDialogRef<BudgetproofspopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private uploadService: UploadService,
  ) {
    this.sectioname = data.data
    this.uploadform = new FormGroup({
      files: new FormControl('', [Validators.required]),
    })

    this.uploadService.getProfile().subscribe((userdata: any) => {
      this.userData = userdata.result.response
    })
  }

  ngOnInit() {
    // this.fileInfos = this.uploadService.getFiles()
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear()
      return
    }

    this.selection.select(...this.dataSource.data)
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`
  }

  addFiles() {
    this.file.nativeElement.click()
  }

  onFilesAdded(files: any) {
    this.uploading = true
    const fileList = (<HTMLInputElement>files.target).files
    if (fileList && fileList.length > 0) {
      // console.log('fileList', fileList)
      // const file: File = fileList[0]
      // this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total)
      Array.from(fileList).forEach((file: any, index: any) => {
        this.uploadedFiles.push(file)
        // console.log('this.uploadedFiles', this.uploadedFiles)
        const currentDate = new Date()
        const tabinfo = {
          srno: index + 1,
          filename: file.name,
          filetype: file.type,
          filesize: file.size,
          uploadedon: currentDate,
          uploadstatus: 100,
        }
        // file.identifier = res.result.identifier
        this.uploadedFilesAssets.push(tabinfo)
        this.dataSource.data.push(tabinfo)
        // console.log('this.uploadedFilesAssets', this.uploadedFilesAssets)
        // this.uploadFilesList(file, index)
      })
    }
  }

  // uploadFilesList(file: any) {
  //   // this.dataSource.data = this.uploadedFilesAssets
  //   // console.log('this.dataSource', this.dataSource)
  //   // console.log('index', index)
  //   const username = `${this.userData.firstName} ${this.userData.lastName}`
  //   const org = []
  //   const createdforarray: any[] = []
  //   if (this.configSvc.userProfile) {
  //     createdforarray.push(this.configSvc.userProfile.rootOrgId)
  //     org.push(this.configSvc.userProfile.departmentName)
  //   }

  //   const request = {
  //     request: {
  //       content: {
  //         name: file.name,
  //         creator: username,
  //         createdBy: this.userData.id,
  //         code: file.type,
  //         mimeType: file.type,
  //         contentType: 'Asset',
  //         primaryCategory: 'Asset',
  //         organisation: org,
  //         createdFor: createdforarray,
  //       },
  //     },
  //   }
  //   // console.log('req', request)
  //   // start the upload and save the progress map
  //   this.progress = this.uploadService.crreateAsset(request).subscribe((res: any) => {
  //     if (event.type === HttpEventType.UploadProgress) {
  //       const progress = Math.round(100 * event.loaded / event.total)
  //       console.log(progress)
  //     } else if (event instanceof HttpResponse) {
  //     }
  //     const contentID = res.result.identifier
  //     const formData: FormData = new FormData()
  //     formData.append('data', this.uploadFiles)

  //     this.uploadService.uploadFile(contentID, formData).subscribe((fdata: any) => {
  //       const artifactUrl = fdata.result.artifactUrl
  //       this.workorderData.signedPdfLink = artifactUrl
  //       // this.workorderData.publishedPdfLink = artifactUrl
  //       const req = this.workorderData

  //       this.uploadService.updateWorkOrder(req).subscribe((fres: any) => {
  //         if (fres.result.message === 'Successful') {
  //           this.uploading = false
  //         }
  //       })
  //     })
  //   })
  // }

  addSelectedFiles(form: any) {
    // console.log('form value', form.value)
    this.dialogRef.close({ data: form.value })
  }

  // selectFiles(event: any) {
  //   this.progressInfos = []
  //   this.selectedFiles = event.target.files
  //   this.uploadFiles()
  // }

  // uploadFiles() {
  //   this.message = ''
  //   // tslint:disable-next-line:no-increment-decrement
  //   for (let i = 0; i < this.selectedFiles.length; i++) {
  //     this.upload(i, this.selectedFiles[i])
  //   }
  // }

  // upload(idx: any, file: any) {
  //   this.progressInfos[idx] = { value: 0, fileName: file.name }

  //   this.uploadService.upload(file).subscribe(
  //     (event: any) => {
  //       if (event.type === HttpEventType.UploadProgress) {
  //         this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total)
  //         console.log('this.progressInfos', this.progressInfos)
  //       } else if (event instanceof HttpResponse) {
  //         this.fileInfos = this.uploadService.getFiles()
  //         console.log('this.fileInfos', this.fileInfos)
  //       }
  //     },
  //     (err: any) => {
  //       console.log('err', err)
  //       this.progressInfos[idx].value = 0
  //       this.message = 'Could not upload the file:' + file.name
  //     })
  // }

}
