import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  USERS: '/apis/protected/v8/user/roles/getUsersV2',
  USER_BDD: '/apis/protected/v8/portal/mdo/deptAction/userrole',
  ACTIVE_USER: 'apis/proxies/v8/user/v1/unblock',
  DE_ACTIVE_USER: 'apis/proxies/v8/user/v1/block',
  SEARCH_USER_TABLE: '/apis/proxies/v8/user/v1/search',
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) { }
  getUsers(role: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.USERS}/${role}/`)
  }
  blockUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.USER_BDD}/`, user)
  }
  deActiveUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.DE_ACTIVE_USER}/`, user)
  }
  activeUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.ACTIVE_USER}/`, user)
  }
  deleteUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.USER_BDD}/`, user)
  }
  searchUserByenter(value: string, rootOrgId: string) {
    const reqBody = {
      request: {
        query: value,
        filters: {
          rootOrgId,
        },
      },
    }

    return this.http.post<any>(`${API_END_POINTS.SEARCH_USER_TABLE}`, reqBody)
  }
}
