import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { MatDialog, MatPaginator } from '@angular/material'
import { Router } from '@angular/router'
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
/* tslint:disable */
import _ from 'lodash'
import { WorkallocationService } from '../../services/workallocation.service'
import { WorkAllocationPopUpComponent } from '../../../../head/work-allocation-table/work-order-popup/pop-up.component'
import FileSaver from 'file-saver'

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
  pageSizeOptions = [5, 10, 20]
  paginator!: MatPaginator
  departmentName: any
  departmentID: any

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'downloadtemplate',
  }
  userslist: any[] = []
  downloaddata: any = []
  totalusersCount: any
  p: number = 1;

  ngOnDestroy() {
    if (this.tabs) {
      this.tabs.unsubscribe()
    }
  }

  constructor(private exportAsService: ExportAsService, private router: Router,
    private workallocationSrvc: WorkallocationService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.tabledata = {
      actions: [],
      columns: [
        { displayName: 'Work orders', key: 'workorders' },
        { displayName: 'Officers', key: 'officers' },
        { displayName: 'Last upladed on', key: 'lastupdatedon' },
        { displayName: 'Last upladed by', key: 'lastupdatedby' },

      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'workorders',
      sortState: 'asc',
      needUserMenus: true,
    }
    this.userslist = [
      {
        allocationDetails: {
          id: 2,
          workorders: "Work order division 1",
          officers: "12",
          lastupdatedon: "03:30 PM 18 May  2021",
          lastupdatedby: "Garima Joshi",
          publishedon: "03:30 PM 18 May  2021",
          publishedby: "Manjunatha HS",
          errors: "11",
          approval: "Download",
          fromdata: 'draft',
        }
      },
      {
        allocationDetails: {
          id: 2,
          workorders: "Work order division 1",
          officers: "12",
          lastupdatedon: "03:30 PM 18 May  2021",
          lastupdatedby: "Manjunatha HS",
          publishedon: "03:30 PM 18 May  2021",
          publishedby: "Manjunatha HS",
          errors: "11",
          approval: "Download",
          fromdata: 'draft',
        }
      },

    ]

    console.log(this.tabledata)
    this.filter("Draft")
  }

  // Download format
  export() {
    // download the file using old school javascript method
    // this.exportAsService.save(this.config, 'WorkAllocation').subscribe(() => {
    //   // save started
    // })
    console.log(this.currentFilter)
    if (this.currentFilter === 'Draft') {
      const pdfName = 'draft'
      const pdfUrl = 'http://127.0.0.1:8080/client-assets/assets/configurations/localhost_3000/files/draft.pdf'
      FileSaver.saveAs(pdfUrl, pdfName)
    } else if (this.currentFilter === 'Published') {
      const pdfName = 'publish'
      const pdfUrl = 'http://127.0.0.1:8080 /client-assets/assets/configurations/localhost_3000/files/published.pdf'
      FileSaver.saveAs(pdfUrl, pdfName)
    }


    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    // this.exportAsService.get(this.config).subscribe(content => {
    //   console.log(content)
    // })
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
      this.departmentName = res.deptName
      this.departmentID = res.id
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
  onRoleClick() {

  }

  filter(key: string) {
    if (key === 'Published') {
      this.tabledata['columns'][2] = { displayName: 'Published on', key: 'publishedon' }
      this.tabledata['columns'][3] = { displayName: 'Published by', key: 'publishedby' }
      this.tabledata['columns'][4] = { displayName: 'Approval', key: 'approval' }
    } else {
      this.tabledata['columns'][2] = {
        displayName: "Last upladed on",
        key: "lastupdatedon"
      }
      this.tabledata['columns'][3] = {
        displayName: "Last upladed by",
        key: "lastupdatedby"
      }
      this.tabledata['columns'][4] = { displayName: 'Errors', key: 'errors' }

    }
    const activeUsersData: any[] = []
    const archiveUsersData: any[] = []
    const draftUsersData: any[] = []
    if (this.userslist && this.userslist.length > 0) {
      this.userslist.forEach((user: any) => {
        console.log(user.allocationDetails)
        if (key === 'Published') {
          if (user.allocationDetails.id !== undefined) {
            activeUsersData.push({
              workorders: user.allocationDetails.workorders,
              officers: user.allocationDetails.officers,
              lastupdatedon: user.allocationDetails.lastupdatedon,
              lastupdatedby: user.allocationDetails.lastupdatedby,
              errors: user.allocationDetails.errors,
              publishedon: user.allocationDetails.publishedon,
              publishedby: user.allocationDetails.publishedby,
              approval: user.allocationDetails.approval,
              fromdata: 'published',

            })
          }
        } else if (key === 'Draft') {
          if (user.allocationDetails.id !== undefined) {
            draftUsersData.push({
              workorders: user.allocationDetails.workorders,
              officers: user.allocationDetails.officers,
              lastupdatedon: user.allocationDetails.lastupdatedon,
              lastupdatedby: user.allocationDetails.lastupdatedby,
              errors: user.allocationDetails.errors,
              competencies: user.allocationDetails.competencies,
              publishedon: user.allocationDetails.publishedon,
              publishedby: user.allocationDetails.publishedby,
              approval: user.allocationDetails.approval,
              fromdata: 'draft',
            })
          }
        } else {
          if (user.allocationDetails.id !== undefined) {
            archiveUsersData.push({
              workorders: user.allocationDetails.workorders,
              officers: user.allocationDetails.officers,
              lastupdatedon: user.allocationDetails.lastupdatedon,
              lastupdatedby: user.allocationDetails.lastupdatedby,
              errors: user.allocationDetails.errors,
              competencies: user.allocationDetails.competencies,
              publishedon: user.allocationDetails.publishedon,
              publishedby: user.allocationDetails.publishedby,
              approval: user.allocationDetails.approval,
              fromdata: 'archive',
            })
          }
        }
      })
    }

    if (key) {
      this.currentFilter = key
      switch (key) {
        case 'Draft':
          this.data = draftUsersData
          break
        case 'Published':
          this.data = activeUsersData
          break
        case 'Archived':
          this.data = archiveUsersData
          break
        default:
          this.data = draftUsersData
          break
      }
    }
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
      maxHeight: 'auto',
      height: '65%',
      width: '80%',
      panelClass: 'remove-pad',
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      console.log(response)


    })
  }

  viewAllocation(data: any) {
    this.router.navigate([`/app/workallocation/details/${data.userId}`])
  }

  buttonClick(action: string, row: any) {
    this.downloaddata = []
    if (action === 'Download') {
      console.log('row data', row)
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
}
