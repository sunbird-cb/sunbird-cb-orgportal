import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { EMPTY, Observable, of } from 'rxjs'

const API_END_POINTS = {
  // SEARCH_USER: 'apis/protected/v8/workallocation/user/autocomplete',
  SEARCH_USER: 'apis/proxies/v8/user/v1/autocomplete',
  SEARCH_ROLE: 'apis/protected/v8/roleactivity',
  SEARCH_NODES: 'apis/protected/v8/frac/searchNodes',
  CREATE_ALLOCATION: 'apis/protected/v8/workallocation/add',
  CREATE_ALLOCATIONV2: '/apis/protected/v8/workallocation/v2/add',
  UPDATE_ALLOCATIONV2: '/apis/protected/v8/workallocation/v2/update',
  UPDATE_ALLOCATION: 'apis/protected/v8/workallocation/update',
  // GET_ALL_USERS: '/apis/protected/v8/portal/mdo/mydepartment?allUsers=false',
  USERS: '/apis/protected/v8/workallocation/userSearch',
  SEARCH_COMPETENCY: '/apis/protected/v8/frac/COMPETENCY',
  GET_ALLOCATEDUSERS: '/apis/protected/v8/workallocation/getWorkOrderById',
}

@Injectable({
  providedIn: 'root',
})
export class AllocationService {

  oldObj = {}
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

  createAllocationV2(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CREATE_ALLOCATIONV2}`, req)
  }
  updateAllocationV2(req: any): Observable<any> {
    if (JSON.stringify(this.oldObj || {}) !== JSON.stringify(req || {})) {
      this.oldObj = req
      return this.http.post<any>(`${API_END_POINTS.UPDATE_ALLOCATIONV2}`, req)
    }
    return of(EMPTY)
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

  getAllocatedUsers(id: any): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALLOCATEDUSERS}/${id}`)
  }

}
