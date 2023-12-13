import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_END_POINTS = {
  CREATE_PLAN: 'apis/proxies/v8/cbplan/v1/create',
  UPDATE_PLAN: 'apis/proxies/v8/cbplan/v1/update',
  GET_ALL_CONTENT: '/apis/proxies/v8/sunbirdigot/search',
  GET_ALL_USERS: '/apis/proxies/v8/user/v1/search',
  GET_ALL_DESIGNATIONS: '/apis/proxies/v8/user/v1/positions',
}
@Injectable({
  providedIn: 'root',
})
export class TrainingPlanService {
  constructor(private http: HttpClient) { 
    
  }
  //reqObj:object
  createPlan(obj:any) {
    return this.http.post<any>(`${API_END_POINTS.CREATE_PLAN}`, obj).pipe(map(res => _.get(res, 'result')))
  }

  updatePlan() {

  }

  getAllContent(filter:object):Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_CONTENT}`, filter).pipe(map(res => _.get(res, 'result')))
  }

  getAllUsers(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS}`, filter).pipe(map(res => _.get(res, 'result.response')))
  }

  getDesignations() {
    return this.http.get<any>(API_END_POINTS.GET_ALL_DESIGNATIONS)
  }
}
