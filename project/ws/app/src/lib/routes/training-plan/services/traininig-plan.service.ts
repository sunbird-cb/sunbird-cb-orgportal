import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_END_POINTS = {
  GET_ALL_USERS: '/apis/proxies/v8/user/v1/search',
  GET_ALL_DESIGNATIONS: '/apis/proxies/v8/user/v1/positions',
}
@Injectable({
  providedIn: 'root',
})
export class TrainingPlanService {
  constructor(private http: HttpClient) { 
    
  }

  getAllUsers(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS}`, filter).pipe(map(res => _.get(res, 'result.response')))
  }

  getDesignations() {
    return this.http.get<any>(API_END_POINTS.GET_ALL_DESIGNATIONS)
  }
}
