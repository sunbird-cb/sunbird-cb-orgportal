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

  constructor() {
  }

  ngOnInit() {
  }

  get allWarning() {
    let warnings: IWarnError[] = []
    let calculatedWarn: IWarnError[] = []
    let calculatedWarn2: IWarnError[] = []
    if (this.dataStructure.activityGroups) {
      calculatedWarn = this.calculateWarn(this.dataStructure.activityGroups)
    }
    if (this.dataStructure.officerFormData) {
      calculatedWarn2 = this.calculateOfficerWarning(this.dataStructure.officerFormData)
    }
    warnings = _.union(calculatedWarn, calculatedWarn2)
    return warnings
  }
  calculateWarn(data: any[]): IWarnError[] {
    const result: IWarnError[] = []
    const grpDescEmpty = Math.max(_.filter(data, () => ['groupDescription', 'Untited role']).length - 1, 0)
    if (grpDescEmpty) {
      result.push({ _type: 'warning', type: 'role', counts: grpDescEmpty, label: 'Role description missing' })
    }
    // const unmapedActivities = _.size(_.get(_.first(data), 'activities'))
    // if (unmapedActivities) {
    //   result.push({ _type: 'warning', type: 'activity', counts: unmapedActivities, label: 'Unmapped activities' })
    // }

    return result
  }

  calculateOfficerWarning(data: any): IWarnError[] {
    const result: IWarnError[] = []
    // console.log('data------', data)
    if (data && data.positionDescription === '') {
      result.push({ _type: 'warning', type: 'officer', counts: 0, label: 'Position description missing' })
    }
    return result
  }

  get allErrors() {
    let errors: IWarnError[] = []
    let calculatedErr: IWarnError[] = []
    let calculatedErr2: IWarnError[] = []
    if (this.dataStructure.officerFormData) {
      calculatedErr = (this.calculateOfficerErrors(this.dataStructure.officerFormData))
    }
    if (this.dataStructure.activityGroups) {
      calculatedErr2 = this.calculateActivityError(this.dataStructure.activityGroups)
    }

    errors = _.union(calculatedErr, calculatedErr2)
    return errors
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
    return result
  }

  calculateActivityError(data: any): IWarnError[] {
    const result: IWarnError[] = []
    const unmapedActivities = _.size(_.get(_.first(data), 'activities'))
    if (unmapedActivities) {
      result.push({ _type: 'warning', type: 'activity', counts: unmapedActivities, label: 'Unmapped activities' })
    }
    return result
  }

}
