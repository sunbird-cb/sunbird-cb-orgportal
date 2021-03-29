import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  USERS: '/apis/protected/v8/workallocation/userSearch',
}

@Injectable({
  providedIn: 'root',
})
export class WorkallocationService {
  constructor(private http: HttpClient) { }

  getUsers(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.USERS}`, req)
  }
}
