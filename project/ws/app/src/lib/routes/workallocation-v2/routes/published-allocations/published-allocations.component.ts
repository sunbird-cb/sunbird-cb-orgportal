import { Component, OnInit, SimpleChanges } from '@angular/core'
import { MatPaginator } from '@angular/material'
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
/* tslint:disable */
import _ from 'lodash'
import { AllocationService } from '../../services/allocation.service'
import FileSaver from 'file-saver'
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'ws-app-published-allocations',
  templateUrl: './published-allocations.component.html',
  styleUrls: ['./published-allocations.component.scss'],
})
export class PublishedAllocationsComponent implements OnInit {
  tabs: any
  currentUser!: string | null
  data: any = []
  term!: string | null
  length!: number
  pageSize = 10
  pageSizeOptions = [5, 10, 20]
  paginator!: MatPaginator
  departmentName: any
  departmentID: any
  bdtitles = [{ title: 'Work allocation tool', url: '/app/home/workallocation' },
  { title: 'Published', url: '/app/home/workallocation' }]

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'downloadtemplate',
  }
  userslist: any[] = []
  downloaddata: any = []
  totalusersCount: any
  workorderID: any
  workorderData: any
  p: number = 1
  constructor(private activated: ActivatedRoute, private exportAsService: ExportAsService,
    private allocateSrvc: AllocationService) {
    this.activated.params.subscribe((param: any) => {
      this.workorderID = param['workorders'] || ''
      this.getAllocatedUsers(this.workorderID)
    })
  }

  ngOnInit() {
    // this.getdeptUsers()
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

  // getdeptUsers() {
  //   this.workallocationSrvc.getAllUsers().subscribe(res => {
  //     this.departmentName = res.deptName
  //     this.departmentID = res.id
  //     this.getAllUsers('Draft')
  //   })
  // }

  // getAllUsers(statusKey: string) {
  //   const req = {
  //     pageNo: 0,
  //     pageSize: 1000,
  //     departmentName: this.departmentName,
  //     status: (statusKey !== '') ? statusKey : "Draft",
  //   }
  //   //if (this.currentFilter !== statusKey) {
  //   this.workallocationSrvc.getUsers(req).subscribe(res => {
  //     this.userslist = res.result.data
  //     this.totalusersCount = res.result.totalhit
  //     // this.filter(statusKey)
  //   })
  //   //}
  // }

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

  getAllocatedUsers(woId: any) {
    this.allocateSrvc.getAllocatedUsers(woId).subscribe((res: any) => {
      this.workorderData = res.result.data
      const newbdtitle = { title: this.workorderData.name, url: 'none' }
      this.bdtitles.push(newbdtitle)
      this.data = this.workorderData.users
    })
  }
}
