import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  GET_BLENDED_PROGRAMS: '/apis/proxies/v8/sunbirdigot/read',
  GET_REQUESTS: '/apis/proxies/v8/workflow/blendedprogram/search',
}

@Injectable({
  providedIn: 'root',
})
export class BlendedService {
  constructor(private http: HttpClient) { }
  getBlendedPrograms(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.GET_BLENDED_PROGRAMS, request)
  }

  getRequests(req: any) {
    return this.http.post<any>(`${API_END_POINTS.GET_REQUESTS}`, req)
  }
}
