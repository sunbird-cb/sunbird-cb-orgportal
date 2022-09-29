import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { MatDialog, MatPaginator } from '@angular/material'
import { Router, ActivatedRoute } from '@angular/router'
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
/* tslint:disable */
import _ from 'lodash'
import { WorkallocationService } from '../../services/workallocation.service'
import { WorkAllocationPopUpComponent } from '../../../../head/work-allocation-table/work-order-popup/pop-up.component'
import { EventService } from '@sunbird-cb/utils'
import { NsContent } from '@sunbird-cb/collection'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'

@Component({
  selector: 'ws-app-workallocation',
  templateUrl: './workallocation.component.html',
  styleUrls: ['./workallocation.component.scss'],
})
export class WorkallocationComponent implements OnInit, OnDestroy {
  currentFilter = 'Draft'
  tabs: any
  currentUser!: string | null
  tabledata!: ITableData
  data: any = []
  term!: string | null
  length!: number
  pageSize = 10
  pageSizeOptions = [10, 20]
  paginator!: MatPaginator
  showLoading: boolean = false
  departmentName: any
  departmentID: any
  selectedPDFid: any
  searchQuery!: string
  publishUrl = "app/home/workallocation/published"
  draftUrl = "app/home/workallocation/draft"
  currentUrl: any

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'downloadtemplate',
  }
  userslist: any[] = []
  downloaddata: any = []
  totalusersCount: any
  p: number = 1;
  isPrint = false
  content: NsContent.IContent = {} as NsContent.IContent
  configSvc: any


  ngOnDestroy() {
    // if (this.tabs) {
    //   this.tabs.unsubscribe()
    // }
  }

  constructor(private exportAsService: ExportAsService, private router: Router, private wrkAllocServ: WorkallocationService,
    private workallocationSrvc: WorkallocationService, private activeRoute: ActivatedRoute, private events: EventService, private route: ActivatedRoute,
    public dialog: MatDialog, public eventSvc: EventService) {
    // this.configSvc = this.route.parent && this.route.parent.snapshot.data.configService
    // const paramsMap = this.activeRoute.snapshot.params.tab
    // console.log(paramsMap, '-paramsMap====')
    // if (paramsMap === 'published') {
    //   this.currentUrl = "app/home/workallocation/published"
    //   this.currentFilter = 'Published'
    //   console.log(this.currentUrl, 'this.currentUrl published==========')
    //   console.log(paramsMap, '- published paramsMap====')
    // }
    // if (paramsMap === 'draft') {
    //   this.currentUrl = "app/home/workallocation/draft"
    //   this.currentFilter = 'Draft'
    //   console.log(this.currentUrl, 'this.currentUrl draft ==========')
    //   console.log(paramsMap, '- draft paramsMap====')
    // }
  }

  ngOnInit() {
    // this.getdeptUsers()
    this.tabledata = {
      actions: [],
      columns: [
        { displayName: 'Work order', key: 'workorders' },
        { displayName: 'Officers', key: 'officers' },
        { displayName: 'Last updated on', key: 'lastupdatedon' },
        { displayName: 'Last updated by', key: 'lastupdatedby' },

      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'workorders',
      sortState: 'asc',
      needUserMenus: true,
    }
    this.configSvc = this.route.parent && this.route.parent.snapshot.data.configService
    const paramsMap = this.activeRoute.snapshot.params.tab
    if (paramsMap === 'published') {
      this.currentUrl = "app/home/workallocation/published"
      this.currentFilter = 'Published'
      this.filter("Published")

    }
    if (paramsMap === 'draft') {
      this.currentUrl = "app/home/workallocation/draft"
      this.currentFilter = 'Draft'
      this.filter("Draft")
    }
    if (paramsMap === 'archived') {
      this.currentUrl = "app/home/workallocation/archived"
      this.currentFilter = 'Archived'
      this.filter("Archived")

    }




  }

  get getTableData() {
    return this.data

  }
  // Download format
  export() {
    this.wrkAllocServ.getPDF(this.selectedPDFid).subscribe(response => {
      const file = new Blob([response], { type: 'application/pdf' })
      const fileURL = URL.createObjectURL(file)
      window.open(fileURL)
    })

    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.PRINT_BTN,
      }, {
      id: this.selectedPDFid,
      type: TelemetryEvents.EnumIdtype.PDF
    }
    )
  }

  pdfCallbackFn(pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages()
    // tslint:disable-next-line:no-increment-decrement
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i)
      // tslint:disable-next-line:prefer-template
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30)
    }
  }

  getdeptUsers() {
    this.workallocationSrvc.getAllUsers().subscribe(res => {
      this.departmentName = res.result.response.channel
      this.departmentID = res.result.response.rootOrgId
      this.getAllUsers('Draft')
    })
  }

  getAllUsers(statusKey: string) {
    const req = {
      pageNo: 0,
      pageSize: 1000,
      departmentName: this.departmentName,
      status: (statusKey !== '') ? statusKey : "Draft",

    }
    //if (this.currentFilter !== statusKey) {
    this.workallocationSrvc.getUsers(req).subscribe(res => {
      this.userslist = res.result.data
      this.totalusersCount = res.result.totalhit
      this.filter(statusKey)
    })
    //}
  }
  onRoleClick(element: any) {
    if (element) {
      this.selectedPDFid = element.id
      this.isPrint = true
    }

    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.CARD_CONTENT,
        id: TelemetryEvents.EnumIdtype.WORK_ORDER_ROW
        ,
      }, {
      id: element.id,
      type: TelemetryEvents.EnumIdtype.WORK_ORDER
    }
    )

  }

  filter(key: string) {
    this.isPrint = false
    if (key === 'Published') {
      this.tabledata['columns'][2] = { displayName: 'Published on', key: 'lastupdatedon' }
      this.tabledata['columns'][3] = { displayName: 'Published by', key: 'lastupdatedby' }
      this.tabledata['columns'][4] = { displayName: 'Approval', key: 'approval' }
    } else {
      this.tabledata['columns'][2] = {
        displayName: "Last updated on",
        key: "lastupdatedon"
      }
      this.tabledata['columns'][3] = {
        displayName: "Last updated by",
        key: "lastupdatedby"
      }
      this.tabledata['columns'][4] = { displayName: 'Errors', key: 'errors' }
    }
    if (key) {
      this.currentFilter = key
      switch (key) {
        case 'Draft':
          this.getWAT('Draft')
          break
        case 'Published':
          this.getWAT('Published')
          break
        case 'Archived':
          this.getWAT('Published')
          break
        default:
          this.getWAT('Draft')
          break
      }
    }
    // this.events.raiseInteractTelemetry(
    //   {
    //     type: TelemetryEvents.EnumInteractTypes.CLICK,
    //     subType: TelemetryEvents.EnumInteractSubTypes.TAB_CONTENT,
    //   }, {}
    // )

  }

  public tabTelemetry(label: string, index: number) {
    const data: TelemetryEvents.ITelemetryTabData = {
      label,
      index,
    }
    this.eventSvc.handleTabTelemetry(
      TelemetryEvents.EnumInteractSubTypes.WORK_ALLOCATION_TAB,
      data,
    )
  }
  getWAT(currentStatus: string) {
    this.data = []
    const finalData: any[] = []
    this.displayLoader(true)
    this.workallocationSrvc.fetchWAT(currentStatus).subscribe(res => {
      if (res.result.data) {
        res.result.data.forEach((element: any) => {
          const watData = {
            id: element.id,
            workorders: element.name,
            officers: (element.userIds && element.userIds.length) || 0,
            lastupdatedon: this.workallocationSrvc.getTime(element.updatedAt),
            lastupdatedby: element.updatedByName,
            errors: element.errorCount,
            publishedon: this.workallocationSrvc.getTime(element.createdAt),
            publishedby: element.createdByName,
            approval: "Download",
            fromdata: currentStatus,
            publishedPdfLink: element.publishedPdfLink,
            signedPdfLink: element.signedPdfLink

          }
          finalData.push(watData)
        })
      }
      this.data = finalData
      this.displayLoader(false)
    }, () => {
      this.displayLoader(false)
    })

  }

  getWATBySearch(searchQuery: string, currentStatus: string) {
    this.data = []
    const finalData: any[] = []
    this.displayLoader(true)
    this.workallocationSrvc.fetchAllWATRequestBySearch(searchQuery, currentStatus).subscribe(res => {
      if (res.result.data) {
        res.result.data.forEach((element: any) => {
          const watData = {
            id: element.id,
            workorders: element.name,
            officers: (element.userIds && element.userIds.length) || 0,
            lastupdatedon: this.workallocationSrvc.getTime(element.updatedAt),
            lastupdatedby: element.updatedByName,
            errors: element.errorCount,
            publishedon: this.workallocationSrvc.getTime(element.createdAt),
            publishedby: element.createdByName,
            approval: "Approval",
            fromdata: currentStatus,
            publishedPdfLink: element.publishedPdfLink,
            signedPdfLink: element.signedPdfLink


          }
          finalData.push(watData)
        })
      }
      this.data = finalData
      this.displayLoader(false)
    }, () => {
      this.displayLoader(false)
    })

  }
  getUserByWID(wid: string) {
    this.workallocationSrvc.fetchUserByWID(wid).subscribe(res => {
      const fullName = res.result.data
      if (fullName) {
        return fullName.first_name + " " + fullName.last_name
      } else {
        return "Loading.."
      }
    })
    return "Loading.."
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnChanges(data: SimpleChanges) {
    this.data = _.get(data, 'data.currentValue')
    this.length = this.data.length
    this.paginator.firstPage()
  }

  applyFilter(filterValue: any) {
    if (filterValue) {
      let fValue = filterValue.trim()
      fValue = filterValue.toLowerCase()
      this.data.filter = fValue
    } else {
      this.data.filter = ''
    }
  }

  onNewAllocationClick() {
    // this.router.navigate([`/app/workallocation/create`])
    const dialogRef = this.dialog.open(WorkAllocationPopUpComponent, {
      height: 'auto',
      minHeight: '60%',
      width: '80%',
    })
    dialogRef.afterClosed().subscribe(() => {
      this.getWAT(this.currentFilter)
    })
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.NEW_BTN,
      }, {}
    )
  }

  viewAllocation(data: any) {
    this.router.navigate([`/app/workallocation/details/${data.userId}`])
  }

  buttonClick(action: string, row: any) {
    this.downloaddata = []
    if (action === 'Download') {
      this.downloaddata.push(row)
      this.exportAsService.save(this.config, 'WorkAllocation').subscribe(() => {
        // save started
      })
    } else if (action === 'Archive') {
      // const index = this.ralist.indexOf(row)
      // if (index >= 0) {
      //   this.ralist.splice(index, 1)
      // }
      // row.isArchived = true
      // this.archivedlist.push(row)
    }
  }
  searchBasedOnQurey(newValue: Event) {
    this.getWATBySearch(newValue.toString(), this.currentFilter)

  }

  displayLoader(value: any) {
    // tslint:disable-next-line:no-non-null-assertion
    const vart = document.getElementById('loader')!
    if (value) {
      vart.style.display = 'block'
    } else {
      vart.style.display = 'none'
    }
  }
}
