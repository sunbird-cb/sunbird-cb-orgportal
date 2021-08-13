import { Injectable } from '@angular/core'
// tslint:disable
import _ from 'lodash'
// tslint:enable
import { BehaviorSubject, Observable } from 'rxjs'
import { NSWatActivity } from '../models/activity-wot.model'
import { NSWatCompetency } from '../models/competency-wat.model'
import { NSWatOfficer } from '../models/officer-wat.model'

@Injectable()
export class WatStoreService {
  private activitiesGroup = new BehaviorSubject<NSWatActivity.IActivityGroup[]>([])
  private competencyGroup = new BehaviorSubject<NSWatCompetency.ICompActivityGroup[]>([])
  private officerGroup = new BehaviorSubject<NSWatOfficer.IOfficerGroup[]>([])
  private _competencyGroup = new BehaviorSubject<NSWatCompetency.ICompActivity[]>([])
  private currentProgress = new BehaviorSubject<number>(0)
  private errorCount = new BehaviorSubject<number>(0)
  private finalCompDetail = new BehaviorSubject<NSWatCompetency.ICompActivity[]>([])
  private _triggerSave = new BehaviorSubject<any>({ reload: false, serverCall: false })
  private initCount = 100
  private officerId = ''
  private workOrderId = ''
  constructor() {

  }
  public set setOfficerId(val: any) {
    this.officerId = val
  }
  public get getOfficerId() {
    return this.officerId
  }
  public set setworkOrderId(val: any) {
    this.workOrderId = val
  }
  public get getworkOrderId() {
    return this.workOrderId
  }

  public get getactivitiesGroup(): Observable<NSWatActivity.IActivityGroup[]> {
    return this.activitiesGroup.asObservable()
  }
  setgetactivitiesGroup(data: NSWatActivity.IActivityGroup[], reload = false, serverCall = false) {
    this.activitiesGroup.next(data)
    this._triggerSave.next({ reload, serverCall })
  }
  public get getcompetencyGroup(): Observable<NSWatCompetency.ICompActivityGroup[]> {
    return this.competencyGroup.asObservable()
  }
  /** retrieve Current Comp list of Role */
  public get getcompetencyGroupValue() {
    return this.competencyGroup.value
  }

  setgetcompetencyGroup(data: NSWatCompetency.ICompActivityGroup[], reload = false, serverCall = true) {
    this.competencyGroup.next(data)
    this.setCompGroup(reload, serverCall)
  }
  updateCompGroup(val: NSWatCompetency.ICompActivity[], reload = false, serverCall = true) {
    this.finalCompDetail.next(val)
    this._triggerSave.next({ reload, serverCall })
  }
  public get getUpdateCompGroupO() {
    return this.finalCompDetail.asObservable()
  }
  public getUpdateCompGroupById(locallId: number) {
    return _.first(_.filter(this.finalCompDetail.value, { localId: locallId }))
  }

  setCompGroup(reload = false, serverCall = true) {
    const complist: NSWatCompetency.ICompActivity[] = []
    _.each(_.get(this.competencyGroup, 'value'), (itm: NSWatCompetency.ICompActivityGroup) => {
      if (itm && itm.competincies) {
        itm.competincies.forEach(a => {
          const existing = this.getUpdateCompGroupById(a.localId) || null
          if (existing && a.compName && (a.localId === existing.localId)) {
            const level = _.get(a, 'compLevel') || _.get(existing, 'compLevel')
            const compType = _.get(a, 'compType') || _.get(existing, 'compType')
            const compArea = _.get(a, 'compArea') || _.get(existing, 'compArea')
            const source = _.get(a, 'compSource') || _.get(existing, 'compSource')
            const levelList = _.get(a, 'levelList') || _.get(existing, 'levelList') || []
            const newA = { ...a, levelList, level, compType, compArea, source }
            complist.push(newA)
          } else {
            complist.push(a)
          }
        })
      }
    })
    this._competencyGroup.next(complist)
    this._triggerSave.next({ reload, serverCall })
  }
  public get get_compGrp() {
    return this._competencyGroup.asObservable()
  }
  public get getOfficerGroup(): Observable<NSWatOfficer.IOfficerGroup[]> {
    return this.officerGroup.asObservable()
  }
  setOfficerGroup(data: NSWatOfficer.IOfficerGroup[], reload = false, serverCall = true) {
    this.officerGroup.next(data)
    this._triggerSave.next({ reload, serverCall })
  }
  public setCurrentProgress(progress: number) {
    this.currentProgress.next(progress)
  }
  public get getCurrentProgress(): Observable<number> {
    return this.currentProgress.asObservable()
  }
  public setErrorCount(count: number) {
    this.errorCount.next(count)
  }
  public get getErrorCount(): Observable<number> {
    return this.errorCount.asObservable()
  }
  public get getID() {
    // tslint:disable-next-line
    return ++this.initCount
  }
  public triggerSave(): Observable<any> {
    return this._triggerSave.asObservable()
  }
  clear() {
    this.activitiesGroup = new BehaviorSubject<NSWatActivity.IActivityGroup[]>([])
    this.competencyGroup = new BehaviorSubject<NSWatCompetency.ICompActivityGroup[]>([])
    this.officerGroup = new BehaviorSubject<NSWatOfficer.IOfficerGroup[]>([])
    this._competencyGroup = new BehaviorSubject<NSWatCompetency.ICompActivity[]>([])
    this.finalCompDetail = new BehaviorSubject<NSWatCompetency.ICompActivity[]>([])
    this._triggerSave = new BehaviorSubject<any>({ reload: false, serverCall: false })
    this.currentProgress = new BehaviorSubject<number>(0)
    this.errorCount = new BehaviorSubject<number>(0)
  }
}
