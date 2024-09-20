import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { map, retry } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'

// tslint:enable

const API_END_POINTS = {
  GET_ALL_USERS: '/apis/proxies/v8/user/v1/search',
  GET_MY_DEPARTMENT: '/apis/protected/v8/portal/mdo/mydepartment?allUsers=true',
  CREATE_USER: 'apis/protected/v8/user/profileDetails/createUser',
  PROFILE_REGISTRY_V1: '/apis/proxies/v8/api/user/v2/read/',
  PROFILE_REGISTRY_V2: '/apis/proxies/v8/api/user/v2/read',
  CREATE_PROFILE_REGISTRY: '/apis/protected/v8/user/profileRegistry/createUserRegistryV2',
  ADD_USER_TO_DEPARTMENT: '/apis/proxies/v8/user/private/v1/assign/role',
  WF_HISTORY_BY_APPID: 'apis/protected/v8/workflowhandler/historyByApplicationId/',
  SEARCH_USER: 'apis/protected/v8/user/autocomplete/department',
  USER_BDD: '/apis/protected/v8/portal/mdo/deptAction/userrole',
  ACTIVE_USER: 'apis/proxies/v8/user/v1/unblock',
  DE_ACTIVE_USER: 'apis/proxies/v8/user/v1/block',
  NEW_USER_BLOCK_API: '/apis/proxies/v8/user/v1/block',
  NEW_USER_UN_BLOCK_API: '/apis/proxies/v8/user/v1/unblock',
  SEARCH_USER_TABLE: '/apis/proxies/v8/user/v1/search',
  getDesignation: '/apis/proxies/v8/user/v1/positions',
  updateUserDetails: '/apis/proxies/v8/user/v1/admin/extPatch',
  SEND_OTP: '/apis/proxies/v8/otp/v1/generate',
  RESEND_OTP: '/apis/proxies/v8/otp/v1/generate',
  VERIFY_OTP: '/apis/proxies/v8/otp/v1/verify',
  getMasterLanguages: '/apis/protected/v8/user/profileRegistry/getMasterLanguages',
  GET_GROUPS: '/api/user/v1/groups',
  getMasterNationlity: '/apis/protected/v8/user/profileRegistry/getMasterNationalities',
  editProfileDetails: '/apis/proxies/v8/user/v1/extPatch',
  getPendingFields: '/apis/proxies/v8/workflow/v2/userWFApplicationFieldsSearch',
  getApprovalPendingFields: '/apis/proxies/v8/workflow/v2/userWFApplicationFieldsSearch',
  getPendingRequests: '/apis/proxies/v8/workflow/admin/pending/request',
  GET_ALL_USERS_V3: '/apis/proxies/v8/user/v3/search',
}

@Injectable()
export class UsersService {
  handleContentPageChange = new Subject()
  filterToggle = new Subject()
  clearFilter = new Subject()
  getFilterDataObject = new Subject()

  mentorList$ = new Subject()
  constructor(private http: HttpClient) { }

  getAllUsers(filter: object): Observable<any> {
    // console.log()
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS}`, filter).pipe(map(res => _.get(res, 'result.response')))
  }

  getAllUsersV3(filter: object): Observable<any> {
    // console.log()
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS_V3}`, filter).pipe(map(res => _.get(res, 'result.response')))
  }

  getMyDepartment(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_MY_DEPARTMENT}`)
  }

  createUser(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.CREATE_USER, req)
  }

  getUserById(userid: string): Observable<any> {
    if (userid) {
      return this.http.get<any>(API_END_POINTS.PROFILE_REGISTRY_V1 + userid).pipe(map(resp => _.get(resp, 'result.response')))
    }
    return this.http.get<any>(API_END_POINTS.PROFILE_REGISTRY_V2).pipe(map(resp => _.get(resp, 'result.response')))
  }

  createUserById(id: any, req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CREATE_PROFILE_REGISTRY}/${id}`, req)
  }

  /** new API add roles */
  addUserToDepartment(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.ADD_USER_TO_DEPARTMENT}`, req)
  }

  // addUserRoleToDepartment(req: any): Observable<any> {
  //   return this.http.patch<any>(`${API_END_POINTS.ADD_USER_TO_DEPARTMENT}/userrole`, req)
  // }

  getWfHistoryByAppId(appid: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.WF_HISTORY_BY_APPID + appid)
  }

  onSearchUserByEmail(email: string, req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.SEARCH_USER}/${email}`, req)
  }
  blockUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.USER_BDD}/`, user)
  }
  deActiveUser(user: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.DE_ACTIVE_USER}/`, user)
  }
  activeUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.ACTIVE_USER}/`, user)
  }
  deleteUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.USER_BDD}/`, user)
  }

  // getBulkUploadData(): Observable<any> {
  //   return this.http.get<any>(`${API_END_POINTS.GET_BULKUPLOAD_DATA}`)
  // }

  newBlockUser(loggedInUser: string, userId: string): Observable<any> {
    const org = {
      request: {
        userId,
        requestedBy: loggedInUser,
      },
    }
    return this.http.post<any>(`${API_END_POINTS.NEW_USER_BLOCK_API}`, org)
  }
  newUnBlockUser(loggedInUser: string, userId: string): Observable<any> {
    const org = {
      request: {
        userId,
        requestedBy: loggedInUser,
      },
    }
    return this.http.post<any>(`${API_END_POINTS.NEW_USER_UN_BLOCK_API}`, org)
  }

  // getAllKongUsers(filters: any, pageLimit: number = 20, offsetNum: number = 0, query?: any): Observable<any> {
  // console.log('query--==+++', query)
  // let reqBody
  // if (query && query.sortOrder == "alphabetical") {
  //   reqBody = {
  //     request: {
  //       filters,
  //       limit: pageLimit,
  //       offset: offsetNum,
  //       query: query.searchText,
  //       sort_by: {
  //         firstName: 'asc',
  //       },
  //     },
  //   }
  // }
  // if (query && query.sortOrder == "oldest") {
  //   reqBody = {
  //     request: {
  //       filters,
  //       limit: pageLimit,
  //       offset: offsetNum,
  //       query: query.searchText,
  //       sort_by: {
  //         "createdDate": "desc"
  //       },
  //     },
  //   }
  // }
  // if (query && query.sortOrder == "newest") {
  //   reqBody = {
  //     request: {
  //       filters,
  //       limit: pageLimit,
  //       offset: offsetNum,
  //       query: query.searchText,
  //       sort_by: {
  //         "createdDate": "asc",
  //       },
  //     },
  //   }
  // }
  // if (!query) {
  //   reqBody = {
  //     request: {
  //       filters,
  //       limit: pageLimit,
  //       offset: offsetNum,
  //       query: query.searchText,
  //       sort_by: {
  //         firstName: 'asc',
  //       },
  //     },
  //   }
  // }
  // reqBody = {
  //   request: {
  //     filters,
  //     limit: pageLimit,
  //     offset: offsetNum,
  //     query: query.searchText,
  //     sort_by: { "firstName": "asc" }
  //     //  ("firstName": "asc") ? (query.sortOrder == "alphabetical") :
  //     // { "createdOn": "desc" ? (query.sortOrder == "oldest") : '' },
  //     // { "createdOn": "asc" ? (query.sortOrder == "newest") : '' },
  //     // (query.sortOrder == "alphabetical") ? ("firstName" : "asc")

  //   }
  // }
  getAllKongUsers(reqBody: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS}`, reqBody)
    // return
  }
  // getAllRoleUsers(depId: string, role: {}): Observable<any> {
  getAllRoleUsers(depId: string, role: string): Observable<any> {
    const reqBody = {
      request: {
        filters: {
          rootOrgId: depId,
          status: 1,
          'organisations.roles':
            [role],

        },
        limit: 1,
      },
    }
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS}`, reqBody).pipe(
      retry(1),
      map(
        (data: any) => ({ role, count: _.get(data, 'result.response.count') })))
  }
  getTotalRoleUsers(depId: string, role: string): Observable<any> {
    const reqBody = {
      request: {
        filters: {
          rootOrgId: depId,
          // status: 1,
          'organisations.roles':
            [role],

        },
        // limit: 1,
      },
    }
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_USERS}`, reqBody).pipe(
      retry(1),
      map(
        (data: any) => ({ role, count: _.get(data, 'result.response') })))
  }

  searchUserByenter(value: string, rootOrgId: string) {
    const reqBody = {
      request: {
        query: value,
        filters: {
          rootOrgId,
        },
      },
    }

    return this.http.post<any>(`${API_END_POINTS.SEARCH_USER_TABLE}`, reqBody)
  }

  checkForUserReport(url: string) {
    return this.http.get<any>(url)
  }

  getDesignations(_req?: any) {
    return this.http.get<any>(API_END_POINTS.getDesignation)
  }

  updateUserDetails(reqBody: any) {
    return this.http.post<any>(`${API_END_POINTS.updateUserDetails}`, reqBody)
  }

  sendOtp(value: any, type: string): Observable<any> {
    const reqObj = {
      request: {
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.SEND_OTP, reqObj)
  }
  resendOtp(value: any, type: string) {
    const reqObj = {
      request: {
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.RESEND_OTP, reqObj)

  }
  verifyOTP(otp: number, value: any, type: string) {
    const reqObj = {
      request: {
        otp,
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.VERIFY_OTP, reqObj)

  }

  getMasterLanguages(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.getMasterLanguages)
  }

  getGroups(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_GROUPS)
  }

  getMasterNationlity(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.getMasterNationlity)
  }

  editProfileDetails(data: any) {
    return this.http.post<any>(API_END_POINTS.editProfileDetails, data)
  }

  listApprovalPendingFields() {
    return this.http.post<any>(API_END_POINTS.getPendingFields, {
      serviceName: 'profile',
      applicationStatus: 'SEND_FOR_APPROVAL',
    })
  }

  fetchApprovalPendingFields() {
    return this.http.post<any>(API_END_POINTS.getApprovalPendingFields, {
      serviceName: 'profile',
      applicationStatus: 'SEND_FOR_APPROVAL',
    })
  }

  listRejectedFields() {
    return this.http.post<any>(API_END_POINTS.getPendingFields, {
      serviceName: 'profile',
      applicationStatus: 'REJECTED',
    })
  }

  fetchPendingRequests() {
    return this.http.get<any>(API_END_POINTS.getPendingRequests)
  }

}
