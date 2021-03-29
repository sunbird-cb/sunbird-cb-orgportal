import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  SEARCH_USER: 'apis/protected/v8/workallocation/user/autocomplete',
  SEARCH_ROLE: 'apis/protected/v8/roleactivity',
  USERS: '/apis/protected/v8/workallocation/userSearch',
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

  getUsers(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.USERS}`, req)
  }
}
