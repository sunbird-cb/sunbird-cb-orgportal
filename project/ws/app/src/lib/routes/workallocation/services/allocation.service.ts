import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  // SEARCH_USER: 'apis/protected/v8/workallocation/user/autocomplete',
  SEARCH_USER: 'apis/proxies/v8/user/v1/autocomplete',
  SEARCH_ROLE: 'apis/protected/v8/roleactivity',
  SEARCH_NODES: 'apis/protected/v8/frac/searchNodes',
  CREATE_ALLOCATION: 'apis/protected/v8/workallocation/add',
  UPDATE_ALLOCATION: 'apis/protected/v8/workallocation/update',
  // GET_ALL_USERS: '/apis/protected/v8/portal/mdo/mydepartment?allUsers=false',
  USERS: '/apis/protected/v8/workallocation/userSearch',
  SEARCH_COMPETENCY: '/apis/protected/v8/frac/COMPETENCY',
}

@Injectable({
  providedIn: 'root',
})
export class AllocationService {
  constructor(private http: HttpClient) { }

  onSearchUser(val: any): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.SEARCH_USER}/${val}`)
  }

  onSearchRole(val: any): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.SEARCH_ROLE}/${val}`)
  }

  onSearchPosition(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.SEARCH_NODES}`, req)
  }

  onSearchActivity(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.SEARCH_NODES}`, req)
  }

  onSearchCompetency(val: any): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.SEARCH_COMPETENCY}/${val}`)
  }

  createAllocation(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CREATE_ALLOCATION}`, req)
  }

  updateAllocation(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_ALLOCATION}`, req)
  }

  // getAllUsers(): Observable<any> {
  //   return this.http.get<any>(`${API_END_POINTS.GET_ALL_USERS}`)
  // }

  getUsers(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.USERS}`, req)
  }

  getAllocationDetails(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.USERS}`, req)
  }

}
