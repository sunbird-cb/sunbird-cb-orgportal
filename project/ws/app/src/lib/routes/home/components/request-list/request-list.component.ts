import { Component, OnInit } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { ProfileV2Service } from '../../services/home.servive'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material'
import { ConfirmationBoxComponent } from '../../../training-plan/components/confirmation-box/confirmation.box.component'
import { AssignListPopupComponent } from './assign-list-popup/assign-list-popup.component'
import { LoaderService } from '../../../../../../../../../src/app/services/loader.service'
/* tslint:disable */
import _ from 'lodash'
import { SingleAssignPopupComponent } from './single-assign-popup/single-assign-popup.component'
/* tslint:enable */
export enum statusValue {
  Assigned = 'Assigned',
  Unassigned = 'Unassigned',
  Inprogress = 'InProgress',
  invalid = 'Invalid',
  fullfill = 'Fulfill',
}
@Component({
  selector: 'ws-app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {
  tabledata: ITableData = {
    columns: [
      { displayName: 'Request Id', key: 'demand_id' },
      { displayName: 'Title', key: 'title' },
      // { displayName: 'Requestor', key: 'batchesCount' },
      { displayName: 'Request Type', key: 'requestType' },
      { displayName: 'Request Status', key: 'status' },
      { displayName: 'Assignee', key: 'assignedProvider' },
      { displayName: 'Requested On', key: 'createdOn' },
      // { displayName: 'Interest', key: 'batchesCount' },
    ],
    needCheckBox: false,
    needHash: false,
    sortColumn: 'fullname',
    sortState: 'asc',
    needUserMenus: false,
    actions: [],
    actionColumnName: 'Action',
    cbpPlanMenu: true,
  }
  getTableData: any[] = []
  requestListData: any
  assignProvider: any
  pageConfig: any
  configSvc: any
  dialogRef: any
  queryParams: any
  pageNo = 0
  pageSize = 10
  requestCount: any
  invalidRes: any
  detailsEvent: any
  dataSource: any
  displayedColumns: string[] = ['RequestId', 'title', 'requestor', 'requestType',
    'requestStatus', 'assignee', 'requestedOn', 'interests', 'action']
  statusKey = statusValue
  fullProfile: any
  rootOrgId: any
  constructor(private sanitizer: DomSanitizer,
              private homeService: ProfileV2Service,
              private datePipe: DatePipe,
              private activeRoute: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private snackBar: MatSnackBar,
              private loaderService: LoaderService,
  ) { }
  requestList: any[] = [
    `You can request new content by filling out the request form. You will have the option to choose your content provider and
     if you are unsure then you can choose the option as broadcast your request.`,
    `Please review the interest received from various providers and assign
      to the provider of your choice among the list.`,
    `You can mark any unassigned request to invalid by choosing the
      "Mark as Invalid" option. Similarly, you can "Re-Assign" any request that is
      currently in "Assigned" status by selecting the "Re-Assign" option.`,
    `You can copy an existing request and make necessary modifications to create a new content request`,
  ]

  ngOnInit() {
    this.configSvc = this.activeRoute.snapshot.data['configService']
    this.fullProfile = _.get(this.activeRoute.snapshot, 'data.configService')
    if (this.fullProfile && this.fullProfile.userProfile && this.fullProfile.userProfile.rootOrgId) {
      this.rootOrgId = this.fullProfile.userProfile.rootOrgId
    }
    this.getRequestList()
    this.pageConfig = this.activeRoute.snapshot.data['pageData']
    this.hasAccess()
    // this.tableData =

  }

  openVideoPopup() {

  }

  handleClick(element: any): void {
    if (element.status && element.status.length > 0) {
      if (element.status !== this.statusKey.Inprogress &&
        element.status !== this.statusKey.invalid &&
        element.status !== this.statusKey.fullfill) {
        this.onClickMenu(element, 'assignContent')
      }
    }

  }

  getPointerEventsStyle(element: any) {
    return {
      'pointer-events': (element.status !== this.statusKey.Inprogress &&
        element.status !== this.statusKey.invalid &&
        element.status !== this.statusKey.fullfill) ? 'auto' : 'none',
    }
  }

  hasAccess() {
    let flag = false
    if (this.pageConfig && this.pageConfig.data && this.pageConfig.data.actionMenu) {
      this.pageConfig.data.actionMenu.map((_v: any) => {
        flag = false
        _v.enabledFor.forEach((ele: any) => {
          if (this.configSvc.userRoles.has(ele)) {
            flag = true
            if (ele === 'mdo_leader') {
              _v.isMdoLeader = true
            }
            if (ele === 'mdo_admin') {
              _v.isMdoAdmin = true
            }
          }
        })
        _v.userAccess = flag
      })
    }
  }

  onClickMenu(item: any, action: string) {
    switch (action) {
      case 'viewContent':

        this.queryParams = {
          id: item.demand_id,
          name: 'view',
        }
        this.router.navigate(['/app/home/create-request-form'], { queryParams: this.queryParams })
        break
      case 'invalidContent':
        this.showConformationModal(item, action)
        break
      case 'assignContent':
        this.openAssignlistPopup(item)
        break
      case 'reAssignContent':
        if (item.requestType === 'Broadcast') {
          this.openAssignlistPopup(item)
        } else {
          this.openSingleReassignPopup(item)
        }
        // else {
        //   this.queryParams = {
        //     id: item.demand_id,
        //     name: 'reassign',
        //   }
        //     this.router.navigate(['/app/home/create-request-form'], { queryParams: this.queryParams })
        // }

        break
      case 'copyContent':
        this.queryParams = {
          id: item.demand_id,
          name: 'copy',
        }
        this.router.navigate(['/app/home/create-request-form'], { queryParams: this.queryParams })
        break
    }

  }

  onChangePage(event: any) {
    this.pageNo = event.pageIndex
    this.pageSize = event.pageSize
    this.getRequestList()
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Unassigned':
        return 'status-unassigned'
      case 'Assigned':
        return 'status-assigned'
      case 'Invalid':
        return 'status-invalid'
      case 'Fulfill':
        return 'status-fullfill'
      case 'InProgress':
        return 'status-inprogress'
      default:
        return ''
    }
  }

  showConformationModal(_selectedRow: any, _type: any) {
    this.dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      disableClose: true,
      data: {
        type: 'conformation',
        icon: 'radio_on',
        title: (_type === 'invalidContent') ? 'Are you sure you want to mark this as invalid.' :
          (_type === 'publishContent') ? 'Are you sure you want to publish the plan?' : '',
        subTitle: '',
        primaryAction: 'Yes',
        secondaryAction: 'No',
      },
      autoFocus: false,
    })

    this.dialogRef.afterClosed().subscribe((_res: any) => {
      if (_res === 'confirmed') {
        if (_type === 'invalidContent') {
          this.invalidContent(_selectedRow)
        }
        //  else if (_type === 'publishContent') {
        //   this.publishContentData(_selectedRow)
        // }
      }
    })
  }

  invalidContent(row: any) {
    const request = {
      demand_id: row.demand_id,
      newStatus: 'Invalid',
    }
    this.homeService.markAsInvalid(request).subscribe(res => {
      this.invalidRes = res
      if (res) {
        setTimeout(() => {
          this.getRequestList()
        },         1000)
      }

      this.snackBar.open('Marked as Invalid')
    }
    )

  }

  openAssignlistPopup(item: any) {
    this.dialogRef = this.dialog.open(AssignListPopupComponent, {
      disableClose: false,
      width: '90%',
      height: '70vh',
      data: item,
      autoFocus: false,
    })

    this.dialogRef.afterClosed().subscribe((_res: any) => {
      if (_res && _res.data === 'confirmed') {
        setTimeout(() => {
          this.getRequestList()
        },         1000)
        this.snackBar.open('Assigned submitted Successfully')
      } else {
        // this.snackBar.open('error')
      }
    })
  }

  openSingleReassignPopup(item: any) {
    this.dialogRef = this.dialog.open(SingleAssignPopupComponent, {
      disableClose: false,
      width: '90%',
      height: '70vh',
      data: item,
      autoFocus: false,
    })

    this.dialogRef.afterClosed().subscribe((_res: any) => {
      if (_res && _res.data === 'confirmed') {
        setTimeout(() => {
          this.getRequestList()
        },         1000)

        this.snackBar.open('Re-assign submitted Successfully')
      } else {
        // this.snackBar.open('error')
      }
    })
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

  getRequestList() {
    this.loaderService.changeLoaderState(true)
    const request = {
      filterCriteriaMap: {
        rootOrgId: this.rootOrgId ? this.rootOrgId : '',
      },
      requestedFields: [],
      facets: [],
      pageNumber: this.pageNo,
      pageSize: this.pageSize,
      orderBy: 'createdOn',
      orderDirection: 'ASC',
    }
    this.homeService.getRequestList(request).subscribe(res => {
      if (res) {
        this.requestListData = res.data
        if (this.requestListData) {
          this.loaderService.changeLoaderState(false)
          this.requestCount = res.totalCount
          this.requestListData.map((data: any) => {
            if (data.createdOn) {
              data.createdOn = this.datePipe.transform(data.createdOn, 'MMM d, y')
            }
            if (data.assignedProvider) {
              data.assignedProvider = data.assignedProvider.providerName
            }
          })
          this.dataSource = new MatTableDataSource<any>(this.requestListData)

        }
      }

    })

  }

  viewDetails(e: any) {
    this.detailsEvent = e
  }

}
