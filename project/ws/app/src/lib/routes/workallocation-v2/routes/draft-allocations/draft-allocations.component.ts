import { Component, OnInit, SimpleChanges } from '@angular/core'
import { MatPaginator, MatDialog, MatDialogConfig } from '@angular/material'
import { Router, ActivatedRoute } from '@angular/router'
/* tslint:disable */
import _ from 'lodash'
import { PublishPopupComponent } from '../../components/publish-popup/publish-popup.component'
import { AllocationService } from '../../services/allocation.service'
// import FileSaver from 'file-saver'
import { UploadFileService } from '../../services/uploadfile.service'
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

  userslist: any[] = []
  downloaddata: any = []
  totalusersCount: any
  statscount: any = {}
  queryParams: any
  workorderID: any
  workorderData: any
  p: number = 1
  constructor(private activated: ActivatedRoute, private router: Router, private uploadService: UploadFileService,
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

  ngOnInit() { }

  // Download format
  printDraft() {
    // const pdfName = 'Draft'
    // const pdfUrl = '/assets/files/draft.pdf'
    // FileSaver.saveAs(pdfUrl, pdfName)

    this.uploadService.getDraftPDF(this.workorderID).subscribe((response) => {
      let file = new Blob([response], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    })
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnChanges(data: SimpleChanges) {
    this.data = _.get(data, 'data.currentValue')
    this.length = this.data.length
    this.paginator.firstPage()
  }

  // buttonClick(action: string, row: any) {
  // this.downloaddata = []
  // if (action === 'Download') {
  //   console.log('row data', row)
  //   this.downloaddata.push(row)
  //   this.exportAsService.save(this.config, 'WorkAllocation').subscribe(() => {
  //     // save started
  //   })
  // } else if (action === 'Archive') {
  // const index = this.ralist.indexOf(row)
  // if (index >= 0) {
  //   this.ralist.splice(index, 1)
  // }
  // row.isArchived = true
  // this.archivedlist.push(row)
  // }
  // }

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
