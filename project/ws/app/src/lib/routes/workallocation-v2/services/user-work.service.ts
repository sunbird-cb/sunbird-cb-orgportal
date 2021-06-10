import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'

const API_END_POINTS = {
  GET_USER_WORK: ''
}

@Injectable({
  providedIn: 'root',
})
export class UserWorkService {

  constructor(private http: HttpClient) { }
  fetchUserWorkAllocation(workId: string, usersId: string): Observable<any> {
    if (workId && usersId) {
      return this.http.get<any>(`${API_END_POINTS.GET_USER_WORK}/${workId}/${usersId}`)
    } else {
      // tslint:disable
      return of({
        "createdByName": "Mehra",
        "updatedBy": "075e3a3f-1a56-4ea3-9042-c66e2288e60c",
        "unmappedCompetencies": [],
        "unmappedActivities": [
          {
            "submittedFromId": null,
            "level": null,
            "submittedToEmail": "",
            "description": "Human Capital Management",
            "parentRole": null,
            "submittedFromEmail": null,
            "source": null,
            "type": "ACTIVITY",
            "submittedToName": "Final authority",
            "submittedFromName": null,
            "name": "",
            "id": "",
            "submittedToId": "",
            "status": null
          }
        ],
        "positionDescription": "Activity related to Establishment ",
        "updatedByName": "Mehra",
        "userName": "reviwers test",
        "userId": "76cb7c8e-8965-4850-a69c-2818f03eefd7",
        "createdAt": 1623332253581,
        "roleCompetencyList": [
          {
            "competencyDetails": [
              {
                "children": null,
                "name": "",
                "description": null,
                "id": "CID0615",
                "source": "WAT",
                "additionalProperties": {
                  "competencyArea": ""
                },
                "type": "COMPETENCY",
                "status": "UNVERIFIED"
              },
              {
                "children": null,
                "name": "Ability to maintain good relationships with the people who have impact on the work.",
                "description": null,
                "id": "CID0616",
                "source": "WAT",
                "additionalProperties": {
                  "competencyArea": ""
                },
                "type": "COMPETENCY",
                "status": "UNVERIFIED"
              }
            ],
            "roleDetails": {
              "archivedAt": 0,
              "archived": false,
              "addedAt": 0,
              "updatedBy": null,
              "childNodes": [
                {
                  "submittedFromId": null,
                  "level": null,
                  "submittedToEmail": null,
                  "description": "Authorisation of payments to faculty members, staff, public and private parties",
                  "parentRole": null,
                  "submittedFromEmail": null,
                  "source": "WAT",
                  "type": "ACTIVITY",
                  "submittedToName": "",
                  "submittedFromName": null,
                  "name": "",
                  "id": "AID016",
                  "submittedToId": null,
                  "status": "UNVERIFIED"
                },
                {
                  "submittedFromId": null,
                  "level": null,
                  "submittedToEmail": null,
                  "description": "consult MoP, rule books, latest orders. update reading material, ppts . prepare new exercises/update existing ones",
                  "parentRole": null,
                  "submittedFromEmail": null,
                  "source": "WAT",
                  "type": "ACTIVITY",
                  "submittedToName": "",
                  "submittedFromName": null,
                  "name": "Technical functionality",
                  "id": "AID011",
                  "submittedToId": null,
                  "status": "UNVERIFIED"
                },
                {
                  "submittedFromId": null,
                  "level": null,
                  "submittedToEmail": null,
                  "description": "",
                  "parentRole": null,
                  "submittedFromEmail": null,
                  "source": "WAT",
                  "type": "ACTIVITY",
                  "submittedToName": null,
                  "submittedFromName": null,
                  "name": "",
                  "id": "AID0146",
                  "submittedToId": null,
                  "status": "UNVERIFIED"
                }
              ],
              "name": "Assistance to Section Officer/Under Secretary",
              "description": null,
              "id": "RID0232",
              "source": "ISTM",
              "type": "ROLE",
              "status": "UNVERIFIED",
              "updatedAt": 0
            }
          }
        ],
        "positionId": "PID021",
        "createdBy": "075e3a3f-1a56-4ea3-9042-c66e2288e60c",
        "userPosition": "Section Officer (Establishment)",
        "progress": 83,
        "userEmail": "reviewertest@yopmail.com",
        "id": "86dad750-f6cf-490d-85f9-6c86969052ea",
        "workOrderId": "326526f1-c879-4190-84ef-04acbc8505be",
        "errorCount": 4,
        "updatedAt": 1623332253581
      })
      // tslint:disable
    }
  }
}