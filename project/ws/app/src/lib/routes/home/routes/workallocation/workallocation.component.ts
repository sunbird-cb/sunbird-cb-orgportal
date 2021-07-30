import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { MatDialog, MatPaginator } from '@angular/material'
import { Router, ActivatedRoute } from '@angular/router'
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
/* tslint:disable */
import _ from 'lodash'
import { WorkallocationService } from '../../services/workallocation.service'
import { WorkAllocationPopUpComponent } from '../../../../head/work-allocation-table/work-order-popup/pop-up.component'

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
  departmentName: any
  departmentID: any
  selectedPDFid: any
  searchQuery!: string

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'downloadtemplate',
  }
  userslist: any[] = []
  downloaddata: any = []
  totalusersCount: any
  p: number = 1;
  isPrint = false


  ngOnDestroy() {
    if (this.tabs) {
      this.tabs.unsubscribe()
    }
  }

  constructor(private exportAsService: ExportAsService, private router: Router, private wrkAllocServ: WorkallocationService,
    private workallocationSrvc: WorkallocationService, private activeRoute: ActivatedRoute,
    public dialog: MatDialog) {
    const paramsMap = this.activeRoute.snapshot.params.tab
    if (paramsMap === 'Published') {
      this.currentFilter = 'Published'
    } else {
      this.currentFilter = 'Draft'
    }
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
    this.filter("Draft")
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
  }
  getWAT(currentStatus: string) {
    this.data = []
    const finalData: any[] = []
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
    })

  }

  getWATBySearch(searchQuery: string, currentStatus: string) {
    this.data = []
    const finalData: any[] = []
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
}
