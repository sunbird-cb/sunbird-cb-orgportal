import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { mergeMap, tap, map } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
// tslint:disable
import _ from 'lodash'
import { environment } from '../../../../../../../../../../src/environments/environment'
import { ConfigurationsService } from '@sunbird-cb/utils'
/* tslint:enable */

const API_END_POINTS = {
  COPY_FRAMEWORK: `/api/framework/v1/copy/${environment.ODCSMasterFramework}`,
  // CREATE_TERM: (frameworkId: string, categoryId: string) =>
  //   `apis/proxies/v8/framework/v1/term/create?framework=${frameworkId}&category=${categoryId}`,
  UPDATE_TERM: (frameworkId: string, categoryId: string, categoryTermCode: string) =>
    `apis/proxies/v8/framework/v1/term/update/${categoryTermCode}?framework=${frameworkId}&category=${categoryId}`,
  PUBLISH_FRAMEWORK: (frameworkName: string) =>
    `apis/proxies/v8/framework/v1/publish/${frameworkName}`,
  UPDATE_ORG: '/apis/proxies/v8/org/v1/update',

  ORGANISATION_FW: (frameworkName: string) =>
    `/apis/proxies/v8/framework/v1/read/${frameworkName}`,
  GET_IGOT_MASTER_DESIGNATIONS: 'apis/proxies/v8/designation/search',
  IMPORT_DESIGNATION: 'api/framework/v1/term/create?',
  ORG_READ: '/apis/proxies/v8/org/v1/read',
  CREATE_TERM: `/apis/proxies/v8/designation/create/term`,
  CREATE_FRAME_WORK: (frameworkName: string, orgId: string, termName: string) => {
    return `/apis/proxies/v8/org/framework/read?frameworkName=${frameworkName}&orgId=${orgId}&termName=${encodeURIComponent(termName)}`
  },
  DELETE_DESIGNATION: (frameworkName: string, category: string) =>
    `/apis/proxies/v8/framework/v1/term/retire?framework=${frameworkName}&category=${category}`,
}

@Injectable({
  providedIn: 'root',
})
export class DesignationsService {
  list = new Map<string, any>()

  orgDesignationList: any = []
  selectedDesignationList: any = []
  frameWorkInfo: any
  userProfile: any

  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService,
  ) { }

  setUserProfile(profileDetails: any) {
    this.userProfile = profileDetails
  }

  get userProfileDetails() {
    return this.userProfile
  }

  createFrameWork(frameworkName: string, orgId: string, termName: string) {
    return this.http.get<any>(API_END_POINTS.CREATE_FRAME_WORK(frameworkName, orgId, termName))
  }

  getIgotMasterDesignations(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.GET_IGOT_MASTER_DESIGNATIONS, req).pipe(
      mergeMap((res: any) => {
        if (res) {
          return this.formateMasterDesignationList(_.get(res, 'result.result', {}))
        }
        return res
      })
    )
  }

  updateSelectedDesignationList(selectedList: any) {
    this.selectedDesignationList = selectedList
  }

  formateMasterDesignationList(response: any): Observable<any> {
    const result: any = {
      formatedDesignationsLsit: [],
      facets: response.facets,
      totalCount: response.totalCount,
    }
    if (response.data) {
      response.data.forEach((masterDesignation: any) => {
        masterDesignation['isOrgDesignation'] = (this.orgDesignationList
          .findIndex((element: any) => element.refId === masterDesignation.id) > -1) ? true : false
        if (this.selectedDesignationList.findIndex((element: any) => element.id === masterDesignation.id) > -1) {
          masterDesignation['selected'] = true
          // result.formatedDesignationsLsit.unshift(masterDesignation)
          result.formatedDesignationsLsit.push(masterDesignation)
        } else {
          masterDesignation['selected'] = masterDesignation['isOrgDesignation']
          result.formatedDesignationsLsit.push(masterDesignation)
        }
        // if (this.selectedDesignationList.findIndex((element: any) => element.id === masterDesignation.id) < 0) {
        //   masterDesignation['selected'] = masterDesignation['isOrgDesignation']
        //   result.formatedDesignationsLsit.push(masterDesignation)
        // }
      })
    }

    return of(result)
  }

  getFrameworkInfo(frameWorkName: string): Observable<any> {
    return this.http.get(`${API_END_POINTS.ORGANISATION_FW(frameWorkName)}`, { withCredentials: true }).pipe(
      tap((response: any) => {
        this.formateData(response)
      }),
    )
  }

  setFrameWorkInfo(frameWorkInfo: any) {
    this.frameWorkInfo = frameWorkInfo
  }

  setCurrentOrgDesignationsList(orgDesignationList: any[]) {
    this.orgDesignationList = orgDesignationList
  }

  formateData(response: any) {
    _.get(response, 'result.framework.categories', []).forEach((a: any) => {
      this.list.set(a.code, {
        code: a.code,
        identifier: a.identifier,
        index: a.index,
        name: a.name,
        selected: a.selected,
        status: a.status,
        description: a.description,
        translations: a.translations,
        category: a.category,
        associations: a.associations,
        // config: this.getConfig(a.code),
        children: this.formateChildren(a.terms || []),
      })
    })

    const allCategories: any = []
    this.list.forEach((a: any) => {
      allCategories.push({
        code: a.code,
        identifier: a.identifier,
        index: a.index,
        name: a.name,
        status: a.status,
        description: a.description,
        translations: a.translations,
      })
    })
    // this.categoriesHash.next(allCategories)

  }

  formateChildren(terms: any[]): any[] {
    return terms.map((c: any) => {
      const associations = c.associations || []
      if (associations.length > 0) {
        Object.assign(c, { children: associations })
        this.formateChildren(c.associations)
      } else {
        Object.assign(c, { children: [] })
      }
      const importedBy = _.get(c, 'additionalProperties.importedById', null) === _.get(this.userProfile, 'userId', '')
        ? 'You' : _.get(c, 'additionalProperties.importedByName', null)
      c['importedByName'] = importedBy,
        c['importedOn'] = _.get(c, 'additionalProperties.importedOn'),
        c['importedById'] = _.get(c, 'additionalProperties.importedById')
      return c
    })
  }

  get getUuid() {
    return uuidv4()
  }

  copyFramework(request: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.COPY_FRAMEWORK}`, request).pipe(map(res => _.get(res, 'result.response')))
  }

  createTerm(requestBody: any) {
    return this.http.post(`${API_END_POINTS.CREATE_TERM}`, requestBody)
  }

  getOrgReadData(organisationId: string): Observable<any> {
    const request = {
      request: {
        organisationId,
      },
    }
    return this.http
      .post<any>(API_END_POINTS.ORG_READ, request)
      .pipe(map((res: any) => {
        this.configSvc.orgReadData = _.get(res, 'result.response')
        return _.get(res, 'result.response')
      }))
    // .toPromise()
  }

  updateTerms(frameworkId: string, categoryId: string, categoryTermCode: string, reguestBody: any) {
    return this.http.patch(`${API_END_POINTS.UPDATE_TERM(
      frameworkId,
      categoryId,
      categoryTermCode
    )}`,                   reguestBody)
  }

  publishFramework(frameworkName: string) {
    return this.http.post(`${API_END_POINTS.PUBLISH_FRAMEWORK(frameworkName)}`, {})
  }

  updateOrg(request: any) {
    return this.http.patch(`${API_END_POINTS.UPDATE_ORG}`, request)
  }

  // getConfig(code: string) {
  //   let categoryConfig: any
  //   if (this.rootConfig && this.rootConfig[0]) {
  //     this.rootConfig.forEach((config: any, index: number) => {
  //       if (this.frameworkId == config.frameworkId) {
  //         categoryConfig = config.config.find((obj: any) => obj.category == code)
  //       }
  //     })
  //   }
  //   return categoryConfig
  // }

  importDesigantion(framework: string, category: string, reqBody: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.IMPORT_DESIGNATION}framework=${framework}&category=${category}`, reqBody)
  }

  deleteDesignation(frameworkName: string, category: string, formBody: any) {
    return this.http.post<any>(`${API_END_POINTS.DELETE_DESIGNATION(frameworkName, category)}`, formBody)
  }
}
