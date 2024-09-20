import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { MatSnackBar, PageEvent, MatDialog } from '@angular/material'
import { HttpErrorResponse } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
// tslint:disable-next-line
import _ from 'lodash'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { FileService } from '../../../../users/services/upload.service'
import { UsersService } from '../../../../users/services/users.service'
import { FileProgressComponent } from '../../users-view/file-progress/file-progress.component'
import { VerifyOtpComponent } from '../../users-view/verify-otp/verify-otp.component'

@Component({
  selector: 'ws-bulk-upload-approval',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss'],
})
export class BulkUploadApprovalComponent implements OnInit, AfterViewInit, OnDestroy {

  lastUploadList: any[] = []
  private destroySubject$ = new Subject()
  downloadSampleFilePath = ''
  downloadAsFileName = ''
  rootOrgId: any

  showFileError = false
  public fileName: any
  fileSelected!: any
  userProfile: any
  fileUploadDialogInstance: any

  sizeOptions = [10, 20]
  startIndex = 0
  lastIndex: any
  pageSize = 10

  constructor(
    private fileService: FileService,
    private matSnackBar: MatSnackBar,
    private router: ActivatedRoute,
    public dialog: MatDialog,
    private usersService: UsersService
  ) {
    this.rootOrgId = _.get(this.router.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    this.userProfile = _.get(this.router.snapshot.parent, 'data.configService.userProfileV2')

    this.router.data.subscribe(data => {
      if (data && data.pageData) {
        this.downloadSampleFilePath = data.pageData.data.downloadSampleFilePath
        this.downloadAsFileName = data.pageData.data.downloadAsFileName
      }
    })
  }

  ngOnInit() {
    this.getBulkStatusList()
  }

  ngAfterViewInit(): void {
    this.lastIndex = this.sizeOptions[0]
  }

  onChangePage(pe: PageEvent) {
    this.startIndex = pe.pageIndex * pe.pageSize
    this.lastIndex = (pe.pageIndex + 1) * pe.pageSize

    // this.startIndex = this.pageIndex
  }

  getBulkStatusList(): void {
    this.fileService.getBulkApprovalUploadDataV1()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        this.lastUploadList = res.result.content.sort((a: any, b: any) =>
          new Date(b.datecreatedon).getTime() - new Date(a.datecreatedon).getTime())
        // tslint:disable-next-line
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open('Unable to get Bulk status list')
        }
      })
  }

  showFileUploadProgress(): void {
    this.fileUploadDialogInstance = this.dialog.open(FileProgressComponent, {
      data: {},
      disableClose: true,
      panelClass: 'progress-modal',
    })
  }

  handleDownloadFile(listObj: any): void {
    const filePath = `/apis/proxies/v8/workflow/admin/bulkuploadfile/download/${listObj.filename}`
    window.open(filePath, '_blank')
  }

  handleDownloadSampleFile(): void {
    this.fileService.download(this.downloadSampleFilePath, this.downloadAsFileName)
  }

  handleFileClick(event: any): void {
    event.target.value = ''
  }

  sendOTP(): void {
    this.generateAndVerifyOTP(this.userProfile.email ? 'email' : 'phone')
  }

  generateAndVerifyOTP(contactType: string, resendFlag?: string): void {
    const postValue = contactType === 'email' ? this.userProfile.email : this.userProfile.mobile
    this.usersService.sendOtp(postValue, contactType)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.matSnackBar.open(`An OTP has been sent to your ${contactType === 'phone' ? 'Mobile number'
          : 'Email address'}, (Valid for 15 min's)`)
        if (!resendFlag) {
          this.verifyOTP(contactType)
        }
        // tslint:disable-next-line
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(_.get(error, 'error.params.errmsg') || `Unable to send OTP to your ${contactType}, please try again later!`)
        }
      })
  }

  handleOnFileChange(event: any): void {
    this.showFileError = false
    const fileList = (<HTMLInputElement>event.target).files
    if (fileList && fileList.length > 0) {
      const file: File = fileList[0]
      this.fileName = file.name
      this.fileSelected = file
      if (this.fileService.validateFile(this.fileName)) {
        // this.sendOTP()
        this.verifyOTP(this.userProfile.email ? 'email' : 'phone')
      } else {
        this.showFileError = true
      }
    }
  }

  verifyOTP(contactType: string): void {
    const dialogRef = this.dialog.open(VerifyOtpComponent, {
      data: { type: contactType, email: this.userProfile.email, mobile: this.userProfile.mobile },
      disableClose: true,
      panelClass: 'common-modal',
    })

    dialogRef.componentInstance.resendOTP.subscribe((_cType: any) => {
      this.generateAndVerifyOTP(_cType, 'resend')
    })

    dialogRef.componentInstance.otpVerified.subscribe((_data: boolean) => {
      this.showFileUploadProgress()
      this.uploadCSVFile()
    })
  }

  uploadCSVFile(): void {
    if (this.fileService.validateFile(this.fileName)) {
      if (this.fileSelected) {
        const formData: FormData = new FormData()
        formData.append('data', this.fileSelected, this.fileName)
        this.fileService.uploadApproval(this.fileName, formData)
          .pipe(takeUntil(this.destroySubject$))
          .subscribe((_res: any) => {
            this.fileUploadDialogInstance.close()
            this.matSnackBar.open('File uploaded successfully!')
            this.fileName = ''
            this.fileSelected = ''
            this.getBulkStatusList()
            // tslint:disable-next-line
          }, (_err: HttpErrorResponse) => {
            if (!_err.ok) {
              this.matSnackBar.open('Uploading CSV file failed due to some error, please try again later!')
            }
          })
      }
    } else {
      this.showFileError = true
    }
  }

  handleChangePage(_event: PageEvent): void {
    this.pageSize = _event.pageSize
    this.startIndex = (_event.pageIndex) * _event.pageSize
    this.lastIndex = this.startIndex + _event.pageSize
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe()
  }
}
