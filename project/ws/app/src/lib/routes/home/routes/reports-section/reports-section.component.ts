import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MatDialog, MatSnackBar } from '@angular/material'
import { DownloadReportService } from '../../services/download-report.service'
import { DatePipe } from '@angular/common'
import { mergeMap } from 'rxjs/operators'
import * as _ from 'lodash'
import { forkJoin, of } from 'rxjs'
import { ReportsVideoComponent } from '../reports-video/reports-video.component'
import { EventService } from '@sunbird-cb/utils'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
import { HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { environment } from '../../../../../../../../../src/environments/environment'

@Component({
  selector: 'ws-app-reports-section',
  templateUrl: './reports-section.component.html',
  styleUrls: ['./reports-section.component.scss'],
})
export class ReportsSectionComponent implements OnInit {
  // @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | null = null
  // btnList!: any
  // tabledata!: ITableData
  // dataSource: MatTableDataSource<any>
  // reportSectionData: any
  // lastUpdatedOn!: any

  configSvc!: any
  userDetails: any
  lastUpdatedOn: string | null = ''
  showPasswordView = false
  password = ''
  showPassword = false
  showAdminsTable = false
  adminTableData: any
  adminTableDataSource: any
  showLoaderOnTable = false
  noteLoaded = false
  reportsNoteList: string[] = []
  hassAccessToreports = false
  reportsAvailbale = false
  reportsDownlaoding = false
  teamUrl: any
  constructor(
    private activeRouter: ActivatedRoute,
    private downloadService: DownloadReportService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private events: EventService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
  ) {
    this.configSvc = this.activeRouter.parent && this.activeRouter.parent.snapshot.data.configService
    this.userDetails = this.configSvc.unMappedUser
    this.teamUrl = environment.teamsUrl
  }

  ngOnInit() {
    this.noteLoaded = false
    const getNoteDetails = true
    this.getReportInfo()
    this.setTableHeaders()
    this.getAdminTableData(getNoteDetails)
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

  getReportInfo() {
    this.reportsAvailbale = false
    this.downloadService.getReportInfo().subscribe({
      next: response => {
        if (response) {
          this.lastUpdatedOn = response.lastModified ? this.datePipe.transform(response.lastModified, 'dd/MM/yyyy, hh:mm a') : ''
          this.reportsAvailbale = _.get(response, 'fileMetaData.empty') === false && response.lastModified ? true : false
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = _.get(error, 'error.message', 'Some thing went wrong')
        this.openSnackbar(errorMessage)
      },
    })
  }

  //#region (setting admin table)
  setTableHeaders() {
    this.adminTableData = {
      columns: [
        { displayName: 'S. No.', key: 'sno', type: 'position' },
        { displayName: 'MDO Admin Name', key: 'MDOAdmin', type: 'text' },
        { displayName: 'MDO Admin Email', key: 'MDOAdminemail', type: 'text' },
        { displayName: 'Access Expiry Date', key: 'expiryDate', type: 'datePicker' },
        { displayName: 'Action', key: 'assigned', type: 'action' },
      ],
    }
  }

  getAdminTableData(getNoteDetails = false) {
    const isMDOLeader = this.configSvc && this.userDetails.roles.includes('MDO_LEADER') ? true : false
    this.showAdminsTable = isMDOLeader ? true : false
    const filters = {
      request: {
        filters: {
          rootOrgId: this.configSvc.userProfile.rootOrgId,
          'organisations.roles': [
            isMDOLeader ? 'MDO_ADMIN' : 'MDO_LEADER',
          ],
        },
      },
    }
    const readAssessEndPoint = isMDOLeader ? 'leader/readaccess' : 'admin/readaccess'
    this.showLoaderOnTable = true
    forkJoin([
      this.downloadService.getAdminsList(filters),
      this.downloadService.getAccessDetails(readAssessEndPoint),
    ])
      .pipe(
        mergeMap(([adminDetails, accessDetailsList]) => {
          const formatedResponse: {
            currentUserAccessDetails: any,
            formatedAdminsList: any[]
          } = {
            currentUserAccessDetails: {},
            formatedAdminsList: [],
          }
          if (adminDetails && adminDetails.content) {
            formatedResponse.currentUserAccessDetails = accessDetailsList && accessDetailsList.length > 0 ?
              accessDetailsList.find((obj: any) => obj.userId === this.userDetails.id) : { reportAccessExpiry: '' }
            adminDetails.content.forEach((user: any) => {
              const accessDetails = accessDetailsList && accessDetailsList.length > 0 ?
                accessDetailsList.find((obj: any) => obj.userId === user.id) : { reportAccessExpiry: '' }
              if (this.userDetails.id !== user.id) {
                const currentDate = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || ''
                const expireDate = this.datePipe.transform(_.get(accessDetails, 'reportAccessExpiry', ''), 'yyyy/MM/dd') || ''
                const firstName = _.get(user, 'firstName', '')
                // const fullName = user.lastName ? `${user.lastName}' '${firstName}` : firstName

                let _startDate = new Date()
                if (expireDate) {
                  if (expireDate < currentDate) {
                    _startDate = new Date(expireDate)
                  }
                }
                const formatedUserDetails = {
                  userID: user.id,
                  MDOAdmin: firstName,
                  MDOAdminemail: _.get(user, 'profileDetails.personalDetails.primaryEmail'),
                  expiryDate: expireDate ? new Date(expireDate) : '',
                  assigned: expireDate >= currentDate,
                  enableAccessBtn: false,
                  buttonText: expireDate && expireDate < currentDate ? 'Access Expired' : 'Give Access',
                  preExpiryDate: expireDate,
                  startDate: _startDate,
                }
                formatedResponse.formatedAdminsList.push(formatedUserDetails)
              }
            })
          }
          return of(formatedResponse)
        })
      )
      .subscribe({
        next: response => {
          this.showLoaderOnTable = false
          this.noteLoaded = true
          this.adminTableDataSource = response.formatedAdminsList
          if (getNoteDetails) {
            const hasUsers = response.formatedAdminsList && response.formatedAdminsList.length ? true : false
            this.getNoteList(isMDOLeader, hasUsers, this.datePipe.transform(
              _.get(response, 'currentUserAccessDetails.reportAccessExpiry'), 'yyyy/MM/dd') || '')
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = _.get(error, 'error.message', 'Some thing went wrong')
          this.openSnackbar(errorMessage)
          this.noteLoaded = true
          this.showLoaderOnTable = false
          const userAccessExpireDate = this.datePipe.transform(_.get(this.userDetails, 'report_access_expiry'), 'yyyy/MM/dd') || ''
          this.getNoteList(isMDOLeader, false, userAccessExpireDate)
        },
      })
  }
  //#endregion

  getNoteList(isMDOLeader: boolean, hasUsers: boolean, userAccessExpireDate: string) {
    if (hasUsers) {
      if (isMDOLeader) {
        this.hassAccessToreports = true
        this.reportsNoteList = [
          `You can grant access to these reports to your existing
          MDO Admins. Similarly, if you want to onboard new MDO Admins, it can
          be done in the 'Users' tab, and then grant the access.`,
          `Please grant or renew access to these reports to the MDO Admin
          very carefully due to Personally Identifiable Information (PII) data security.`,
        ]
      } else {
        const todayDate = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || ''
        if (userAccessExpireDate === '') {
          this.hassAccessToreports = false
          this.reportsNoteList = [
            `Currently, your MDO Leader has not granted you access to these
            reports.Kindly contact your MDO Leader to provide you access.`,
          ]
        } else if (userAccessExpireDate >= todayDate) {
          this.hassAccessToreports = true
          this.reportsNoteList = [
            `These reports contain Personally Identifiable Information (PII) data.
            Please use them cautiously.`,
            `Your access to the report is available until ${userAccessExpireDate}.
            Please contact your MDO Leader to renew your access.`,
          ]
        } else if (userAccessExpireDate < todayDate) {
          this.hassAccessToreports = false
          this.reportsNoteList = [
            `Your access to reports expired on ${userAccessExpireDate}. Please
            contact your MDO Leader to renew access.`,
          ]
        } else {
          this.hassAccessToreports = false
          this.reportsNoteList = [
            `Currently, your MDO Leader has not granted you access to these
            reports.Kindly contact your MDO Leader to provide you access.`,
          ]
        }
      }
    } else {
      if (isMDOLeader) {
        this.hassAccessToreports = true
        this.reportsNoteList = [
          `Your organization doesn’t have an MDO Admin role. Please assign the
          MDO Admin role in the 'Users' tab.`,
          `After successfully onboarding an MDO Admin, they can be granted
          access to these reports.`,
          `Please grant or renew access to these reports to the MDO Admin very
          carefully due to Personally Identifiable Information (PII) data security.`,
        ]
      } else {
        this.hassAccessToreports = false
        this.reportsNoteList = [
          `Your organization does not have an MDO Leader onboarded.
          Every organization must have a leader assigned to
          iGOT to access these reports.
          Please reach out to us at mission.karmayogi@gov.in or
          connect with us via Video Conferencing by clicking the button below:
          [<a target='_blank' href='${this.teamUrl}'>Join Now</a>]`,
          `Once the MDO Leader is onboarded, they will grant you access to download the
          reports, and you are requested to connect with your MDO Leader for further process.`,
        ]
      }
    }
  }

  downLoadReports(event: MouseEvent) {
    event.stopPropagation()
    this.reportsDownlaoding = true
    this.downloadService.downloadReports().subscribe({
      next: (response: HttpResponse<Blob>) => {
        const password = response.headers.getAll('Password')
        this.password = password ? password[0] : ''
        if (response.body) {
          const contentType = response.headers.get('Content-Type')
          const blob = new Blob([response.body], {
            type: contentType ? contentType : 'application/octet-stream',
          })
          const blobUrl = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = 'All Reports.zip'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          // Clean up blob URL
          window.URL.revokeObjectURL(blobUrl)
        }
        this.showPasswordView = true
        this.reportsDownlaoding = false
        this.raiseTelemetry()
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = _.get(error, 'error.message', 'Some thing went wrong')
        this.openSnackbar(errorMessage)
      },
    })

  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_DOWNLOAD_REPORTS,
        id: 'report-download',
      },
      {},
    )
  }

  updateAccess(rowData: any) {
    const formData = {
      request: {
        userId: rowData.userID,
        reportExpiryDate: rowData.expiryDate,
      },
    }
    this.showLoaderOnTable = true
    this.downloadService.updateAccessToReports(formData).subscribe({
      next: (response: any) => {
        if (response.result) {
          this.openSnackbar(_.get(response, 'result.message', 'Report access has been granted successfully'))
        }
        this.getAdminTableData()
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = _.get(error, 'error.message', 'Some thing went wrong')
        this.openSnackbar(errorMessage)
        this.getAdminTableData()
      },
    })
  }

  copyToClipboard() {
    const dummyTextArea = document.createElement('textarea')
    dummyTextArea.value = this.password
    document.body.appendChild(dummyTextArea)
    dummyTextArea.select()
    document.execCommand('copy')
    document.body.removeChild(dummyTextArea)
    this.openSnackbar('Password copied to clipboard.')
  }

  openVideoPopup() {
    this.dialog.open(ReportsVideoComponent, {
      data: {
        videoLink: 'https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1',
      },
      disableClose: true,
      width: '50%',
      height: '60%',
      panelClass: 'overflow-visable',
    })
  }

  private openSnackbar(primaryMsg: any, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

}
