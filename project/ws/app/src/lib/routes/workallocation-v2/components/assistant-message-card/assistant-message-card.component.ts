import { Component, OnDestroy, OnInit } from '@angular/core'
import { IWarnError } from '../../models/warn-error.model'
// tslint:disable
import _ from 'lodash'
import { WatStoreService } from '../../services/wat.store.service'
// tslint:enable

@Component({
  selector: 'ws-app-assistant-message-card',
  templateUrl: './assistant-message-card.component.html',
  styleUrls: ['./assistant-message-card.component.scss'],
})

export class AssistantMessageCardComponent implements OnInit, OnDestroy {
  dataStructure: any = {}
  private activitySubscription: any
  private groupSubscription: any
  private compDetailsSubscription: any
  private officerFormSubscription: any
  validations!: any

  defaultProgressValues = {
    officer: {
      weight: 10,
      controls: {
        officerName: 33.33,
        position: 33.33,
        positionDescription: 33.33,
      },
    },
    roles: {
      weight: 60,
      minRole: 1,
      minRolePercent: 20,
      minActivity: 1,
      minActivityPercent: 20,
      controls: {
        label: 15,
        description: 15,
        activityDescription: 15,
        activitySubmitTo: 15,
      },
    },
    competecy: {
      weight: 20,
      minCompetency: 1,
      minCompetencyPercent: 50,
      controls: {
        label: 25,
        description: 25,
      },
    },
    competecyDetails: {
      weight: 10,
      controls: {
        level: 33.33,
        type: 33.33,
        area: 33.33,
      },
    },
  }

  constructor(private watStore: WatStoreService) {
  }

  ngOnInit() {
    this.fetchFormsData()
  }
  // This method is used to fetch the form data from all children components
  fetchFormsData() {
    this.activitySubscription = this.watStore.getactivitiesGroup.subscribe(activities => {
      if (activities.length > 0) {
        this.dataStructure.activityGroups = activities
        this.validationsCombined()
      }
    })
    this.groupSubscription = this.watStore.getcompetencyGroup.subscribe(comp => {
      if (comp.length > 0) {
        this.dataStructure.compGroups = comp
        this.validationsCombined()
      }
    })

    this.compDetailsSubscription = this.watStore.getUpdateCompGroupO.subscribe((comp: any) => {
      if (comp && comp.length > 0) {
        this.dataStructure.compDetails = comp
        this.validationsCombined()
      }
    })

    this.officerFormSubscription = this.watStore.getOfficerGroup.subscribe(officerFormData => {
      this.dataStructure.officerFormData = officerFormData
      this.validationsCombined()
    })
  }
  get currentProgress(): number {
    let progress = 0
    progress = this.calculatePercentage()
    return progress
  }

  public progressColor(): string {
    if (this.currentProgress <= 30) {
      return '#D13924'
    } if (this.currentProgress > 30 && this.currentProgress <= 70) {
      return '#E99E38'
    }
    if (this.currentProgress > 70 && this.currentProgress <= 100) {
      return '#1D8923'
    }
    return ''
  }

  public validationsCombined() {
    let allMessages: IWarnError[] = []
    let errorCount = 0

    allMessages = [...this.individualValidations()]
    this.validations = _.groupBy(allMessages, '_type')
    errorCount = _.size(_.get(_.groupBy(allMessages, '_type'), 'error'))
    this.watStore.setErrorCount(errorCount)
  }

  public individualValidations() {
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
          if (!rc.compDescription) {
            noCompDescCount += 1
          }
          if (!rc.compName) {
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
    if (data && data.length) {
      let noLevelCount = 0
      let noAreaCount = 0
      let noTypeCount = 0
      data.map((comp: any) => {
        if (comp.compLevel === '') {
          noLevelCount += 1
        }
        if (comp.compType === '') {
          noTypeCount += 1
        }
        if (comp.compArea === '') {
          noAreaCount += 1
        }
      })
      if (noLevelCount) {
        result.push({ _type: 'warning', type: 'competency', counts: noLevelCount, label: 'Competency level missing' })
      }
      if (noAreaCount) {
        result.push({ _type: 'warning', type: 'competency', counts: noAreaCount, label: 'Competency area missing' })
      }
      if (noTypeCount) {
        result.push({ _type: 'warning', type: 'competency', counts: noTypeCount, label: 'Competency type missing' })
      }
    }
    return result
  }

  calculatePercentage() {
    let progress = 0
    let officerProgress = 0
    let activityProgress = 0
    let competencyProgress = 0
    let compDetailsProgress = 0
    if (this.dataStructure.officerFormData) {
      officerProgress = this.calculateOfficerProgress(this.dataStructure.officerFormData)
      officerProgress = Math.floor(officerProgress * (this.defaultProgressValues.officer.weight / 100))
    }
    if (this.dataStructure.activityGroups) {
      activityProgress = this.calculateActivityProgress(this.dataStructure.activityGroups)
      activityProgress = Math.floor(activityProgress * (this.defaultProgressValues.roles.weight / 100))
    }
    if (this.dataStructure.compGroups) {
      competencyProgress = this.calculateCompProgress(this.dataStructure.compGroups)
      competencyProgress = Math.floor(competencyProgress * (this.defaultProgressValues.competecy.weight / 100))
    }
    if (this.dataStructure.compDetails) {
      compDetailsProgress = this.calculateCompDetailsProgress(this.dataStructure.compDetails)
      compDetailsProgress = Math.floor(compDetailsProgress * (this.defaultProgressValues.competecyDetails.weight / 100))
    }
    try {
      progress = Math.ceil((isNaN(officerProgress) ? 0 : officerProgress) +
        (isNaN(activityProgress) ? 0 : activityProgress) +
        (isNaN(competencyProgress) ? 0 : competencyProgress) +
        (isNaN(compDetailsProgress) ? 0 : compDetailsProgress)) || 0
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.log('ERROR in calculating progress')
      return 0
    }
    this.watStore.setCurrentProgress(progress)
    return progress
  }

  // getRelativePercent(field: string, progress: number) {
  //   return Math.ceil(
  //     this.defaultProgressValues[field].
  //   )
  // }

  calculateOfficerProgress(data: any): number {
    let progress = 0
    if (data && data.officerName) {
      progress += this.defaultProgressValues.officer.controls.officerName
    }
    if (data && data.position) {
      progress += this.defaultProgressValues.officer.controls.position
    }
    if (data && data.positionDescription) {
      progress += this.defaultProgressValues.officer.controls.positionDescription
    }
    return progress >= 99.90 ? 100 : Math.floor(progress)
  }
  calculateActivityProgress(data: any): number {
    let progress = 0
    // excluding unmapped section, considering all other roles(each row) and activities inside
    const roles = _.without(data, _.first(data))
    const rolesCount = roles.length
    if (roles.length >= this.defaultProgressValues.roles.minRole) {
      if (rolesCount >= 1) {
        progress += this.defaultProgressValues.roles.minRolePercent
      }
    }
    const rolePercentList = roles.map((role: any) => {
      let rolePercent = 0
      let roleActivityPercentList: any[] = []
      if (
        role.groupName &&
        typeof (role.groupName) === 'string' &&
        role.groupName.toLowerCase() !== 'Untitled role'.toLowerCase()
      ) {
        rolePercent += this.defaultProgressValues.roles.controls.label
      }
      if (role.groupDescription) {
        rolePercent += this.defaultProgressValues.roles.controls.description
      }
      const roleActivities = _.get(role, 'activities')
      const roleActivitiesCount = roleActivities.length
      if (roleActivities && roleActivities.length >= this.defaultProgressValues.roles.minActivity) {
        rolePercent += this.defaultProgressValues.roles.minActivityPercent
        roleActivityPercentList = roleActivities.map((ra: any) => {
          let roleActivityPercent = 0
          if (ra.activityDescription) {
            roleActivityPercent += this.defaultProgressValues.roles.controls.activityDescription / roleActivitiesCount
          }
          if (ra.assignedTo) {
            roleActivityPercent += this.defaultProgressValues.roles.controls.activitySubmitTo / roleActivitiesCount
          }
          return roleActivityPercent
        })
        // return rolePercent + _.max(roleActivityPercentList)
        if (rolesCount >= 1) {
          return (rolePercent + roleActivityPercentList.reduce((a, b) => a + b, 0)) / rolesCount
        }
        return (rolePercent + roleActivityPercentList.reduce((a, b) => a + b, 0))
      }
    })
    // return Math.ceil(progress + (_.max(rolePercentList) || 0)) >= 100 ? 100 : Math.ceil(progress + (_.max(rolePercentList) || 0))
    return progress + rolePercentList.reduce((a, b) => a + b, 0) >= 99.99 ?
      100 :
      progress + rolePercentList.reduce((a, b) => a + b, 0)
  }
  calculateCompProgress(data: any): number {
    const progress = 0
    // excluding unmapped section, considering all other roles(each row) and competencies inside
    const roles = _.without(data, _.first(data))
    const rolesCount = roles.length
    const compPercentList = roles.map((comp: any) => {
      let compPercent = 0
      let roleCompPercentList: any[] = []
      const roleComps = _.get(comp, 'competincies')
      const roleCompsCount = roleComps.length
      if (roleComps && roleComps.length >= this.defaultProgressValues.competecy.minCompetency) {
        compPercent += (this.defaultProgressValues.competecy.minCompetencyPercent)
      }
      roleCompPercentList = roleComps.map((rc: any) => {
        let roleCompPercent = 0
        if (rc.compDescription) {
          roleCompPercent += this.defaultProgressValues.competecy.controls.description / roleCompsCount
        }
        if (rc.compName) {
          roleCompPercent += this.defaultProgressValues.competecy.controls.label / roleCompsCount
        }
        return roleCompPercent
      })
      if (rolesCount >= 1) {
        return (compPercent + roleCompPercentList.reduce((a, b) => a + b, 0)) / rolesCount
      }
      return (compPercent + roleCompPercentList.reduce((a, b) => a + b, 0))
    })
    return progress + compPercentList.reduce((a, b) => a + b, 0) >= 99.99 ?
      100 :
      progress + compPercentList.reduce((a, b) => a + b, 0)
  }
  calculateCompDetailsProgress(data: any): number {
    let progress = 0
    if (data && data.length) {
      data.map((comp: any) => {
        if (comp.compLevel) {
          progress += this.defaultProgressValues.competecyDetails.controls.level / data.length
        }
        if (comp.compType) {
          progress += this.defaultProgressValues.competecyDetails.controls.type / data.length
        }
        if (comp.compArea) {
          progress += this.defaultProgressValues.competecyDetails.controls.area / data.length
        }
      })
    }
    return progress >= 99.90 ? 100 : Math.floor(progress)
  }

  ngOnDestroy() {
    this.activitySubscription.unsubscribe()
    this.groupSubscription.unsubscribe()
    this.officerFormSubscription.unsubscribe()
    this.compDetailsSubscription.unsubscribe()
  }

}
