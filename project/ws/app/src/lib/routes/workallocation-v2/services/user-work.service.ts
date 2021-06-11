import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  GET_USER_WORK: '/apis/protected/v8/workallocation/getWorkAllocationById',
}

@Injectable({
  providedIn: 'root',
})
export class UserWorkService {

  constructor(private http: HttpClient) { }
  fetchUserWorkAllocation(usersId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_USER_WORK}/${usersId}`)
  }
}
