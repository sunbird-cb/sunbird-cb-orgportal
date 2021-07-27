import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const API_END_POINTS = {
  GET_ALL_USERS: '/apis/protected/v8/portal/mdo/mydepartment?allUsers=true',
  GET_MY_DEPARTMENT: '/apis/protected/v8/portal/mdo/mydepartment?allUsers=true',
  CREATE_USER: 'apis/protected/v8/admin/userRegistration/create-user',
  // PROFILE_REGISTRY: 'apis/protected/v8/user/profileRegistry/getUserRegistryByUser/',
  PROFILE_REGISTRY_V1: '/apis/proxies/v8/user/v1/read/',
  PROFILE_REGISTRY_V2: '/apis/proxies/v8/api/user/v2/read/',
  ADD_USER_TO_DEPARTMENT: 'apis/protected/v8/portal/deptAction',
  WF_HISTORY_BY_APPID: 'apis/protected/v8/workflowhandler/historyByApplicationId/',
  SEARCH_USER: 'apis/protected/v8/user/autocomplete/department',
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) { }
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_USERS}`)
  }

  getMyDepartment(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_MY_DEPARTMENT}`)
  }

  createUser(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.CREATE_USER, req)
  }

  getUserById(userid: string): Observable<any> {
    if (userid) {
      return this.http.get<any>(API_END_POINTS.PROFILE_REGISTRY_V1 + userid).pipe(map(resp => resp.profiledetails))
    }
    return this.http.get<any>(API_END_POINTS.PROFILE_REGISTRY_V2).pipe(map(resp => resp.profiledetails))
  }

  addUserToDepartment(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.ADD_USER_TO_DEPARTMENT}/${req.deptId}/userrole`, req)
  }

  getWfHistoryByAppId(appid: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.WF_HISTORY_BY_APPID + appid)
  }

  onSearchUserByEmail(email: string, req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.SEARCH_USER}/${email}`, req)
  }
}
