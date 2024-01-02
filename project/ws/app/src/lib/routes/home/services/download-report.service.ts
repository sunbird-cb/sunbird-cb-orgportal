import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils'

@Injectable({
  providedIn: 'root',
})
export class DownloadReportService {
  baseUrl = this.configSvc.sitePath
  constructor(private http: HttpClient, private configSvc: ConfigurationsService) { }

  fetchDownloadJson(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/feature/download-report.json`).pipe()
  }

  fetctReportsUpdatedOn(orgId: string): Observable<any> {
    return this.http.get<any>(`/apis/proxies/v8/storage/v1/reportInfo/${orgId}`).pipe()
  }
}
