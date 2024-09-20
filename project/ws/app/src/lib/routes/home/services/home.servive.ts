import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { NSProfileDataV2 } from '../models/profile-v2.model'
import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
/* tslint:enable */

const PROTECTED_SLAG_V8 = '/apis/protected/v8'

const API_END_POINTS = {
  DISCUSS_PROFILE: '/apis/protected/v8/discussionHub/users',
  PROFILE_DETAIL: `${PROTECTED_SLAG_V8}/social/post/timeline`,
  SOCIAL_VIEW_CONVERSATION: `${PROTECTED_SLAG_V8}/social/post/viewConversation`,
  // getUserdetailsV2FromRegistry: '/apis/protected/v8/user/profileRegistry/getUserRegistryByUser',
  READ_PROFILE: '/apis/proxies/v8/api/user/v2/read',
  CHECK_ISADMIN: '/apis/protected/v8/portal/isAdmin/mdo',
  // GET_MY_DEPARTMENT: '/apis/protected/v8/portal/mdo/mydepartment?allUsers=false',
  GET_MY_DEPARTMENT_ALL: '/apis/protected/v8/portal/mdo/mydepartment?allUsers=true',
  GET_USER_DETAILS: `/apis/protected/v8/user/details?ts='${Date.now()}`,
  GET_FILTER_ENTITY: 'apis/proxies/v8/competency/v4/search',
  GET_REQUEST_TYPE_LIST: '/apis/proxies/v8/org/v1/search',
  CREATE_DEMAND_REQUEST: '/apis/proxies/v8/demand/content/create',
  GET_REQUEST_DATA: '/apis/proxies/v8/demand/content/search',
  MARK_INVALID: '/apis/proxies/v8/demand/content/v1/update/status',
  GET_REQUEST_DATA_BYID: 'apis/proxies/v8/demand/content/read',
  GET_INTEREST_ORG_LIST: '/apis/proxies/v8/interest/v1/search',
  ASSIGN_TO_ORG: '/apis/proxies/v8/interest/v1/assign',

}

@Injectable({
  providedIn: 'root',
})
export class ProfileV2Service {
  constructor(private http: HttpClient) { }
  fetchDiscussProfile(wid: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.DISCUSS_PROFILE}/${wid}`)
  }
  fetchProfile(userId: string): Observable<NSProfileDataV2.IProfile> {
    return this.http.get<any>(`${API_END_POINTS.READ_PROFILE}/${userId}`)
      .pipe(map(response => (response.profiledetails || [])))

  }
  fetchPost(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SOCIAL_VIEW_CONVERSATION, request)
  }

  checkIsUserAdmin(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.CHECK_ISADMIN}`)
  }
  getMyDepartmentAll(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_MY_DEPARTMENT_ALL}`)
  }
  // getMyDepartment(): Observable<any> {
  //   return this.http.get<any>(`${API_END_POINTS.GET_MY_DEPARTMENT}`)
  // }

  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_USER_DETAILS}`)
  }

  getFilterEntity(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_FILTER_ENTITY}`, filter).pipe(map(res => _.get(res, 'result.competency')))
  }

  getRequestTypeList(request: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_REQUEST_TYPE_LIST}`, request).pipe(map(res => _.get(res, 'result.response.content')))
  }

  createDemand(request: any) {
   return this.http.post<any>(`${API_END_POINTS.CREATE_DEMAND_REQUEST}`, request)
  }

  getRequestList(request: any) {
   return this.http.post<any>(`${API_END_POINTS.GET_REQUEST_DATA}`, request).pipe(map(res => _.get(res, 'result.result')))
  }

  markAsInvalid(request: any) {
    return this.http.post<any>(`${API_END_POINTS.MARK_INVALID}`, request)
   }

  getRequestDataById(demandId: any) {
    return this.http.get<any>(`${API_END_POINTS.GET_REQUEST_DATA_BYID}/${demandId}`).pipe(map(res => _.get(res, 'result.result')))
  }
  getOrgInterestList(request: any) {
    return this.http.post<any>(`${API_END_POINTS.GET_INTEREST_ORG_LIST}`, request).pipe(map(res => _.get(res, 'result.result')))
  }

  assignToOrg(request: any) {
    return this.http.put<any>(`${API_END_POINTS.ASSIGN_TO_ORG}`, request)
  }

}
