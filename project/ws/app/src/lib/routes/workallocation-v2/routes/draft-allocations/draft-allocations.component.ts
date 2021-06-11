import { Component, OnInit, SimpleChanges } from '@angular/core'
import { MatPaginator, MatDialog, MatDialogConfig } from '@angular/material'
import { Router, ActivatedRoute } from '@angular/router'
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
/* tslint:disable */
import _ from 'lodash'
import { PublishPopupComponent } from '../../components/publish-popup/publish-popup.component'
import { AllocationService } from '../../services/allocation.service'
import FileSaver from 'file-saver'
@Component({
  selector: 'ws-app-draft-allocations',
  templateUrl: './draft-allocations.component.html',
  styleUrls: ['./draft-allocations.component.scss'],
})
export class DraftAllocationsComponent implements OnInit {
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
  { title: 'Drafts', url: '/app/home/workallocation' }]

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'downloadtemplate',
  }
  userslist: any[] = []
  downloaddata: any = []
  totalusersCount: any
  statscount: any = {}
  queryParams: any
  workorderID: any
  workorderData: any
  p: number = 1
  constructor(private activated: ActivatedRoute, private exportAsService: ExportAsService, private router: Router,
    public dialog: MatDialog, private allocateSrvc: AllocationService) {
    this.activated.queryParamMap.subscribe((queryParams: any) => {
      if (queryParams.has('status')) {
        this.queryParams = queryParams.get('status') || ''
      }
    })
    this.activated.params.subscribe((param: any) => {
      this.workorderID = param['workorder'] || ''
      this.getAllocatedUsers(this.workorderID)
    })
  }

  ngOnInit() {
    // this.getdeptUsers()
  }

  // Download format
  export() {
    // this.exportAsService.save(this.config, 'WorkAllocation').subscribe(() => {
    // save started
    // })
    const pdfName = 'Draft'
    const pdfUrl = '/assets/files/draft.pdf'
    FileSaver.saveAs(pdfUrl, pdfName)
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

  // viewAllocation(data: any) {
  //   this.router.navigate([`/app/workallocation/details/${data.userId}`])
  // }

  onNewAllocationClick() {
    this.router.navigate([`/app/workallocation/create`, this.workorderID])
  }

  publishWorkOrder() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    dialogConfig.width = '77%'
    dialogConfig.height = '78%'
    dialogConfig.maxHeight = 'auto'
    dialogConfig.data = {
      data: this.workorderData
    }

    this.dialog.open(PublishPopupComponent, dialogConfig)
  }

  getAllocatedUsers(woId: any) {
    this.allocateSrvc.getAllocatedUsers(woId).subscribe((res: any) => {
      this.workorderData = res.result.data
      const newbdtitle = { title: this.workorderData.name, url: 'none' }
      this.bdtitles.push(newbdtitle)
      this.data = this.workorderData.users
    })
  }
  edit(id: string) {
    this.router.navigate(['/app/workallocation/update/', this.workorderID, id])
  }
}
