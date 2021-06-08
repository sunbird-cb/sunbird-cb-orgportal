import { Injectable } from '@angular/core'
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
  constructor() {

  }

  public get getactivitiesGroup(): Observable<NSWatActivity.IActivityGroup[]> {
    return this.activitiesGroup.asObservable()
  }
  setgetactivitiesGroup(data: NSWatActivity.IActivityGroup[]) {
    this.activitiesGroup.next(data)
  }
  public get getcompetencyGroup(): Observable<NSWatCompetency.ICompActivityGroup[]> {
    return this.competencyGroup.asObservable()
  }
  setgetcompetencyGroup(data: NSWatCompetency.ICompActivityGroup[]) {
    this.competencyGroup.next(data)
  }

  setCompGroup(data: NSWatCompetency.ICompActivity[]) {
    this._competencyGroup.next(data)
  }
  public get get_compGrp() {
    return this._competencyGroup.asObservable()
  }
  public get getOfficerGroup(): Observable<NSWatOfficer.IOfficerGroup[]> {
    return this.officerGroup.asObservable()
  }
  setOfficerGroup(data: NSWatOfficer.IOfficerGroup[]) {
    this.officerGroup.next(data)
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
  clear() {
    this.activitiesGroup = new BehaviorSubject<NSWatActivity.IActivityGroup[]>([])
    this.competencyGroup = new BehaviorSubject<NSWatCompetency.ICompActivityGroup[]>([])
    this.officerGroup = new BehaviorSubject<NSWatOfficer.IOfficerGroup[]>([])
    this._competencyGroup = new BehaviorSubject<NSWatCompetency.ICompActivity[]>([])
  }
}
