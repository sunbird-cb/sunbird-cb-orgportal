import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils'
const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const API_END_POINTS = {
  USERS: `${PROTECTED_SLAG_V8}/workallocation/userSearch`,
  GET_ALL_USERS: `${PROTECTED_SLAG_V8}/portal/mdo/mydepartment?allUsers=false`,
  GET_ALL_WAT_LIST: `${PROTECTED_SLAG_V8}/workallocation/getWorkOrders`,
  GET_USER_BY_WID: `${PROTECTED_SLAG_V8}/workallocation/getUserBasicInfo/`,
}

@Injectable({
  providedIn: 'root',
})
export class WorkallocationService {
  constructor(private http: HttpClient, private configService: ConfigurationsService
  ) { }

  getUsers(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.USERS}`, req)
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_USERS}`)
  }
  fetchWAT(currentStatus: string): Observable<any> {
    const request = {
      status: currentStatus,
      departmentName: this.configService.userProfile && this.configService.userProfile.departmentName || '',
      pageNo: 0,
      pageSize: 10,
    }
    return this.http.post<any>(API_END_POINTS.GET_ALL_WAT_LIST, request)
  }
  fetchAllWATRequestBySearch(queryString: string, currentStatus: any): Observable<any> {
    const request = {
      status: currentStatus,
      departmentName: this.configService.userProfile && this.configService.userProfile.departmentName || '',
      query: queryString,
      pageNo: 0,
      pageSize: 10,
    }
    return this.http.post<any>(API_END_POINTS.GET_ALL_WAT_LIST, request)
  }
  fetchUserByWID(wid: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_USER_BY_WID + wid)
  }

}
