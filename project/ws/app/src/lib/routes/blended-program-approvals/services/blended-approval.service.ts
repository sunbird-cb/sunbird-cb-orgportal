import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
// tslint:disable-next-line:import-name
import _ from 'lodash'

const API_END_POINTS = {
  UPDATE_REQUEST: '/apis/proxies/v8/workflow/blendedprogram/update/mdo',
  // GET_PROGRAM_DETAILS: '/apis/proxies/v8/action/content/v3/hierarchy',
  GET_PROGRAM_DETAILS: '/apis/proxies/v8/action/content/v3/read',
  GET_LERANERS: '/apis/protected/v8/cohorts/course/getUsersForBatch',
  GET_REQUESTS: '/apis/proxies/v8/workflow/blendedprogram/search',
  READ_USER: '/apis/proxies/v8/api/user/v2/read/',
  CERT_DOWNLOAD: `/apis/protected/v8/cohorts/course/batch/cert/download/`,
  SEARCH_FORM_WITH_USERID: 'apis/proxies/v8/forms/searchForms',
  NOMINATE_LEARNERS: '/apis/proxies/v8/workflow/blendedprogram/admin/enrol',
  REMOVE_LEARNER: '/apis/proxies/v8/workflow/blendedprogram/remove/mdo',
}

@Injectable({
  providedIn: 'root',
})
export class BlendedApporvalService {
  constructor(private http: HttpClient) { }
  getBlendedProgramsDetails(programID: any): Observable<any> {
    const url = `${API_END_POINTS.GET_PROGRAM_DETAILS}/${programID}`
    return this.http.get<any>(url)
  }

  getLearners(batchId: any): Observable<any> {
    const url = `${API_END_POINTS.GET_LERANERS}/${batchId}`
    return this.http.get<any>(url)
  }

  getRequests(req: any) {
    return this.http.post<any>(`${API_END_POINTS.GET_REQUESTS}`, req)
  }

  updateBlendedRequests(req: any) {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_REQUEST}`, req)
  }

  getUserById(userid: string): Observable<any> {
    if (userid) {
      return this.http.get<any>(API_END_POINTS.READ_USER + userid).pipe(map(resp => _.get(resp, 'result.response')))
    }
    return this.http.get<any>(API_END_POINTS.READ_USER).pipe(map(resp => _.get(resp, 'result.response')))
  }

  downloadCert(certId: any) {
    const url = `${API_END_POINTS.CERT_DOWNLOAD}/${certId}`
    return this.http.get<any>(url)
  }

  getSurveyByUserID(req: any) {
    return this.http.post<any>(`${API_END_POINTS.SEARCH_FORM_WITH_USERID}`, req)
  }

  nominateLearners(req: any) {
    return this.http.post<any>(`${API_END_POINTS.NOMINATE_LEARNERS}`, req)
  }

  removeLearner(req: any) {
    return this.http.post<any>(`${API_END_POINTS.REMOVE_LEARNER}`, req)
  }
}
