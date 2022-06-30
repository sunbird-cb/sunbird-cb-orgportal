import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

import { environment } from '../../../../../../../../src/environments/environment'

const API_END_POINTS = {
  // OLD API
  // CREATE_EVENT: '/apis/authApi/action/content/create?rootOrg=igot&org=dopt',
  // PUBLISH_EVENT: '/apis/authApi/action/content/status/change',
  // SEARCH_EVENT: '/apis/protected/v8/content/searchV6',
  // SEARCH_USERS: '/apis/protected/v8/user/autocomplete/department',

  CREATE_EVENT: '/apis/proxies/v8/event/v4/create',
  UPDATE_EVENT: '/apis/authApi/action/content/v2/hierarchy/update?rootOrg=igot&org=dopt',
  PUBLISH_EVENT: '/apis/proxies/v8/event/v4/publish',
  SEARCH_EVENT: '/apis/proxies/v8/sunbirdigot/read',
  GET_PARTICIPANTS: '/apis/protected/v8/portal/mdo/mydepartment?allUsers=true',
  IMAGE_UPLOAD: '/apis/authContent/upload/igot/dopt/Public',
  SEARCH_USERS: '/apis/proxies/v8/user/v1/autocomplete',
  EVENT_DETAILS: '/apis/proxies/v8/event/v4/read',
  GET_EVENTS: '/apis/proxies/v8/sunbirdigot/search',
  CREATE_ASSET: 'apis/proxies/v8/action/content/v3/create',
  UPLOAD_FILE: 'apis/proxies/v8/upload/action/content/v3/upload',
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {

  constructor(private http: HttpClient) {}

  crreateAsset(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CREATE_ASSET}`, req)
  }

  uploadFile(val: any, formdata: any): Observable<any> {
    this.http.post<any>(`${API_END_POINTS.UPLOAD_FILE}/${val}`, formdata, {
      headers: {
        'content-type': 'application/json',
      },
    })
    return this.http.post<any>(`${API_END_POINTS.UPLOAD_FILE}/${val}`, formdata)
  }

  createEvent(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.CREATE_EVENT, req)
  }

  updateEvent(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.UPDATE_EVENT, req)
  }

  publishEvent(eventId: string): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.PUBLISH_EVENT}/${eventId}`, '')
  }

  searchEvent(req: any) {
    return this.http.post<any>(API_END_POINTS.SEARCH_EVENT, req)
  }

  getEventsList(req: any) {
    return this.http.post<any>(`${API_END_POINTS.GET_EVENTS}`, req)
  }

  getParticipants(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_PARTICIPANTS)
  }

  uploadCoverImage(req: any, eventId: string): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.IMAGE_UPLOAD}/${eventId}/artifacts`, req)
  }

  getEvents(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.SEARCH_EVENT)
  }

  searchUser(value: any): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.SEARCH_USERS}/${value}`)
  }

  getEventDetails(eventID: any): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.EVENT_DETAILS}/${eventID}`)
  }

  getPublicUrl(url: string): string {
    const mainUrl = url.split('/content').pop() || ''
    return `${environment.contentHost}/${environment.contentBucket}/content${mainUrl}`
  }
}
