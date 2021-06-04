import { Component, Input, OnInit } from '@angular/core'
import { IWarnError } from '../../models/warn-error.model'
// tslint:disable
import _ from 'lodash'
// tslint:enable

@Component({
  selector: 'ws-app-assistant-message-card',
  templateUrl: './assistant-message-card.component.html',
  styleUrls: ['./assistant-message-card.component.scss'],
})

export class AssistantMessageCardComponent implements OnInit {
  @Input() dataStructure: any
  defaultProgressValues = {
    officer: {
      weight: 30,
      controls: {
        officerName: 33.33,
        position: 33.33,
        positionDescription: 33.33,
      },
    },
    roles: {
      weight: 30,
      controls: {
        officer: 33.33,
        offiver: 33.33,
        positionDescription: 33.33,
      },
    },
  }

  constructor() {
  }

  ngOnInit() {
  }
  getColor(currentProgress: any) {
    return currentProgress > 40 ? currentProgress > 70 ? 'accent' : 'primary' : 'warn'
  }
  get currentProgress(): number {
    let progress = 0
    progress = this.calculatePercentage()
    return progress
  }

  get validations() {
    let allMessages: IWarnError[] = []
    allMessages = [...this.individualValidations]
    return _.groupBy(allMessages, '_type')
  }

  get individualValidations() {
    let validations: IWarnError[] = []
    let officerValidations: IWarnError[] = []
    let activityValidations: IWarnError[] = []
    let competencyValidations: IWarnError[] = []
    let compDetailsValidations: IWarnError[] = []
    if (this.dataStructure.officerFormData) {
      officerValidations = this.calculateOfficerErrors(this.dataStructure.officerFormData)
    }
    if (this.dataStructure.activityGroups) {
      activityValidations = this.calculateActivityError(this.dataStructure.activityGroups)
    }
    if (this.dataStructure.compGroups) {
      competencyValidations = this.calculateCompError(this.dataStructure.compGroups)
    }
    if (this.dataStructure.compDetails) {
      compDetailsValidations = this.calculateCompDetailsError(this.dataStructure.compDetails)
    }
    validations = _.union(officerValidations, activityValidations, competencyValidations, compDetailsValidations)
    return validations
  }

  calculateOfficerErrors(data: any): IWarnError[] {
    const result: IWarnError[] = []
    // console.log('data------', data)
    if (data && data.officerName === '' && (data.position !== '' || data.positionDescription !== '')) {
      result.push({ _type: 'error', type: 'officer', counts: 0, label: 'Officer name is empty' })
    }
    if (data && data.position === '' && (data.officerName !== '' || data.positionDescription !== '')) {
      result.push({ _type: 'error', type: 'officer', counts: 0, label: 'Postion missing' })
    }
    if (data && data.positionDescription === '') {
      result.push({ _type: 'warning', type: 'officer', counts: 0, label: 'Position description missing' })
    }
    return result
  }

  calculateActivityError(data: any): IWarnError[] {
    const result: IWarnError[] = []
    const unmapedActivitiesCount = _.size(_.get(_.first(data), 'activities'))
    if (unmapedActivitiesCount) {
      result.push({ _type: 'error', type: 'activity', counts: unmapedActivitiesCount, label: 'Unmapped activities' })
    }
    const unmapedActivities = _.get(_.first(data), 'activities')
    let noActivityDescCount = 0
    let noAssignedToCount = 0
    unmapedActivities.map((ua: any) => {
      if (ua.activityDescription === '') {
        noActivityDescCount += 1
      }
      if (ua.assignedTo === '') {
        noAssignedToCount += 1
      }
    })
    // excluding unmapped section, considering all other roles(each row) and activities inside
    const roles = _.without(data, _.first(data))
    let noActivitiesCount = 0
    // let noAssignedToCount = 0
    // let noActivityDescCount = 0
    let roleNameCount = 0
    let roleDescriptionCount = 0
    roles.map((role: any) => {
      const roleActivities = _.get(role, 'activities')
      if (!role.groupName) {
        roleNameCount += 1
      }
      if (role.groupName && typeof (role.groupName) === 'string' && role.groupName.toLowerCase() === 'Untitled role'.toLowerCase()) {
        roleNameCount += 1
      }
      if (!role.groupDescription) {
        roleDescriptionCount += 1
      }
      if (roleActivities && !roleActivities.length) {
        noActivitiesCount += 1
      } else {
        roleActivities.map((ra: any) => {
          if (!ra.activityDescription) {
            noActivityDescCount += 1
          }
          if (!ra.assignedTo) {
            noAssignedToCount += 1
          }
        })
      }
    })
    if (noAssignedToCount) {
      result.push({ _type: 'error', type: 'activity', counts: noAssignedToCount, label: 'Submit to is missing' })
    }
    if (noActivityDescCount) {
      result.push({ _type: 'error', type: 'activity', counts: noActivityDescCount, label: 'Activity description missing' })
    }
    if (noActivitiesCount) {
      result.push({ _type: 'error', type: 'role', counts: noActivitiesCount, label: 'No activities mapped' })
    }
    if (roleNameCount) {
      result.push({ _type: 'error', type: 'role', counts: roleNameCount, label: 'Role label missing' })
    }
    if (roleDescriptionCount) {
      result.push({ _type: 'warning', type: 'role', counts: roleDescriptionCount, label: 'Role description missing' })
    }
    return result
  }

  calculateCompError(data: any): IWarnError[] {
    const result: IWarnError[] = []
    const unmapedCompsCount = _.size(_.get(_.first(data), 'competincies'))
    if (unmapedCompsCount) {
      result.push({ _type: 'error', type: 'competency', counts: unmapedCompsCount, label: 'Unmapped competencies' })
    }
    const unmapedComps = _.get(_.first(data), 'competincies')
    let noCompDescCount = 0
    let noCompLableCount = 0
    unmapedComps.map((uc: any) => {
      if (!uc.compDescription) {
        noCompDescCount += 1
      }
      if (!uc.compName) {
        noCompLableCount += 1
      }
    })
    // excluding unmapped section, considering all other roles(each row) and competencies inside
    const competencies = _.without(data, _.first(data))
    let noCompCount = 0
    // let compLableCount = 0
    // let compDescriptionCount = 0
    competencies.map((comp: any) => {
      const roleComps = _.get(comp, 'competincies')
      if (roleComps && !roleComps.length) {
        noCompCount += 1
      } else {
        roleComps.map((rc: any) => {
          if (rc.compDescription === '') {
            noCompDescCount += 1
          }
          if (rc.compName === '') {
            noCompLableCount += 1
          }
        })
      }
    })
    if (noCompCount) {
      result.push({ _type: 'warning', type: 'competency', counts: noCompCount, label: 'No competencies mapped' })
    }
    if (noCompLableCount) {
      result.push({ _type: 'error', type: 'competency', counts: noCompLableCount, label: 'Competency label missing' })
    }
    if (noCompDescCount) {
      result.push({ _type: 'warning', type: 'competency', counts: noCompDescCount, label: 'Competency description missing' })
    }
    return result
  }

  calculateCompDetailsError(data: any): IWarnError[] {
    const result: IWarnError[] = []
    if (data && data.compDetails && data.compDetails.length) {
      let noLevelCount = 0
      let noAreaCount = 0
      let noTypeCount = 0
      data.compDetails.map((comp: any) => {
        if (comp.compLevel === '') {
          noLevelCount += 1
        }
        if (comp.compType === '') {
          noTypeCount += 1
        }
        if (comp.compArea === '') {
          noAreaCount += 1
        }
        if (noLevelCount) {
          result.push({ _type: 'warning', type: 'competency', counts: noLevelCount, label: 'Competency level missing' })
        }
        if (noAreaCount) {
          result.push({ _type: 'warning', type: 'competency', counts: noAreaCount, label: 'Competency area missing' })
        }
        if (noTypeCount) {
          result.push({ _type: 'warning', type: 'competency', counts: noTypeCount, label: 'Competency type missing' })
        }
      })
    }
    return result
  }

  calculatePercentage() {
    return 30
  }

}
