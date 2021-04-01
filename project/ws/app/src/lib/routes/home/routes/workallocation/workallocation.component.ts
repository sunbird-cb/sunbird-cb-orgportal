import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { ITableData } from '@sunbird-cb/collection'
import { MatPaginator } from '@angular/material'
import { Router } from '@angular/router'
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
/* tslint:disable */
import _ from 'lodash'
import { WorkallocationService } from '../../services/workallocation.service'

@Component({
  selector: 'ws-app-workallocation',
  templateUrl: './workallocation.component.html',
  styleUrls: ['./workallocation.component.scss'],
})
export class WorkallocationComponent implements OnInit, OnDestroy  {
  currentFilter = 'active'
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
    options: {
      jsPDF: {
        orientation: 'landscape',
      },
      // pdfCallbackFn: this.pdfCallbackFn, // to add header and footer
    },
  }
  userslist: any[] = []
  downloaddata: any = []

  ngOnDestroy() {
    if (this.tabs) {
      this.tabs.unsubscribe()
    }
  }

  constructor(private exportAsService: ExportAsService, private router: Router,
              private workallocationSrvc: WorkallocationService) { }

  ngOnInit() {
    this.tabledata = {
      actions: [],
      columns: [
        { displayName: 'Full Name', key: 'fullname' },
        { displayName: 'Roles', key: 'roles' },
        { displayName: 'Activities', key: 'activities' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'fullName',
      sortState: 'asc',
      needUserMenus: true,
    }
    this.getdeptUsers()
  }

  // Download format
  export() {
    // download the file using old school javascript method
    this.exportAsService.save(this.config, 'WorkAllocation').subscribe(() => {
      // save started
    })
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    // this.exportAsService.get(this.config).subscribe(content => {
    //   console.log(content)
    // })
  }

  pdfCallbackFn (pdf: any) {
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
      this.getAllUsers()
    })
  }

  getAllUsers() {
    const req = {
      pageNo : 0,
      pageSize : 20,
      departmentName : this.departmentName,
    }
    this.workallocationSrvc.getUsers(req).subscribe(res => {
      this.userslist = res.result.data
      this.filter(this.currentFilter)
    })
  }

  filter(key: string) {
    const activeUsersData: any[] = []
    const archiveUsersData: any[] = []

    if (this.userslist && this.userslist.length > 0) {
      this.userslist.forEach((user: any) => {
        if (user.allocationDetails.activeList.length > 0) {
          activeUsersData.push({
            fullname: user.allocationDetails.userName,
            email: user.allocationDetails.userEmail,
            roles: user.allocationDetails.activeList,
            userId: user.allocationDetails.userId,
            position: user.allocationDetails.userPosition,
            phone: user.userDetails ? user.userDetails.phone : '',
          })
        }
        if (user.allocationDetails.archivedList.length > 0) {
          archiveUsersData.push({
            fullname: user.allocationDetails.userName,
            email: user.allocationDetails.userEmail,
            roles: user.allocationDetails.archivedList,
            userId: user.allocationDetails.userId,
            position: user.allocationDetails.userPosition,
            phone: user.userDetails ? user.userDetails.phone : '',
          })
        }
      })
    }

    if (key) {
      this.currentFilter = key
      switch (key) {
        case 'active':
          this.data = activeUsersData
          break
        case 'archived':
          this.data = archiveUsersData
          break
        default:
          this.data = activeUsersData
          break
      }
    }

    this.length = this.data.length
    // this.paginator.firstPage()
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
    this.router.navigate([`/app/workallocation/create`])
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
