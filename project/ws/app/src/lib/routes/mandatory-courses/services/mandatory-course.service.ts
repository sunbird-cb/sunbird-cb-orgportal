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

  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService
  ) { }

  createContent(meta:
    {
      mimeType: string; contentType: string; locale: string, name: string, primaryCategory: string, purpose: string
    }): Observable<string> {

    const requestBody: NsMandatoryCourse.ICreateMetaRequestV2 = {
      request: {
        content: {
          contentType: meta.contentType,
          createdBy: (this.configSvc.userProfile && this.configSvc.userProfile.userId) || '',
          createdFor: [(this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId) ? this.configSvc.userProfile.rootOrgId : ''],
          creator: (this.configSvc.userProfile && this.configSvc.userProfile.userName) || '',
          description: '',
          mimeType: meta.mimeType,
          name: meta.name,
          purpose: (meta.purpose) ? meta.purpose : '',
          organisation: [
            (this.configSvc.userProfile && this.configSvc.userProfile.departmentName) ? this.configSvc.userProfile.departmentName : '',
          ],
          isExternal: meta.mimeType === 'text/x-url',
          primaryCategory: meta.primaryCategory,
          license: 'CC BY 4.0',
          ownershipType: ['createdFor'],
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
    return this.http.post<any>(API_END_POINTS.SEARCH_V6, request)
  }

  getAllUsers(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS}`, filter).pipe(map(res => _.get(res, 'result.response')))
  }
}
