import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { retry } from 'rxjs/operators'

const API_END_POINTS = {
  CBP_PLAN_LIST: '/apis/proxies/v8/cbplan/v1/list',
}

@Injectable({
  providedIn: 'root',
})
export class TrainingPlanDashboardService {
  constructor(private http: HttpClient) { }

  getUserList(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.CBP_PLAN_LIST, req).pipe(retry(1))
  }
}
