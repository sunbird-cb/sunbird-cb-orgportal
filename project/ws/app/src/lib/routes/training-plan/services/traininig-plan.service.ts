import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_END_POINTS = {
  CREATE_PLAN: 'apis/proxies/v8/cbplan/v1/create',
  READ_PLAN: 'apis/proxies/v8/cbplan/v1/read',
  UPDATE_PLAN: 'apis/proxies/v8/cbplan/v1/update',
  ARCHIVE_PLAN: 'apis/proxies/v8/cbplan/v1/archive',
  PUBLISH_PLAN: 'apis/proxies/v8/cbplan/v1/publish',
  GET_ALL_CONTENT: 'apis/proxies/v8/sunbirdigot/search',
  GET_ALL_USERS: 'apis/proxies/v8/user/v1/search',
  GET_ALL_DESIGNATIONS: 'apis/proxies/v8/masterData/v2/deptPosition',
  GET_PROVIDERS: 'apis/proxies/v8/searchBy/provider',
  GET_FILTER_ENTITY: 'apis/proxies/v8/competency/v4/search'
}
@Injectable({
  providedIn: 'root',
})
export class TrainingPlanService {
  constructor(private http: HttpClient) {

  }
  // reqObj:object
  createPlan(obj: any) {
    return this.http.post<any>(`${API_END_POINTS.CREATE_PLAN}`, obj).pipe(map(res => _.get(res, 'result')))
  }

  readPlan(planId: any) {
    return this.http.get<any>(API_END_POINTS.READ_PLAN + `/${planId}`)
  }

  updatePlan(obj: any) {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_PLAN}`, obj).pipe(map(res => _.get(res, 'result')))
  }

  archivePlan(obj: any) {
    return this.http.post<any>(`${API_END_POINTS.ARCHIVE_PLAN}`, obj)
  }

  publishPlan(obj: any) {
    return this.http.post<any>(`${API_END_POINTS.PUBLISH_PLAN}`, obj)
  }

  getAllContent(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_CONTENT}`, filter).pipe(map(res => _.get(res, 'result')))
  }

  getCustomUsers(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS}`, filter).pipe(map(res => _.get(res, 'result.response')))
  }

  getDesignations() {
    return this.http.get<any>(API_END_POINTS.GET_ALL_DESIGNATIONS)
  }

  getFilterEntity(filter:object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_FILTER_ENTITY}`, filter).pipe(map(res => _.get(res, 'result.competency')))
  }

  getProviders() {
    return this.http.get<any>(API_END_POINTS.GET_PROVIDERS);
  }

}
