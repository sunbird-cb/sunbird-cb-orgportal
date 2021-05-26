import { Component, OnInit, SimpleChanges } from '@angular/core'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { MatPaginator } from '@angular/material'
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
/* tslint:disable */
import _ from 'lodash'
import { WorkallocationService } from '../../../home/services/workallocation.service'
import FileSaver from 'file-saver'
@Component({
  selector: 'ws-app-published-allocations',
  templateUrl: './published-allocations.component.html',
  styleUrls: ['./published-allocations.component.scss'],
})
export class PublishedAllocationsComponent implements OnInit {
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
  // p: number = 1;
  constructor(private exportAsService: ExportAsService,
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
    this.data = [
      {
        fullname: 'Latika Paharia',
        firstname: 'Latika',
        surname: 'Paharia',
        email: 'latika@test.com',
        roles: [
          {
            type: 'ROLE',
            id: 'RID001',
            name: 'Information Technology',
            description: 'Development and deployment of e-Office and training the employees',
            status: 'UNVERIFIED',
            childNodes: [
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Implementation of e-Office',
                description: 'Implementation of e-Office and training the employees on the implemeted solution',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              },
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Work related to committee of financial sector statistics',
                description: 'Work related to committee of financial sector statistics',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              }
            ],
          },
          {
            type: 'ROLE',
            id: 'RID001',
            name: 'Vigilance',
            description: 'Vigilance',
            status: 'UNVERIFIED',
            childNodes: [
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Regional rural bank',
                description: 'Implementation of e-Office ',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              },
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Agriculture credit',
                description: 'Implementation of e-Office ',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              },
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Cyber security related work',
                description: 'Implementation of e-Office ',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              }
            ],
          },
        ],
        userId: '2542352352523FF',
        position: 'Deputy director',
        phone: '3214567890',
        competencies: '',
        error: 'true'
      },
      {
        fullname: 'Joy Mathew',
        firstname: 'Joy',
        surname: 'Mathew',
        email: 'latika@test.com',
        roles: [
          {
            type: 'ROLE',
            id: 'RID001',
            name: 'Information Technology',
            description: 'Development and deployment of e-Office and training the employees',
            status: 'UNVERIFIED',
            childNodes: [
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Implementation of e-Office',
                description: 'Implementation of e-Office and training the employees on the implemeted solution',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              },
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Work related to committee of financial sector statistics',
                description: 'Work related to committee of financial sector statistics',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              }
            ],
          },
          {
            type: 'ROLE',
            id: 'RID001',
            name: 'Vigilance',
            description: 'Vigilance',
            status: 'UNVERIFIED',
            childNodes: [
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Regional rural bank',
                description: 'Implementation of e-Office ',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              },
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Agriculture credit',
                description: 'Implementation of e-Office ',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              },
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Cyber security related work',
                description: 'Implementation of e-Office ',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              }
            ],
          },
        ],
        userId: '2542352352523FF',
        position: 'Deputy director',
        phone: '3214567890',
        competencies: '',
      },
      {
        fullname: 'Rajesh Agarwal',
        firstname: 'Rajesh',
        surname: 'Agarwal',
        email: 'latika@test.com',
        roles: [
          {
            type: 'ROLE',
            id: 'RID001',
            name: 'Coordination',
            description: 'Development and deployment of e-Office and training the employees',
            status: 'UNVERIFIED',
            childNodes: [
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Work relating to financial inclusion',
                description: 'Implementation of e-Office and training the employees on the implemeted solution',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              },
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'e-Governance in all FIs and e-Payments in banking system',
                description: 'Work related to committee of financial sector statistics',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              }
            ],
          },
          {
            type: 'ROLE',
            id: 'RID001',
            name: 'Financial inclusion advisory',
            description: 'Vigilance',
            status: 'UNVERIFIED',
            childNodes: [
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Matters realted to payment regularly board',
                description: 'Implementation of e-Office ',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              },
              {
                type: 'ACTIVITY',
                id: 'AID001',
                name: 'Agriculture credit',
                description: 'Implementation of e-Office ',
                status: 'UNVERIFIED',
                source: 'ISTM',
                parentRole: 'RID001',
                submitTo: 'Rakesh Agarwal',
                submitFrom: 'Rakesh Agarwal'
              },
            ],
          },
        ],
        userId: '2542352352523FF',
        position: 'Joint secretary',
        phone: '3214567890',
        competencies: '',
      }
    ]

    this.getdeptUsers()
  }

  viewscanned() {
    const pdfName = 'Scanned'
    const pdfUrl = '/assets/files/scaned.pdf'
    FileSaver.saveAs(pdfUrl, pdfName)
  }

  print() {
    const pdfName = 'Published'
    const pdfUrl = '/assets/files/published.pdf'
    FileSaver.saveAs(pdfUrl, pdfName)
  }

  // Download format
  export() {
    this.exportAsService.save(this.config, 'WorkAllocation').subscribe(() => {
      // save started
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
      // this.filter(statusKey)
    })
    //}
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnChanges(data: SimpleChanges) {
    this.data = _.get(data, 'data.currentValue')
    this.length = this.data.length
    this.paginator.firstPage()
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
