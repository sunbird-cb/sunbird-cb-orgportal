import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import { NsMandatoryCourse } from '../models/mandatory-course.model'
// tslint:disable
import _ from 'lodash'
import { ConfigurationsService } from '@sunbird-cb/utils'
const PROTECTED_SLAG_V8 = '/apis/proxies/v8'
const API_END_POINTS = {
  SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
  CREATE_CONTENT: `${PROTECTED_SLAG_V8}/mdo/content/v3/create`,
  UPDATE_CONTENT: `${PROTECTED_SLAG_V8}/mdo/content/v3/update`,
  EDIT_HIERARCHY: `${PROTECTED_SLAG_V8}/action/content/v3/hierarchy`,
  UPDATE_HIERARCHY: `${PROTECTED_SLAG_V8}/mdo/content/v3/hierarchy/update`,
  PUBLISH_CONTENT: (contentId: string) => `${PROTECTED_SLAG_V8}/mdo/content/v3/publish/${contentId}`,
  CREATE_BATCH: `/apis/authApi/batch/create`,
  ADD_USER_TO_BATCH: `/apis/authApi/batch/addUser`,
  REMOVE_USER_TO_BATCH: `/apis/authApi/batch/removeUser`,
  READ_BATCH: '/apis/protected/v8/cohorts/course/getUsersForBatch',
  GET_ALL_USERS: `/apis/proxies/v8/user/v1/search`,
  UPLOAD: `${PROTECTED_SLAG_V8}/upload/action/content/v3/upload`,
  COMPETENCY: `/apis/protected/v8/frac/getAllNodes/dictionary`,
  UPDATE_BATCH: '/apis/authApi/batch/update',
  REMOVE_BATCH: '/apis/authApi/batch/delete'
}

const BREAD_CRUMB_LIST = [{ title: 'Folders', url: '/app/home/mandatory-courses' }]

@Injectable({
  providedIn: 'root',
})
export class MandatoryCourseService {
  private pageData: any
  private folderSubject = new Subject<any>();
  private batchSubeject = new Subject()
  private breadCrumbList = BREAD_CRUMB_LIST;
  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService
  ) { }

  createContent(meta: {
    name: string, purpose: string, posterImage: string, appIcon: string, description: string, mimeType: string, contentType: string, primaryCategory: string, isExternal: boolean, ownershipType: string[], license: string, visibility: string
  }): Observable<string> {
    let randomNumber = ''
    for (let i = 0; i < 16; i++) {
      randomNumber += Math.floor(Math.random() * 10)
    }

    const requestBody: NsMandatoryCourse.ICreateMetaRequestV2 = {
      request: {
        content: {
          code: randomNumber,
          contentType: meta.contentType,
          createdBy: (this.configSvc.userProfile && this.configSvc.userProfile.userId) || '',
          createdFor: [(this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId) ? this.configSvc.userProfile.rootOrgId : ''],
          creator: (this.configSvc.userProfile && this.configSvc.userProfile.userName) || '',
          description: meta.description,
          mimeType: meta.mimeType,
          name: meta.name,
          purpose: meta.purpose,
          appIcon: meta.appIcon,
          posterImage: meta.posterImage,
          organisation: [
            (this.configSvc.userProfile && this.configSvc.userProfile.departmentName) ? this.configSvc.userProfile.departmentName : '',
          ],
          isExternal: meta.isExternal,
          primaryCategory: meta.primaryCategory,
          ownershipType: meta.ownershipType,
          license: this.pageData.license,
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
          return data.result
        }),
      )
  }

  updateHierarchy(requestParas: any) {
    return this.http.patch(`${API_END_POINTS.UPDATE_HIERARCHY}`, requestParas)
  }

  updateContent(meta: any, id: string) {
    return this.http.patch<any>(
      `${API_END_POINTS.UPDATE_CONTENT}/${id}`,
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

  upload(
    data: FormData,
    id: any,
    isZip = false,
  ): Observable<any> {
    if (isZip) {
      // return this.zipUpload(data, contentData, options)
    }
    const file = data.get('content') as File
    let fileName = file.name
    // if (FIXED_FILE_NAME.indexOf(fileName) < 0) {
    //   fileName = this.appendToFilename(fileName)
    // }
    const newFormData = new FormData()
    newFormData.append('data', file, fileName)
    return this.http.post<any>(
      // tslint:disable-next-line:max-line-length
      // ${CONTENT_BASE}${this.accessService.rootOrg.replace(/ /g, '_')}/${this.accessService.org.replace(/ /g, '_')}/Public/${contentData.contentId.replace('.img', '')}${contentData.contentType}
      `${API_END_POINTS.UPLOAD}/${id}`,
      newFormData,
    )
  }

  fetchSearchData(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SEARCH_V6, request)
  }

  getAllUsers(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS}`, filter).pipe(map(res => _.get(res, 'result.response')))
  }

  addMember(req: any) {
    return this.http.post<any>(`${API_END_POINTS.ADD_USER_TO_BATCH}`, req)
  }
  removeMember(req: any) {
    return this.http.post<any>(`${API_END_POINTS.REMOVE_USER_TO_BATCH}`, req)
  }
  addBatch(req: any) {
    req.request.createdBy = (this.configSvc.userProfile && this.configSvc.userProfile.userId) || ''
    req.request.createdFor = [(this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId) ? this.configSvc.userProfile.rootOrgId : '']
    return this.http.post<any>(`${API_END_POINTS.CREATE_BATCH}`, req)
  }
  updateBatch(req: any, batchId: any) {
    req.request.createdBy = (this.configSvc.userProfile && this.configSvc.userProfile.userId) || ''
    req.request.createdFor = [(this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId) ? this.configSvc.userProfile.rootOrgId : '']
    return this.http.patch<any>(`${API_END_POINTS.UPDATE_BATCH}/${batchId}`, req)
  }
  deleteBatch(req: any) {
    return this.http.post<any>(`${API_END_POINTS.REMOVE_BATCH}`, req)
  }
  getBatchDetails(batchId: any) {
    return this.http.get(`${API_END_POINTS.READ_BATCH}/${batchId}`)
  }
  updatePageData(pageData: any) {
    this.pageData = pageData
  }
  getPageData() {
    return this.pageData
  }
  getEditContent(doId: any) {
    return this.http.get(`${API_END_POINTS.EDIT_HIERARCHY}/${doId}?mode=edit`)
  }
  getCompetencies() {
    return this.http.get(`${API_END_POINTS.COMPETENCY}`)
  }
  sharefolderData(data: any) {
    localStorage.setItem('collectionInfo', JSON.stringify(data))
    this.folderSubject.next(data)
  }
  getfolderData() {
    return this.folderSubject.asObservable()
  }
  getFolderInfo() {
    let collectionInfo = localStorage.getItem('collectionInfo') || ''
    return JSON.parse(collectionInfo)
  }
  removeFolderInfo() {
    localStorage.removeItem('collectionInfo')
  }
  updateBreadcrumbList(link: any) {
    const list = this.breadCrumbList.map((bd: any) => bd.title)
    if (!list.includes(link.title)) {
      this.breadCrumbList.push(link)
    }
  }
  getBreadCrumbList() {
    return this.breadCrumbList
  }
  removeBreadCrum(link: any) {
    this.breadCrumbList = this.breadCrumbList.filter(item => item.title !== link.title)
  }
  getUserId() {
    return (this.configSvc.userProfile && this.configSvc.userProfile.userId) || ''
  }
  updateBatchList(list: any) {
    localStorage.setItem('batchMembersList', JSON.stringify(list))
    this.batchSubeject.next(list)
  }
  getBatchList() {
    let batchList = localStorage.getItem('batchMembersList') || ''
    return JSON.parse(batchList)
  }

}
