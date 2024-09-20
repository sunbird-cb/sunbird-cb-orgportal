import { Component, OnInit, Inject, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { HttpErrorResponse } from '@angular/common/http'
import { MatRadioChange, MatSnackBar } from '@angular/material'

import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
/* tslint:disable */
import * as _ from 'lodash'
/* tslint:enable */
import { OtpService } from '../../../../users/services/otp.service'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { UsersService } from '../../../../users/services/users.service'

@Component({
  selector: 'ws-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnInit, OnDestroy {

  private destroySubject$ = new Subject()
  @ViewChild('timerDiv', { static: false }) timerDiv !: any
  @Output() resendOTP = new EventEmitter<string>()
  @Output() otpVerified = new EventEmitter<any>()
  timeLeft = 150
  interval: any
  showResendOTP = false
  otpEntered = ''
  otpSelectionForm!: FormGroup
  otpTypeSelected = false
  otpTypeSelectedValue: any

  constructor(
    public dialogRef: MatDialogRef<VerifyOtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matSnackbar: MatSnackBar,
    private otpService: OtpService,
    private usersService: UsersService
  ) {
    this.otpSelectionForm = new FormGroup({
      otpType: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    this.startTimer()
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft = this.timeLeft - 1
        this.timerDiv.nativeElement.innerHTML = `${Math.floor(this.timeLeft / 60)}m: ${this.timeLeft % 60}s`
      } else {
        clearInterval(this.interval)
        this.showResendOTP = true
      }
    },                          1000)
  }

  handleCloseModal(): void {
    this.dialogRef.close()
  }

  handleResendOTP(): void {
    this.timeLeft = 150
    this.showResendOTP = !this.resendOTP
    this.startTimer()
    this.resendOTP.emit(this.data.type)
  }

  handleVerifyOTP(): void {
    if (this.otpTypeSelectedValue === 'email') {
      this.verifyEmailOTP()
    } else {
      this.verifyMobileOTP()
    }
  }

  verifyEmailOTP(): void {
    this.otpService.verifyEmailOTP(this.otpEntered, this.data.email)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.handleCloseModal()
        this.otpVerified.emit(true)
      },         (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackbar.open('Unable to verify OTP, please try again later!')
        }
      })
  }

  verifyMobileOTP(): void {
    this.otpService.verifyOTP(Number(this.otpEntered), this.data.mobile)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.handleCloseModal()
        this.otpVerified.emit(true)
      },         (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackbar.open('Unable to verify OTP, please try again later!')
        }
      })
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
    this.destroySubject$.unsubscribe()
  }

  radioChange(_event: MatRadioChange) {
    // this.resetOTPFields()
  }

  sendOtp() {
    this.generateAndVerifyOTP(this.otpSelectionForm.value.otpType)
    this.otpTypeSelected = true
    this.otpTypeSelectedValue = this.otpSelectionForm.value.otpType
  }

  generateAndVerifyOTP(contactType: string): void {
    const type = contactType === 'email' ? 'email' : 'phone'
    const postValue = contactType === 'email' ? this.data.email : this.data.mobile
    this.usersService.sendOtp(postValue, type)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.matSnackbar.open(`An OTP has been sent to your ${type === 'phone' ? 'Mobile number'
          : 'Email address'}, (Valid for 15 min's)`)
        // if (!resendFlag) {
        //   this.verifyOTP(contactType)
        // }
        // tslint:disable-next-line
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackbar.open(_.get(error, 'error.params.errmsg') || `Unable to send OTP to your ${contactType}, please try again later!`)
        }
      })
  }
}
