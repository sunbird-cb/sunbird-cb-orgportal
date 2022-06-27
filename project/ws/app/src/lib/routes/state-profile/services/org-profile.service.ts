import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_END_POINTS = {
  UPDATE_ORG_PROFILE: '/apis/proxies/v8/org/v1/profile/patch',
}

interface IATIOnbaording {
  instituteProfile?: any
  rolesAndFunctions?: any
  infrastructure?: any
  trainingPrograms?: any
  research?: any
  consultancy?: any
  faculty?: any
  platformWalkthrough?: any
}

@Injectable({
  providedIn: 'root',
})
export class OrgProfileService {
  public formValues: IATIOnbaording = new Object()

  constructor(private http: HttpClient) { }

  updateOrgProfileDetails(data: any) {
    return this.http.post<any>(API_END_POINTS.UPDATE_ORG_PROFILE, data)
  }

  updateLocalFormValue(keyName: keyof IATIOnbaording, value: any) {
    this.formValues[keyName] = value
  }

  getLocalFormValue(keyName: keyof IATIOnbaording) {
    return this.formValues[keyName]
  }

}
