import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_END_POINTS = {
    getDesignation: '/apis/protected/v8/frac/searchNodes',
    getTeamUsers: '/apis/proxies/v8/user/v1/search',
    GET_ALL_USERS: '/apis/proxies/v8/user/v1/search',
    assign_role: '/apis/proxies/v8/user/private/v1/assign/role',
    get_staffdetails: '/apis/proxies/v8/staff/position',
    staffdetails: '/apis/proxies/v8/staff/position',
    delete_staffdetails: '/apis/proxies/v8/staff/position?orgId=',
}

@Injectable({
  providedIn: 'root',
})
export class MdoInfoService {
  constructor(private http: HttpClient) { }
//   getRoles(): Observable<any> {
//     return this.http.get<any>(`${API_END_POINTS.ROLES}`)
//   }

  getAllUsers(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS}`, filter).pipe(map(res => _.get(res, 'result.response')))
  }

  getDesignations(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.getDesignation, req)
  }

  getTeamUsers(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.getTeamUsers, req)
  }

  assignTeamRole(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.assign_role, req)
  }

  getStaffdetails(orgId: any): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.get_staffdetails}/${orgId}`)
  }

  addStaffdetails(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.staffdetails, req)
  }

  updateStaffdetails(req: any): Observable<any> {
    return this.http.patch<any>(API_END_POINTS.staffdetails, req)
  }

  deleteStaffdetails(id: any, orgId: any): Observable<any> {
    return this.http.delete<any>(`${API_END_POINTS.delete_staffdetails}${orgId}&id=${id}`)
  }
}
