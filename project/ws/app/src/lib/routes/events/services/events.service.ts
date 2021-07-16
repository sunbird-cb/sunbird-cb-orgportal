import { Injectable } from '@angular/core'
import { HttpClient, HttpBackend } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  // OLD API
  // CREATE_EVENT: '/apis/authApi/action/content/create?rootOrg=igot&org=dopt',
  // PUBLISH_EVENT: '/apis/authApi/action/content/status/change',
  // SEARCH_EVENT: '/apis/protected/v8/content/searchV6',
  // SEARCH_USERS: '/apis/protected/v8/user/autocomplete/department',

  CREATE_EVENT: '/api/event/v4/create',
  UPDATE_EVENT: '/apis/authApi/action/content/v2/hierarchy/update?rootOrg=igot&org=dopt',
  PUBLISH_EVENT: '/api/event/v4/publish',
  SEARCH_EVENT: '/apis/proxies/v8/sunbirdigot/read',
  GET_PARTICIPANTS: '/apis/protected/v8/portal/mdo/mydepartment?allUsers=true',
  IMAGE_UPLOAD: '/apis/authContent/upload/igot/dopt/Public',
  SEARCH_USERS: '/apis/protected/v8/user/autocomplete',
  EVENT_DETAILS: '/api/event/v4/read',
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {

  private newHttp: HttpClient
  private newHttp2: HttpClient
  private newHttp3: HttpClient

  constructor(private http: HttpClient, handler: HttpBackend, handler2: HttpBackend, handler3: HttpBackend) {
    this.newHttp = new HttpClient(handler)
    this.newHttp2 = new HttpClient(handler2)
    this.newHttp3 = new HttpClient(handler3)
  }

  createEvent(req: any): Observable<any> {
    const options = {
      headers: {
        // tslint:disable-next-line:max-line-length
        Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJRekw4VVA1dUtqUFdaZVpMd1ZtTFJvNHdqWTg2a2FrcSJ9.TPjV0xLacSbp3FbJ7XeqHoKFN35Rl4YHx3DZNN9pm0o',
      },
    }
    return this.newHttp.post<any>(API_END_POINTS.CREATE_EVENT, req, options)
  }

  updateEvent(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.UPDATE_EVENT, req)
  }

  publishEvent(eventId: string): Observable<any> {
    const options = {
      headers: {
        // tslint:disable-next-line:max-line-length
        Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJRekw4VVA1dUtqUFdaZVpMd1ZtTFJvNHdqWTg2a2FrcSJ9.TPjV0xLacSbp3FbJ7XeqHoKFN35Rl4YHx3DZNN9pm0o',
      },
    }
    return this.newHttp2.post<any>(`${API_END_POINTS.PUBLISH_EVENT}/${eventId}`, '', options)
  }

  searchEvent(req: any) {
    return this.http.post<any>(API_END_POINTS.SEARCH_EVENT, req)
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
    const options = {
      headers: {
        // tslint:disable-next-line:max-line-length
        Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJRekw4VVA1dUtqUFdaZVpMd1ZtTFJvNHdqWTg2a2FrcSJ9.TPjV0xLacSbp3FbJ7XeqHoKFN35Rl4YHx3DZNN9pm0o',
      },
    }
    return this.newHttp3.get<any>(`${API_END_POINTS.EVENT_DETAILS}/${eventID}`, options)
  }
}
