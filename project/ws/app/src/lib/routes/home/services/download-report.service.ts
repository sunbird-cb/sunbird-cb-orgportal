import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'

const API_END_POINTS = {
  GET_REPORTS_INFO: `/apis/proxies/v8/operationalreports/v1/reportInfo`,
  DOWNLOAD_REPORTS: `/apis/proxies/v8/operationalreports/download`,
  GET_ADMINS: `/apis/proxies/v8/user/v1/search`,
  GET_ADMINS_ACCESSS_DETAILS: `/apis/proxies/v8/operationalreports/`,
  UPDATE_ACCESS: `/apis/proxies/v8/operationalreports/admin/grantaccess`,
}
@Injectable({
  providedIn: 'root',
})
export class DownloadReportService {
  baseUrl = this.configSvc.sitePath
  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService
  ) { }

  getReportInfo() {
    return this.http.get<any>(`${API_END_POINTS.GET_REPORTS_INFO}`).pipe(map(res => _.get(res, 'result')))
  }

  downloadReports(): Observable<HttpResponse<Blob>> {
    return this.http.get(`${API_END_POINTS.DOWNLOAD_REPORTS}`, { observe: 'response', responseType: 'blob' })
  }

  getAdminsList(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_ADMINS}`, filter).pipe(map(res => _.get(res, 'result.response')))
  }

  getAccessDetails(readAssessEndPoint: string) {
    return this.http.get<any>(`${API_END_POINTS.GET_ADMINS_ACCESSS_DETAILS}${readAssessEndPoint}`)
      .pipe(map(res => _.get(res, 'result.response')))
  }

  updateAccessToReports(formData: any) {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_ACCESS}`, formData)
  }
}
