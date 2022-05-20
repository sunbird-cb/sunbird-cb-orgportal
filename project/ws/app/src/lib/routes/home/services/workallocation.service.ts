import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils'
const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const API_END_POINTS = {
  USERS: `${PROTECTED_SLAG_V8}/workallocation/userSearch`,
  GET_ALL_USERS: `/apis/proxies/v8/api/user/v2/read`,
  GET_ALL_WAT_LIST: `${PROTECTED_SLAG_V8}/workallocation/getWorkOrders`,
  GET_USER_BY_WID: `${PROTECTED_SLAG_V8}/workallocation/getUserBasicInfo/`,
  ADD_WORK_ORDERS: `${PROTECTED_SLAG_V8}/workallocation/add/workorder`,
  COPY_WORK_ORDERS: `${PROTECTED_SLAG_V8}/workallocation/copy/workOrder`,
  GET_PDF: `${PROTECTED_SLAG_V8}/workallocation/getWOPdf`,
}

@Injectable({
  providedIn: 'root',
})
export class WorkallocationService {
  constructor(private http: HttpClient, private configService: ConfigurationsService
  ) { }
  getTime(dateString: number) {
    const time = new Date(dateString)
    return `${new Date(dateString).toISOString().substr(0, 10)}
    ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
  }
  getUsers(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.USERS}`, req)
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_USERS}`)
  }
  fetchWAT(currentStatus: string): Observable<any> {
    const request = {
      status: currentStatus,
      departmentName: ((this.configService.userProfile && this.configService.userProfile.departmentName)
        || (this.configService.userProfileV2 && this.configService.userProfileV2.departmentName) || ''),
      pageNo: 0,
      pageSize: 100,
    }
    return this.http.post<any>(API_END_POINTS.GET_ALL_WAT_LIST, request)
  }
  addWAT(departmentName: any, deptId: number): Observable<any> {
    const request = {
      deptId,
      name: `Work order - ${departmentName}` || '',
      deptName: this.configService.userProfile && this.configService.userProfile.departmentName || '',
    }
    return this.http.post<any>(API_END_POINTS.ADD_WORK_ORDERS, request)
  }
  copyWAT(workOrderId: any, departmentName: any): Observable<any> {
    const request = {
      id: workOrderId,
      name: `Work order - ${departmentName}` || '',
    }
    return this.http.post<any>(API_END_POINTS.COPY_WORK_ORDERS, request)
  }
  fetchAllWATRequestBySearch(queryString: string, currentStatus: any): Observable<any> {
    const request = {
      status: currentStatus,
      departmentName: this.configService.userProfile && this.configService.userProfile.departmentName || '',
      query: queryString,
      pageNo: 0,
      pageSize: 100,
    }
    return this.http.post<any>(API_END_POINTS.GET_ALL_WAT_LIST, request)
  }
  fetchUserByWID(wid: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_USER_BY_WID + wid)
  }
  getPDF(val: any) {
    // const hTTPOptions = {
    //   headers: new HttpHeaders({
    //     Accept: 'application/pdf',
    //   }),
    //   responseType: 'blob' as 'json',
    // }
    // return this.http.get(`${API_END_POINTS.GET_PDF}`, hTTPOptions)
    return this.http.get<any>(`${API_END_POINTS.GET_PDF}/${val}`, { responseType: 'blob' as 'json' })
  }

}
