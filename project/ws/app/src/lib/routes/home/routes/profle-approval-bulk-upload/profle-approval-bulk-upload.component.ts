import { DatePipe } from '@angular/common'
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms'
import { MatSort, MatSnackBar, MatRadioChange } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { Observable, Subscription, interval } from 'rxjs'
import { startWith, pairwise, map } from 'rxjs/operators'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { environment } from 'src/environments/environment'
import { FileService } from '../../../users/services/upload.service'
import { UsersService } from '../../../users/services/users.service'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-profle-approval-bulk-upload',
  templateUrl: './profle-approval-bulk-upload.component.html',
  styleUrls: ['./profle-approval-bulk-upload.component.scss'],
})
export class ProfleApprovalBulkUploadComponent implements OnInit, OnDestroy, AfterViewInit {

  tableList!: any[]
  public fileName: any
  public displayLoader!: Observable<boolean>
  public formGroup = this.fb.group({
    file: ['', Validators.required],
  })
  fetching = true
  showFileError = false
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>
  @ViewChild(MatSort, { static: true }) sort!: MatSort
  bulkUploadData: any
  uplaodSuccessMsg!: string
  dataSource: MatTableDataSource<any>
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['fileName', 'status', 'failedRecordsCount', 'successfulRecordsCount', 'totalRecords', 'dateCreatedOn', 'dateUpdatedOn']
  tabledata!: ITableData
  departments: string[] = []
  contactUsUrl = ''
  fileSelected!: any
  pageDataSubscription!: any
  downloadSampleFilePath = ''
  downloadAsFileName = ''
  rootOrgId!: any
  phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
  emailPattern = `^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`
  emailLengthVal = false
  isMobileVerified = false
  isEmailVerified = false
  otpSend = false
  otpEmailSend = false
  otpVerified = false
  OTP_TIMER = environment.resendOTPTIme
  timerSubscription: Subscription | null = null
  timeLeftforOTP = 0
  timeLeftforOTPEmail = 0
  timerSubscriptionEmail: Subscription | null = null
  OTP_TIMER_EMAIL = environment.resendOTPTIme
  registrationForm!: FormGroup
  disableBtn = false
  disableVerifyBtn = false
  disableEmailVerifyBtn = false
  userEmail = ''
  userMobile = ''
  userProfileV2!: any
  myRoles: any = []

  objDataSource = new MatTableDataSource<any>()
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | null = null

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator
    this.setDataSourceAttributes()
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator
  }

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private usersSvc: UsersService,
  ) {
    this.rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    this.userProfileV2 = _.get(this.route.snapshot.parent, 'data.configService.userProfileV2')
    if (_.get(this.route.snapshot.parent, 'data.configService.userRoles')) {
      this.myRoles = _.get(this.route.snapshot.parent, 'data.configService.userRoles')
    }
    this.dataSource = new MatTableDataSource(this.bulkUploadData)
    this.dataSource.paginator = this.paginator

    this.pageDataSubscription = this.route.data.subscribe(data => {
      if (data && data.pageData) {
        this.downloadSampleFilePath = data.pageData.data.downloadSampleFilePath
        this.downloadAsFileName = data.pageData.data.downloadAsFileName
      }
    })

    this.registrationForm = new FormGroup({
      otpType: new FormControl('email', [Validators.pattern(this.emailPattern)]),
      // tslint:disable-next-line:max-line-length
      email: new FormControl({ value: '', disabled: true }, [Validators.pattern(this.emailPattern)]),
      // department: new FormControl('', [Validators.required, forbiddenNamesValidator(this.masterDepartments)]),
      mobile: new FormControl('', [Validators.pattern(this.phoneNumberPattern), Validators.maxLength(12)]),
    })
  }

  ngOnInit() {
    if (this.userProfileV2) {
      this.userEmail = this.userProfileV2.email || ''
      this.registrationForm.patchValue({ email: this.userEmail })
      this.registrationForm.updateValueAndValidity()
    }
    if (this.userProfileV2) {
      this.userMobile = this.userProfileV2.mobile || ''
      this.registrationForm.patchValue({ mobile: this.userMobile })
      this.registrationForm.updateValueAndValidity()
    }
    this.displayLoader = this.fileService.isLoading()
    this.contactUsUrl = `${environment.karmYogiPath}/public/contact `
    this.tabledata = {
      columns: [
        { displayName: 'Name', key: 'fileName' },
        { displayName: 'Status', key: 'status' },
        { displayName: 'Failed records', key: 'failedRecordsCount' },
        { displayName: 'Success records', key: 'successfulRecordsCount' },
        { displayName: 'Total records', key: 'totalRecords' },
        { displayName: 'Created on', key: 'dateCreatedOn' },
        { displayName: 'Updated on', key: 'dateUpdatedOn' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'dateCreatedOn',
      sortState: 'desc',
      needUserMenus: false,
      actions: [{ icon: 'download', label: 'Download file', name: 'DownloadFile', type: 'link', disabled: false }],
      actionColumnName: 'Download file',
    }

    this.getBulkUploadData()
    this.onPhoneChange()
    this.onEmailChange()

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    // this.dataSource = new MatTableDataSource(this.bulkUploadData)
    setTimeout(() => {
      this.dataSource.sort = this.sort
    })
  }

  radioChange(_event: MatRadioChange) {
    this.resetOTPFields()
  }

  getBulkUploadData() {
    this.fileService.getBulkUploadDataV1(this.rootOrgId).subscribe((res: any) => {
      this.tableList = []
      if (res.result && res.result.content) {
        this.bulkUploadData = res.result.content
        this.bulkUploadData.forEach((element: any) => {
          this.tableList.push({
            fileName: element.fileName,
            status: element.status ? element.status : '',
            failedRecordsCount: element.failedRecordsCount ? element.failedRecordsCount : 0,
            successfulRecordsCount: element.successfulRecordsCount ? element.successfulRecordsCount : 0,
            totalRecords: element.totalRecords ? element.totalRecords : 0,
            dateCreatedOn: element.dateCreatedOn ? element.dateCreatedOn : '',
            dateUpdatedOn: element.dateUpdatedOn ? element.dateUpdatedOn : '',
          })
        })
        this.fetching = false
        // this.bulkUploadData = []
        this.dataSource = new MatTableDataSource(this.bulkUploadData)
        setTimeout(() => this.dataSource.paginator = this.paginator)
        // setTimeout(
        //   () => {
        //     if (this.sort) {
        //       this.sort.active = this.tabledata.sortColumn,
        //         this.sort.start = this.tabledata.sortState
        //     }
        //     this.dataSource.sort = this.sort
        //   },
        //   100)
      } else {
        this.fetching = false
      }
    })
  }

  public onFileChange(event: any) {
    this.showFileError = false
    const fileList = (<HTMLInputElement>event.target).files
    if (fileList && fileList.length > 0) {
      const file: File = fileList[0]
      this.fileName = file.name
      this.fileSelected = file
      this.formGroup.patchValue({
        file,
      })
    }
  }

  fileClick(event: any) {
    event.target.value = ''
  }

  cancelSelected() {
    this.fileName = ''
    this.fileSelected = ''
    this.formGroup.controls['file'].setValue('')
    this.resetOTPFields()
  }

  public onSubmit(form: any): void {
    // Validate File type before uploading
    if (this.fileService.validateFile(this.fileName)) {
      if (this.formGroup && this.formGroup.get('file')) {
        const formData: FormData = new FormData()
        formData.append('data', this.fileSelected, this.fileName)
        // tslint:disable-next-line: no-non-null-assertion
        this.fileService.upload(this.fileName, formData)
          .subscribe(
            _res => {
              // this.uplaodSuccessMsg = res
              this.openSnackbar('File uploaded successfully!')
              this.cancelSelected()
              // // tslint:disable-next-line: no-non-null-assertion
              // this.formGroup!.get('file')!.setValue(['', Validators.required])
              if (form && form.file) {
                form.file.value = ''
              }
              this.resetOTPFields()
              this.formGroup.reset()
              this.getBulkUploadData()
            },
            _err => {
              this.openSnackbar(this.toastError.nativeElement.value)
            })
      }
    } else {
      this.showFileError = true
      this.openSnackbar(this.toastError.nativeElement.value)
    }
  }

  resetOTPFields() {
    this.isEmailVerified = false
    this.otpEmailSend = false
    this.isMobileVerified = false
    this.otpSend = false
    this.disableVerifyBtn = false
  }


  public downloadFile(): void {
    this.fileService.download(this.downloadSampleFilePath, this.downloadAsFileName)
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  public downloadReport(row: any) {
    this.fileService.downloadReport(row.identifier, row.name)
  }

  ngOnDestroy() {
    if (this.pageDataSubscription) {
      this.pageDataSubscription.unsubscribe()
    }
  }

  downloadFullFile(event: any) {
    const url = `/apis/proxies/v8/user/v1/bulkuser/download/${event.row.fileName}`
    window.open(url, '_blank')
  }

  emailVerification(emailId: string) {
    this.emailLengthVal = false
    if (emailId && emailId.length > 0) {
      const email = emailId.split('@')
      if (email && email.length === 2) {
        if ((email[0] && email[0].length > 64) || (email[1] && email[1].length > 255)) {
          this.emailLengthVal = true
        }
      } else {
        this.emailLengthVal = false
      }
    }
  }

  onPhoneChange() {
    const ctrl = this.registrationForm.get('mobile')
    if (ctrl) {
      ctrl
        .valueChanges
        .pipe(startWith(null), pairwise())
        .subscribe(([prev, next]: [any, any]) => {
          if (!(prev == null && next)) {
            this.isMobileVerified = false
            this.otpSend = false
            this.disableVerifyBtn = false
          }
        })
    }
  }

  onEmailChange() {
    const ctrl = this.registrationForm.get('email')
    if (ctrl) {
      ctrl
        .valueChanges
        .pipe(startWith(null), pairwise())
        .subscribe(([prev, next]: [any, any]) => {
          if (!(prev == null && next)) {
            this.isEmailVerified = false
            this.otpEmailSend = false
            this.disableEmailVerifyBtn = false
          }
        })
    }
  }

  sendOtp() {
    // const mob = this.registrationForm.get('mobile')
    if (this.userMobile) {
      this.usersSvc.sendOtp(this.userMobile, 'phone').subscribe(() => {
        this.otpSend = true
        alert('An OTP has been sent to your mobile number (valid for 15 minutes)')
        this.startCountDown()
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open('Please enter a valid mobile number')
    }
  }

  resendOTP() {
    // const mob = this.registrationForm.get('mobile')
    if (this.userMobile) {
      this.usersSvc.resendOtp(this.userMobile, 'phone').subscribe((res: any) => {
        if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
          this.otpSend = true
          this.disableVerifyBtn = false
          alert('An OTP has been sent to your mobile number (valid for 15 minutes)')
          this.startCountDown()
        }
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open('Please enter a valid mobile number')
    }
  }

  verifyOtp(otp: any) {
    // const mob = this.registrationForm.get('mobile')

    if (otp && otp.value) {
      if (otp && otp.value.length < 4) {
        this.snackBar.open('Please enter a valid OTP.')
      } else if (this.userMobile) {
        this.usersSvc.verifyOTP(otp.value, this.userMobile, 'phone').subscribe((res: any) => {
          if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
            this.otpVerified = true
            this.isMobileVerified = true
            this.disableBtn = false
            // const reqUpdates = {
            //   request: {
            //     userId: this.configSvc.unMappedUser.id,
            //     profileDetails: {
            //       personalDetails: {
            //         mobile: mob.value,
            //         phoneVerified: true,
            //       },
            //     },
            //   },
            // }
            // this.userProfileSvc.editProfileDetails(reqUpdates).subscribe((updateRes: any) => {
            //   if (updateRes) {
            //     this.isMobileVerified = true
            //   }
            // })
          }
          // tslint:disable-next-line: align
        }, (error: any) => {
          this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
          if (error.error && error.error.result) {
            this.disableVerifyBtn = error.error.result.remainingAttempt === 0 ? true : false
          }
        })
      }
    } else {
      this.snackBar.open('Please enter a valid OTP.')
    }
  }
  startCountDown() {
    const startTime = Date.now()
    this.timeLeftforOTP = this.OTP_TIMER
    // && this.primaryCategory !== this.ePrimaryCategory.PRACTICE_RESOURCE
    if (this.OTP_TIMER > 0
    ) {
      this.timerSubscription = interval(1000)
        .pipe(
          map(
            () =>
              startTime + this.OTP_TIMER - Date.now(),
          ),
        )
        .subscribe((_timeRemaining: any) => {
          this.timeLeftforOTP -= 1
          if (this.timeLeftforOTP < 0) {
            this.timeLeftforOTP = 0
            if (this.timerSubscription) {
              this.timerSubscription.unsubscribe()
            }
            // this.submitQuiz()
          }
        })
    }
  }

  sendOtpEmail() {
    // const email = this.registrationForm.get('email')
    if (this.userEmail) {
      this.usersSvc.sendOtp(this.userEmail, 'email').subscribe(() => {
        this.otpEmailSend = true
        alert('An OTP has been sent to your email address (valid for 15 minutes)')
        this.startCountDownEmail()
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    }
    // else {
    //   this.snackBar.open('Please enter a valid email address.')
    // }
  }

  resendOTPEmail() {
    // const email = this.registrationForm.get('email')
    if (this.userEmail) {
      this.usersSvc.resendOtp(this.userEmail, 'email').subscribe((res: any) => {
        if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
          this.otpEmailSend = true
          this.disableEmailVerifyBtn = false
          alert('An OTP has been sent to your email (valid for 15 minutes)')
          this.startCountDownEmail()
        }
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    }
    // else {
    //   this.snackBar.open('Please enter a valid email address.')
    // }
  }

  verifyOtpEmail(otp: any) {
    // const email = this.registrationForm.get('email')
    if (otp && otp.value) {
      if (otp && otp.value.length < 4) {
        this.snackBar.open('Please enter a valid OTP.')
      } else if (this.userEmail) {
        this.usersSvc.verifyOTP(otp.value, this.userEmail, 'email').subscribe((res: any) => {
          if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
            this.otpEmailSend = true
            this.isEmailVerified = true
            this.disableBtn = false
          }
          // tslint:disable-next-line: align
        }, (error: any) => {
          this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
          if (error.error && error.error.result) {
            this.disableEmailVerifyBtn = error.error.result.remainingAttempt === 0 ? true : false
          }
        })
      }
    } else {
      this.snackBar.open('Please enter a valid OTP.')
    }
  }
  startCountDownEmail() {
    const startTime = Date.now()
    this.timeLeftforOTPEmail = this.OTP_TIMER_EMAIL
    // && this.primaryCategory !== this.ePrimaryCategory.PRACTICE_RESOURCE
    if (this.OTP_TIMER_EMAIL > 0
    ) {
      this.timerSubscriptionEmail = interval(1000)
        .pipe(
          map(
            () =>
              startTime + this.OTP_TIMER_EMAIL - Date.now(),
          ),
        )
        .subscribe(_timeRemaining => {
          this.timeLeftforOTPEmail -= 1
          if (this.timeLeftforOTPEmail < 0) {
            this.timeLeftforOTPEmail = 0
            if (this.timerSubscriptionEmail) {
              this.timerSubscriptionEmail.unsubscribe()
            }
            // this.submitQuiz()
          }
        })
    }
  }

  get getKarmayogiLink() {
    if (this.myRoles && this.myRoles.has('public')) {
      return `${environment.karmYogiPath}/app/user-profile/details`
    }
    return ''
  }

}
