import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  USERS: '/apis/protected/v8/workallocation/userSearch',
  GET_ALL_USERS: '/apis/protected/v8/portal/mdo/mydepartment?allUsers=false',
}

@Injectable({
  providedIn: 'root',
})
export class WorkallocationService {
  constructor(private http: HttpClient) { }

  getUsers(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.USERS}`, req)
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_USERS}`)
  }
}
