import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { NsMandatoryCourse } from '../models/mandatory-course.model'
// tslint:disable
import _ from 'lodash'
import { ConfigurationsService } from '@sunbird-cb/utils'
const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const API_END_POINTS = {
  SEARCH_V6: `${PROTECTED_SLAG_V8}/sunbirdigot/search`,
  CREATE_CONTENT: `${PROTECTED_SLAG_V8}/action/content/v3/create`,
  UPDATE_HIERARCHY: `${PROTECTED_SLAG_V8}/action/content/v3/hierarchy/update`,
  PUBLISH_CONTENT: (contentId: string) => `${PROTECTED_SLAG_V8}/action/content/v3/publish/${contentId}`,
  CREATE_BATCH: `/apis/authApi/batch/create`,
  ADD_USER_TO_BATCH: `/apis/authApi/batch/addUser`,
  GET_ALL_USERS: `/apis/proxies/v8/user/v1/search`,
}

@Injectable({
  providedIn: 'root',
})
export class MandatoryCourseService {
  // private pageData = new Subject();
  // currentPageDate$ = this.pageData.asObservable();
  private pageData: any
  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService
  ) { }

  createContent(name: string): Observable<string> {

    const requestBody: NsMandatoryCourse.ICreateMetaRequestV2 = {
      request: {
        content: {
          contentType: this.pageData.contentType,
          createdBy: (this.configSvc.userProfile && this.configSvc.userProfile.userId) || '',
          createdFor: [(this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId) ? this.configSvc.userProfile.rootOrgId : ''],
          creator: (this.configSvc.userProfile && this.configSvc.userProfile.userName) || '',
          description: '',
          mimeType: this.pageData.mimeType,
          name: name,
          purpose: '',
          organisation: [
            (this.configSvc.userProfile && this.configSvc.userProfile.departmentName) ? this.configSvc.userProfile.departmentName : '',
          ],
          isExternal: this.pageData.isExternal,
          primaryCategory: this.pageData.primaryCategory,
          license: this.pageData.license,
          ownershipType: this.pageData.ownershipType,
          visibility: this.pageData.visibility
        },
      },
    }
    return this.http
      .post<NsMandatoryCourse.ICreateMetaRequestV2>(
        `${API_END_POINTS.CREATE_CONTENT}`,
        requestBody,
      )
      .pipe(
        map((data: any) => {
          return data.result.identifier
        }),
      )
  }

  updateContent(meta: NsMandatoryCourse.IContentUpdateV3) {
    return this.http.patch<null>(
      `${API_END_POINTS.UPDATE_HIERARCHY}`,
      meta,
    )
  }

  publishContent(id: string) {
    const requestbody = {
      request: {
        content: {
          publisher: (this.configSvc.userProfile && this.configSvc.userProfile.userName) || '',
          lastPublishedBy: (this.configSvc.userProfile && this.configSvc.userProfile.userName) || '',
        },
      },
    }
    return this.http.post<any>(API_END_POINTS.PUBLISH_CONTENT(id), requestbody)
  }

  fetchSearchData(request: any): Observable<any> {
    request.request.filters.rootOrgId = (this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId) || ''
    return this.http.post<any>(API_END_POINTS.SEARCH_V6, request)
  }

  getAllUsers(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS}`, filter).pipe(map(res => _.get(res, 'result.response')))
  }

  addMember(req: any) {
    return this.http.post<any>(`${API_END_POINTS.ADD_USER_TO_BATCH}`, req)
  }

  addBatch(req: any) {
    return this.http.post<any>(`${API_END_POINTS.CREATE_BATCH}`, req)
  }
  updatePageData(pageData: any) {
    this.pageData = pageData
  }
}
