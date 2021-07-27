import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  GET_ALL_ROLES: '/apis/proxies/v8/data/v1/system/settings/get/orgTypeList',
}

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private http: HttpClient) { }
  getAllRoles(): Observable<any> {
    return this.http.get(API_END_POINTS.GET_ALL_ROLES)
  }
}
