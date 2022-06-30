import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_END_POINTS = {
  UPDATE_ORG_PROFILE: '/apis/proxies/v8/org/v1/profile/patch',
}

export interface IATIOnbaording {
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
  public formValues: IATIOnbaording = {
    instituteProfile: {},
    rolesAndFunctions: {},
    infrastructure: {},
    trainingPrograms: {},
    research: {},
    consultancy: {},
    faculty: {},
    platformWalkthrough: {},
  }

  public formStatus: IATIOnbaording = {
    instituteProfile: false,
    rolesAndFunctions: false,
    infrastructure: false,
    trainingPrograms: false,
    research: false,
    consultancy: false,
    faculty: false,
    platformWalkthrough: false,
  }

  constructor(private http: HttpClient) { }

  updateOrgProfileDetails(data: any) {
    return this.http.patch<any>(API_END_POINTS.UPDATE_ORG_PROFILE, { request: data })
  }

  updateLocalFormValue(keyName: keyof IATIOnbaording, value: any) {
    this.formValues[keyName] = value
  }

  getLocalFormValue(keyName: keyof IATIOnbaording) {
    return this.formValues[keyName]
  }

  updateFormStatus(keyName: keyof IATIOnbaording, value: boolean) {
    // tslint:disable-next-line: no-console
    console.log('updateFormStatus: ', value)
    this.formStatus[keyName] = value
  }

  getFormStatus(keyName: keyof IATIOnbaording) {
    return this.formStatus[keyName]
  }

}
