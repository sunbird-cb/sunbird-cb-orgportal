import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { environment } from '../../../../../../../../../src/environments/environment'
import { MatSnackBar } from '@angular/material'
import { DownloadReportService } from '../../services/download-report.service'

@Component({
  selector: 'ws-app-reports-section',
  templateUrl: './reports-section.component.html',
  styleUrls: ['./reports-section.component.scss'],
})
export class ReportsSectionComponent implements OnInit {
  configSvc!: any
  btnList!: any
  constructor(
    private activeRouter: ActivatedRoute,
    private snackBar: MatSnackBar,
    private downloadService: DownloadReportService
  ) {
    this.configSvc = this.activeRouter.parent && this.activeRouter.parent.snapshot.data.configService
  }

  async ngOnInit() {
    this.btnList = await this.downloadService.fetchDownloadJson().toPromise().catch(_error => { })
  }

  onButtonClick(type: any) {
    switch (type) {
      case 'downloadUserReport':
        this.downloadUserList()
        break
      case 'consumptionReport':
        this.downloadConsumptionReport()
        break
    }
  }

  async downloadUserList() {
    const popup = this.snackBar
    const fileName = `userReport.xlsx`
    const downloadUrl = `${environment.domainName}${environment.userBucket}${this.configSvc.userProfile.rootOrgId}/${fileName}`
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

  downloadConsumptionReport() {
    const popup = this.snackBar
    const fileName = `userEnrolmentReport.xlsx`
    const downloadUrl = `${environment.domainName}${environment.userBucket}${this.configSvc.userProfile.rootOrgId}/${fileName}`
    // window.location.href = downloadUrl
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
