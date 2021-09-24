import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
    getDesignation: '/apis/protected/v8/frac/searchNodes',
}

@Injectable({
  providedIn: 'root',
})
export class MdoInfoService {
  constructor(private http: HttpClient) { }
//   getRoles(): Observable<any> {
//     return this.http.get<any>(`${API_END_POINTS.ROLES}`)
//   }

  getDesignations(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.getDesignation, req)
  }
}
