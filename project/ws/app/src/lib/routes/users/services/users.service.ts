import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_END_POINTS = {
  GET_ALL_USERS: '/apis/proxies/v8/user/v1/search',
  GET_MY_DEPARTMENT: '/apis/protected/v8/portal/mdo/mydepartment?allUsers=true',
  // CREATE_USER: 'apis/protected/v8/admin/userRegistration/create-user',
  CREATE_USER: 'apis/protected/v8/user/profileDetails/createUser',
  // PROFILE_REGISTRY: 'apis/protected/v8/user/profileRegistry/getUserRegistryByUser/',
  PROFILE_REGISTRY_V1: '/apis/proxies/v8/user/v1/read/',
  PROFILE_REGISTRY_V2: '/apis/proxies/v8/api/user/v2/read/',
  CREATE_PROFILE_REGISTRY: '/apis/protected/v8/user/profileRegistry/createUserRegistryV2',
  ADD_USER_TO_DEPARTMENT: '/apis/proxies/v8/user/private/v1/assign/role',
  WF_HISTORY_BY_APPID: 'apis/protected/v8/workflowhandler/historyByApplicationId/',
  SEARCH_USER: 'apis/protected/v8/user/autocomplete/department',
  USER_BDD: '/apis/protected/v8/portal/mdo/deptAction/userrole',
  // GET_BULKUPLOAD_DATA: '/apis/protected/v8/admin/userRegistration/bulkUploadData',
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) { }
  getAllUsers(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS}`, filter).pipe(map(res => _.get(res, 'result.response')))
  }

  getMyDepartment(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_MY_DEPARTMENT}`)
  }

  createUser(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.CREATE_USER, req)
  }

  getUserById(userid: string): Observable<any> {
    if (userid) {
      return this.http.get<any>(API_END_POINTS.PROFILE_REGISTRY_V1 + userid).pipe(map(resp => _.get(resp, 'result.response')))
    }
    return this.http.get<any>(API_END_POINTS.PROFILE_REGISTRY_V2).pipe(map(resp => _.get(resp, 'result.response')))
  }

  createUserById(id: any, req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CREATE_PROFILE_REGISTRY}/${id}`, req)
  }

  /** new API add roles */
  addUserToDepartment(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.ADD_USER_TO_DEPARTMENT}`, req)
  }

  // addUserRoleToDepartment(req: any): Observable<any> {
  //   return this.http.patch<any>(`${API_END_POINTS.ADD_USER_TO_DEPARTMENT}/userrole`, req)
  // }

  getWfHistoryByAppId(appid: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.WF_HISTORY_BY_APPID + appid)
  }

  onSearchUserByEmail(email: string, req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.SEARCH_USER}/${email}`, req)
  }
  blockUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.USER_BDD}/`, user)
  }
  deActiveUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.USER_BDD}/`, user)
  }
  deleteUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.USER_BDD}/`, user)
  }

  // getBulkUploadData(): Observable<any> {
  //   return this.http.get<any>(`${API_END_POINTS.GET_BULKUPLOAD_DATA}`)
  // }
}
