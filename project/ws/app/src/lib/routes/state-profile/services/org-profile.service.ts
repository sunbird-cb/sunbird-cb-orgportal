import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_END_POINTS = {
  UPDATE_ORG_PROFILE: '/apis/proxies/v8/org/v1/profile/patch',
}

@Injectable({
  providedIn: 'root',
})
export class OrgProfileService {
  private instituteProfile = new BehaviorSubject<any>({})
  constructor(private http: HttpClient) { }

  updateOrgProfileDetails(data: any) {
    return this.http.post<any>(API_END_POINTS.UPDATE_ORG_PROFILE, data)
  }

  updateInstituteProfile(value: any) {
    this.instituteProfile.next(value)
  }

}
