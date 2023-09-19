import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { environment } from '../../../../../../../../../src/environments/environment'
import { MatPaginator, MatSnackBar, MatTableDataSource } from '@angular/material'
import { DownloadReportService } from '../../services/download-report.service'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'ws-app-reports-section',
  templateUrl: './reports-section.component.html',
  styleUrls: ['./reports-section.component.scss'],
})
export class ReportsSectionComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | null = null
  configSvc!: any
  btnList!: any
  tabledata!: ITableData
  dataSource: MatTableDataSource<any>
  reportSectionData: any

  constructor(
    private activeRouter: ActivatedRoute,
    private snackBar: MatSnackBar,
    private downloadService: DownloadReportService,
    private datePipe: DatePipe
  ) {
    this.configSvc = this.activeRouter.parent && this.activeRouter.parent.snapshot.data.configService
    this.dataSource = new MatTableDataSource(this.reportSectionData)
    this.dataSource.paginator = this.paginator
  }

  async ngOnInit() {
    this.btnList = await this.downloadService.fetchDownloadJson().toPromise().catch(_error => { })
    this.tabledata = {
      columns: [
        // { displayName: 'Id', key: 'identifier' },
        { displayName: 'Report name', key: 'reportName' },
        { displayName: 'Report type', key: 'reportType' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'dateCreatedOn',
      sortState: 'desc',
      needUserMenus: false,
      actions: [{ icon: 'download', label: 'Download report', name: 'DownloadFile', type: 'link', disabled: false }],
      actionColumnName: 'Download report',
    }
    this.reportSectionData = []
    this.btnList.forEach((element: any) => {
      if (element.enabled) {
        // tslint:disable-next-line:max-line-length
        this.reportSectionData.push({ reportName: element.name, reportType: element.reportType, type: element.type, fileName: element.downloadReportFileName })
      }
    })
    this.dataSource = new MatTableDataSource(this.reportSectionData)
    setTimeout(() => this.dataSource.paginator = this.paginator)
  }

  downloadFullFile(event: any) {
    if (event && event.row && event.row.type && event.type.fileName) {
      this.downloadReportFile(event.row.type, event.type.fileName)
    }
  }

  async downloadReportFile(type: string, reportFileName: string) {
    const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    const apiProxy = `apis/proxies/v8/storage/v1/report`
    const popup = this.snackBar
    const fileName = `${reportFileName}.csv`
    const downloadUrl =
      `${environment.mdoPath}/${apiProxy}/${type}/${currentDate}/mdoid=${this.configSvc.userProfile.rootOrgId}/${fileName}`
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return
      }
      if (xhr.status === 200) {
        window.location.href = downloadUrl
      } else {
        popup.open('Report is not available')
      }
    }
    xhr.open('GET', downloadUrl)
    xhr.send()
  }

}
