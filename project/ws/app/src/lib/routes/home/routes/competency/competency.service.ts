import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { Observable } from 'rxjs'

const PROXIES_SLAG_V8 = '/apis/proxies/v8/'
const QUESTION_V1 = `questionset/v1/`


const API_END_POINTS = {
  CREATE_ASSESSMENT_QUESTION_SET: `${PROXIES_SLAG_V8}${QUESTION_V1}create`,
  GET_ASSESSMENT_DATA: `${PROXIES_SLAG_V8}${QUESTION_V1}read/`,
}

@Injectable()
export class CompetencyService {

  assessmentOriginalContent: { [key: string]: any } = {}

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

}
