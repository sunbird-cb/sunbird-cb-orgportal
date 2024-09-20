import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material'
import { EventService } from '@sunbird-cb/utils'

/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
import { TelemetryEvents } from '../../../../../head/_services/telemetry.event.model'
import { ReportsVideoComponent } from '../../reports-video/reports-video.component'
import { ApprovalsService } from '../../../services/approvals.service'
import { LoaderService } from '../../../../../../../../../../src/app/services/loader.service'

@Component({
  selector: 'ws-approval-pending',
  templateUrl: './approval-pending.component.html',
  styleUrls: ['./approval-pending.component.scss'],
})

export class ApprovalPendingComponent implements OnInit, OnDestroy {
  profileVerificationDataCache: any[] = []
  profileVerificationData: any = []
  transfersData: any = []
  approvalData: any = []
  currentFilter = 'profileverification'
  departName = ''
  limit: any = 20
  pageIndex: any = 0
  currentOffset = 0
  configSvc: any
  reportsNoteList: string[] = []
  showApproveALL = false
  disableApproveALL = false
  getSortOrderValue: any
  totalTransfersRecords: any = 0
  totalProfileVerificationRecords: any = 0
  tabChange = 0
  cacheOffset: any = 0

  constructor(
    private router: Router,
    private apprService: ApprovalsService,
    private activeRouter: ActivatedRoute,
    private route: ActivatedRoute,
    private events: EventService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private snackbar: MatSnackBar,
    private loaderService: LoaderService) {
    this.configSvc = this.route.parent && this.route.parent.snapshot.data.configService
    if (this.activeRouter.parent && this.activeRouter.parent.snapshot.data.configService.unMappedUser.channel
    ) {
      this.departName = _.get(this.activeRouter, 'parent.snapshot.data.configService.unMappedUser.channel')
    }
  }

  ngOnInit() {
    this.currentFilter = this.route.snapshot.routeConfig && this.route.snapshot.routeConfig.path
      ? this.route.snapshot.routeConfig.path : 'profileverification'

    if (!this.tabChange) {
      this.currentFilter = 'profileverification'
      this.fetchApprovals('')
      this.fetchTransfers(1)
    }

    this.retrieveCachedApprovals()

    this.reportsNoteList = [
      // tslint:disable-next-line: max-line-length
      `Profile Verifications: Review and approve/reject user requests for verification of one or more primary fields.`,
      // tslint:disable-next-line: max-line-length
      `Transfers: Manage user transfer requests, including approving/rejecting transfers. You will receive these request in the “Transfers” section.`,
      // tslint:disable-next-line: max-line-length
      `You can update multiple user profiles in one go by using Bulk Profile Update.`,
    ]
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html)
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

  filter(key: string | 'timestamp' | 'best' | 'saved') {
    this.tabChange = 1
    if (key) {
      this.currentFilter = key
      this.pageIndex = 0
      this.currentOffset = 0
      this.limit = 20

      if (this.currentFilter === 'profileverification') {
        const storedValue = localStorage.getItem('profileverificationOffset')
        this.pageIndex = storedValue !== null ? parseInt(storedValue, 10) : 0
        this.retrieveCachedApprovals()

      } else if (this.currentFilter === 'transfers') {
        if (localStorage.getItem('transfersDataCache') !== null && localStorage.getItem('transfersCacheTimestamp') !== null) {
          this.retrieveCachedTransfers()
        } else {
          this.fetchTransfers(this.limit)
        }
      }
    }
  }

  filterData() {
    if (this.currentFilter === 'profileverification') {
      this.fetchApprovals('')
    } else if (this.currentFilter === 'transfers') {
      this.fetchTransfers(this.limit)
    }
  }

  public tabTelemetry(label: string, index: number) {
    const data: TelemetryEvents.ITelemetryTabData = {
      label,
      index,
    }
    this.events.handleTabTelemetry(
      TelemetryEvents.EnumInteractSubTypes.APPROVAL_TAB,
      data,
    )
  }

  onApprovalClick(approval: any) {
    if (approval && approval.userWorkflow.userInfo) {
      this.router.navigate([`/app/approvals/${approval.userWorkflow.userInfo.wid}/to-approve`])
    }
    // this.telemetrySvc.impression()
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.CARD_CONTENT,
        id: TelemetryEvents.EnumIdtype.APPROVAL_ROW,
      },
      {
        id: approval.userWorkflow.userInfo.wid,
        type: TelemetryEvents.EnumIdtype.WORK_ORDER,
      }
    )

  }

  private updateApproveAllStatus() {
    if (this.profileVerificationData && this.profileVerificationData.length > 0) {
      this.showApproveALL = true
      this.disableApproveALL = false
    }
  }

  fetchApprovals(sortValue: any) {
    this.loaderService.changeLoad.next(true)
    const cacheKey = `${this.currentFilter}DataCache`
    const cacheTimestampKey = `${this.currentFilter}CacheTimestamp`
    const cacheTotalRecordKey = `${this.currentFilter}TotalRecords`

    const now = new Date().getTime()

    if (!sortValue) {
      // sortedVal = { firstName: 'asc' }
    }
    if (this.departName) {
      const req = {
        serviceName: 'profile',
        applicationStatus: 'SEND_FOR_APPROVAL',
        requestType: ['GROUP_CHANGE', 'DESIGNATION_CHANGE'],
        deptName: this.departName,
        offset: this.pageIndex,
        limit: this.limit,
        // sort_by: sortValue ? sortValue : sortedVal,
      }

      localStorage.setItem('profileverificationOffset', req.offset)
      this.apprService.getApprovalsList(req).subscribe(res => {
        if (res && res.result) {
          this.loaderService.changeLoaderState(false)
          this.profileVerificationData = []
          let createdOnDate: Date

          this.totalProfileVerificationRecords = res.result.count
          const resData = res.result.data
          resData.forEach((appr: any) => {
            if (appr && appr.wfInfo && appr.wfInfo.length) {
              appr.wfInfo.forEach((wf: any) => {
                if (wf.createdOn) {
                  createdOnDate = new Date(wf.createdOn)
                }
              })
            }
            const requestData = {
              fullname: (appr.userInfo && appr.userInfo.first_name) ? `${appr.userInfo.first_name}` : '--',
              requestedon: createdOnDate,
              // fields: this.replaceWords(keys, conditions),
              userWorkflow: appr,
              tag: (appr.userInfo && appr.userInfo.tag) ? `${appr.userInfo.tag}` : '',
            }
            this.profileVerificationData.push(requestData)
          })
          this.profileVerificationData.sort((a: any, b: any) => {
            const textA = a.fullname.toUpperCase()
            const textB = b.fullname.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
          })

          // Cache the data and timestamp in localStorage
          localStorage.setItem(cacheKey, JSON.stringify(this.profileVerificationData))
          localStorage.setItem(cacheTimestampKey, now.toString())
          localStorage.setItem(cacheTotalRecordKey, JSON.stringify(this.totalProfileVerificationRecords))

          if (this.profileVerificationData && this.profileVerificationData.length > 0) {
            this.showApproveALL = true
            this.disableApproveALL = false
          }
        }
      })
    } else {
      this.snackbar.open('Please connect to your SPV admin, to update MDO name.')
    }
  }

  fetchTransfers(limit1: number) {
    this.loaderService.changeLoad.next(true)
    const cacheKey = `${this.currentFilter}DataCache`
    const cacheTimestampKey = `${this.currentFilter}CacheTimestamp`
    const cacheTotalRecordKey = `transfersTotalRecords`
    const now = new Date().getTime()

    if (this.departName) {
      const req = {
        serviceName: 'profile',
        applicationStatus: 'SEND_FOR_APPROVAL',
        requestType: ['ORG_TRANSFER'],
        deptName: this.departName,
        offset: this.pageIndex,
        limit: limit1 ? limit1 : this.limit,
      }

      localStorage.setItem('transferOffset', req.offset)
      this.apprService.getApprovalsList(req).subscribe(res => {
        if (res && res.result) {
          this.loaderService.changeLoaderState(false)
          this.totalTransfersRecords = res.result.count
          this.transfersData = []
          let currentdate: Date
          const resData = res.result.data
          resData.forEach((appr: any) => {
            if (appr && appr.wfInfo && appr.wfInfo.length) {
              appr.wfInfo.forEach((wf: any) => {
                if (wf.createdOn) {
                  currentdate = new Date(wf.createdOn)
                }
              })
            }
            const requestData = {
              fullname: (appr.userInfo && appr.userInfo.first_name) ? `${appr.userInfo.first_name}` : '--',
              requestedon: currentdate,
              // fields: this.replaceWords(keys, conditions),
              userWorkflow: appr,
              tag: (appr.userInfo && appr.userInfo.tag) ? `${appr.userInfo.tag}` : '',
            }
            /* tslint:disable */
            if (appr!.wfInfo && appr!.wfInfo.length && appr!.wfInfo[0].orgTansferRequest) {
              this.transfersData.push(requestData)
            }
          })
          this.transfersData.sort((a: any, b: any) => {
            const textA = a.fullname.toUpperCase()
            const textB = b.fullname.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
          })

          // Cache the data and timestamp in localStorage
          if (this.currentFilter === 'transfers' && this.tabChange === 1) {
            localStorage.setItem(cacheKey, JSON.stringify(this.transfersData))
            localStorage.setItem(cacheTimestampKey, now.toString())
          }
          localStorage.setItem(cacheTotalRecordKey, JSON.stringify(this.totalTransfersRecords))
        }
      })
    } else {
      this.snackbar.open('Please connect to your SPV admin, to update MDO name.')
    }
  }

  getSortOrder(query: any) {
    let sortBy
    if (query && query.sortOrder) {
      sortBy = query.sortOrder
      if (sortBy === 'alphabetical') {
        return { firstName: 'asc' }
      }
      if (sortBy === 'oldest') {
        return { createdDate: 'desc' }
      }
      if (sortBy === 'newest') {
        return { createdDate: 'asc' }
      }
    }
    return { firstName: 'asc' }
  }

  replaceWords(inputString: any, wordConditions: any) {
    return wordConditions.reduce((acc: any, [word, condition]: any) => {
      return acc.replace(new RegExp(word, 'gi'), condition)
      // tslint:disable-next-line
    }, inputString)
  }

  onSearch(enterValue: any) {
    this.getSortOrderValue = this.getSortOrder(enterValue.sortOrder)
    if (this.getSortOrderValue) {
      this.fetchApprovals(this.getSortOrderValue)
    }
    // this.data.filter((user: any) => enterValue.includes(user.userInfo.first_name))
    const filterValue = enterValue.searchText.toLowerCase() ? enterValue.searchText : ''
    if (this.currentFilter === 'profileverification') {
      this.profileVerificationData = this.profileVerificationData.filter((user: any) =>
        user.fullname.toLowerCase().includes(filterValue))
    } else {
      this.transfersData = this.transfersData.filter((user: any) => user.fullname.toLowerCase().includes(filterValue))
    }
  }

  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.limit = event.pageSize
    // Clear the cache only for the current tab
    const cacheKey = `${this.currentFilter}DataCache`
    const cacheTimestampKey = `${this.currentFilter}CacheTimestamp`
    const transfersCacheKey = `${this.currentFilter}DataCache`
    const transfersCacheTimestampKey = `${this.currentFilter}CacheTimestamp`

    localStorage.removeItem(cacheKey)
    localStorage.removeItem(cacheTimestampKey)
    localStorage.removeItem(transfersCacheKey)
    localStorage.removeItem(transfersCacheTimestampKey)
    // Store current pagination state
    localStorage.setItem(`${this.currentFilter}Offset`, this.pageIndex.toString())
    localStorage.setItem(`${this.currentFilter}PageSize`, this.limit.toString())
    this.filterData()
  }

  ngOnDestroy(): void {

  }

  onApproveAllReqs(req: any) {
    this.apprService.handleWorkflow(req).subscribe((res: any) => {
      if (res.result.data) {
      }
    })
  }
  onApproveALL() {
    this.disableApproveALL = true
    if (this.profileVerificationData && this.profileVerificationData.length > 0) {
      const datalength = this.profileVerificationData.length
      this.profileVerificationData.forEach((data: any, index: any) => {
        if (data.userWorkflow.wfInfo && data.userWorkflow.wfInfo.length > 0) {
          const action = 'APPROVE'
          data.userWorkflow.wfInfo.forEach((wf: any) => {
            const req: any = {
              action,
              state: 'SEND_FOR_APPROVAL',
              userId: wf.userId,
              actorUserId: data.userWorkflow.userInfo.wid,
              serviceName: 'profile',
            }
            const listupdateFieldValues = JSON.parse(wf.updateFieldValues)
            req['applicationId'] = wf.applicationId
            req['wfId'] = wf.wfId
            req['updateFieldValues'] = listupdateFieldValues
            this.onApproveAllReqs(req)

            this.events.raiseInteractTelemetry(
              {
                type: TelemetryEvents.EnumInteractTypes.CLICK,
                subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
              },
              {
                id: wf.applicationId,
                type: TelemetryEvents.EnumIdtype.APPLICATION,
              }
            )
          })
        }

        if (index === datalength - 1) {
          setTimeout(() => {
            this.openSnackbar('All requests are Approved')
            this.fetchApprovals('')
            /* tslint:disable */
          }, 200)
        }
      })
    }
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackbar.open(primaryMsg, 'X', {
      duration,
    })
  }

  showButton() {
    this.disableApproveALL = true
  }

  retrieveCachedApprovals() {
    const cacheKey = `${this.currentFilter}DataCache`
    const cacheTimestampKey = `${this.currentFilter}CacheTimestamp`
    const cacheTotalRecordKey = `${this.currentFilter}TotalRecords`
    const cacheDuration = 5 * 60 * 1000

    const now = new Date().getTime()
    const cachedData = localStorage.getItem(cacheKey)
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey)
    this.totalTransfersRecords = localStorage.getItem('transfersTotalRecords')

    if (cachedData && cachedTimestamp) {
      const cacheAge = now - Number(cachedTimestamp)

      if (cacheAge < cacheDuration) {
        // Use cached data
        this.profileVerificationData = JSON.parse(cachedData)
        this.totalProfileVerificationRecords = localStorage.getItem(cacheTotalRecordKey)
        this.updateApproveAllStatus()
        return
      } else {
        // Fetch fresh data if cache is not available or expired
        this.fetchTransfers(this.limit)
      }
    }
  }

  retrieveCachedTransfers() {
    const cacheKey = `${this.currentFilter}DataCache`
    const cacheTimestampKey = `${this.currentFilter}CacheTimestamp`
    const cacheDuration = 5 * 60 * 1000 // 5 minutes in milliseconds
    this.totalTransfersRecords = localStorage.getItem('transfersTotalRecords')

    const now = new Date().getTime()
    const cachedData = localStorage.getItem(cacheKey)
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey)

    if (cachedData && cachedTimestamp) {
      const cacheAge = now - Number(cachedTimestamp)

      if (cacheAge < cacheDuration) {
        // Use cached data
        this.transfersData = JSON.parse(cachedData)
        return
      } else {
        // Fetch fresh data if cache is not available or expired
        this.fetchTransfers(this.limit)
      }
    }

  }
}