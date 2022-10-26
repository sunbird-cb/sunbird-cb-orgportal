import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { Observable } from 'rxjs'
import { NSApiRequest } from './quiz/interface/apiRequest'

const PROXIES_SLAG_V8 = '/apis/proxies/v8/'
const QUESTION_V1 = `questionset/v1/`

const API_END_POINTS = {
  CREATE_ASSESSMENT_QUESTION_SET: `${PROXIES_SLAG_V8}${QUESTION_V1}create`,
  GET_ASSESSMENT_DATA: `${PROXIES_SLAG_V8}${QUESTION_V1}read/`,
  DELETE_CONTENT: `${PROXIES_SLAG_V8}/v1/content/retire`,
  UPDATE_ASSESSMENT_HIERARCHY: `${PROXIES_SLAG_V8}${QUESTION_V1}hierarchy/update`,
  GET_ASSESSMENT_HIERARCHY: `${PROXIES_SLAG_V8}${QUESTION_V1}hierarchy/`,
  GET_QUESTION_DETAILS: `${PROXIES_SLAG_V8}cbp/question/list`
}

@Injectable()
export class CompetencyService {

  assessmentOriginalContent: { [key: string]: any } = {}
  assessmentHierarchyTree: any = {}
  parentContent: string = ''

  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService,
  ) { }

  createNewAssessment(requestBody: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CREATE_ASSESSMENT_QUESTION_SET}`, requestBody)
  }

  getAssessmentConfig(): Observable<any> {
    return this.http.get<any>(
      `${this.configSvc.sitePath}/feature/competency-assessment-config.json`
    )
  }

  readAssessmentQuestionSet(id: string): Observable<any> {
    return this.http.get<any>(
      `${API_END_POINTS.GET_ASSESSMENT_DATA}${id}`,
    )
  }

  setAssessmentOriginalMetaHierarchy(meta: any) {
    this.assessmentOriginalContent[meta.identifier] = meta
    if (meta.children && meta.children.length > 0) {
      meta.children.forEach((element: any) => {
        this.setAssessmentOriginalMetaHierarchy(element)
      })
    }
  }

  getAssessmentOriginalMeta(id: string) {
    const returningData = this.assessmentOriginalContent[id]
    return returningData
  }

  updateAssessmentHierarchy(meta: NSApiRequest.IContentUpdateV3) {
    return this.http.patch<null>(
      `${API_END_POINTS.UPDATE_ASSESSMENT_HIERARCHY}`,
      meta,
    )
  }

  getAssessmentHierarchy(id: string) {
    return this.http.get<null>(
      `${API_END_POINTS.GET_ASSESSMENT_HIERARCHY}${id}?mode=edit`
    )
  }

  getQuestionDetailsApi(requestPayload: any) {
    return this.http.post<null>(
      `${API_END_POINTS.GET_QUESTION_DETAILS}`, requestPayload
    )
  }

  getAssessmentTreeHierarchy(id: string, questionSet?: any, question?: any) {
    const contentData = this.getAssessmentOriginalMeta(id)
    this.assessmentHierarchyTree[contentData.identifier] = {
      name: contentData.name,
      root: true,
      children: (contentData.children) ? contentData.children.map((v: any) => {
        const child = v.identifier
        return child
      }) : [],
    }
    if (contentData.children && contentData.children.length > 0) {
      contentData.children.forEach((element: any) => {
        this.assessmentHierarchyTree[element.identifier] = {
          children: (element.children && element.children.length > 0) ? element.children.map((v: any) => {
            const child = v.identifier
            return child
          }) : [],
        }
      })
    }
    if (questionSet) {
      if (Object.keys(this.assessmentHierarchyTree).includes(questionSet)) {
        this.assessmentHierarchyTree[questionSet].children.push(question)
      } else {
        this.assessmentHierarchyTree[contentData.identifier].children.push(questionSet)
      }
    }
    return this.assessmentHierarchyTree
  }

  deleteQuestionFromStoreData(parentId: string, deleteID: string, action: string) {
    const contentData = this.getAssessmentOriginalMeta(parentId)
    if (contentData && contentData.children && contentData.children.length > 0) {
      if (action === 'deleteQuestion') {
        contentData.children.forEach((element: any) => {
          if (element && element.children && element.children.length > 0) {
            element.children = element.children.filter((v: any) => v.identifier !== deleteID)
          }
        })
      } else if (action === 'deleteSection') {
        contentData.children = contentData.children.filter((v: any) => v.identifier !== deleteID)
      }
    }
    this.setAssessmentOriginalMetaHierarchy(contentData)
  }

  deleteContent(tempOptions: any) {
    return this.http.delete<any>(`${API_END_POINTS.DELETE_CONTENT}`, tempOptions)
  }

}
