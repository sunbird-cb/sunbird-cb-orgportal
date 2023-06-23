import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  UPDATE_REQUEST: '/apis/proxies/v8/workflow/blendedprogram/update',
  GET_PROGRAM_DETAILS: '/apis/proxies/v8/action/content/v3/hierarchy',
  GET_LERANERS: '/apis/protected/v8/cohorts/course/getUsersForBatch',
  GET_REQUESTS: '/apis/proxies/v8/workflow/blendedprogram/search',
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
}
