import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core"
import _ from "lodash"
import { NSWatActivity } from "../../models/activity-wot.model"
import { IWarnError } from "../../models/warn-error.model"
import { WatStoreService } from "../../services/wat.store.service"


@Component({
  selector: 'ws-app-create-workallocation',
  templateUrl: './create-workallocation.component.html',
  styleUrls: ['./create-workallocation.component.scss'],
})
export class CreateWorkallocationComponent implements OnInit, AfterViewInit, OnDestroy {
  canPublish = false
  /**
   * this is for selecting tabs dynamically
   */
  selectedTab = 'officer'
  public officerOffset!: number | null
  public activitiesOffset!: number | null
  public rolesOffset!: number | null
  public competenciesOffset!: number | null
  public levelsOffset!: number | null

  @ViewChild('mainWindow', { static: true }) mainWindowElement!: ElementRef
  @ViewChild('officer', { static: true }) officerElement!: ElementRef
  @ViewChild('activities', { static: true }) activitiesElement!: ElementRef
  @ViewChild('roles', { static: true }) rolesElement!: ElementRef
  @ViewChild('competencies', { static: true }) competenciesElement!: ElementRef
  @ViewChild('levels', { static: true }) levelsElement!: ElementRef
  /**
   * this is for selecting tabs dynamically
   */
  private activitySubscription: any
  private groupSubscription: any
  dataStructure: any = {}
  // tslinr=t
  constructor(private watStore: WatStoreService) {
  }
  ngOnInit(): void {
    this.fetchData()
  }

  @HostListener('window:scroll', ['$event'])
  /**
    * this is for selecting tabs dynamically
    */
  onScroll(_$event: any) {
    // const offset = $event.srcElement.scrollTop || this.document.body.scrollTop || 0
    const offset = window.pageYOffset || 0
    if (this.officerOffset != null && this.activitiesOffset && this.rolesOffset && this.competenciesOffset && this.levelsOffset) {
      if (offset >= this.officerOffset && offset < this.activitiesOffset) {
        this.selectedTab = 'officer'
      } else if (offset >= this.activitiesOffset && offset < this.rolesOffset) {
        this.selectedTab = 'activities'
      } else if (offset >= this.rolesOffset && offset < this.competenciesOffset) {
        this.selectedTab = 'roles'
      } else if (offset >= this.competenciesOffset && offset < this.levelsOffset) {
        this.selectedTab = 'competencies'
      } else if (offset >= this.levelsOffset) {
        this.selectedTab = 'levels'
      } else {
        this.selectedTab = 'officer'
      }
    }
  }
  /**
  * this is for selecting tabs dynamically
  */
  ngAfterViewInit() {
    /**
  * this is for selecting tabs dynamically
  */
    const defaultOffsetToMinus = 146
    this.officerOffset = this.officerElement.nativeElement.offsetTop - defaultOffsetToMinus
    this.activitiesOffset = this.activitiesElement.nativeElement.offsetTop - defaultOffsetToMinus
    this.rolesOffset = this.rolesElement.nativeElement.offsetTop - defaultOffsetToMinus
    this.competenciesOffset = this.competenciesElement.nativeElement.offsetTop - defaultOffsetToMinus
    this.levelsOffset = this.levelsElement.nativeElement.offsetTop - defaultOffsetToMinus
    /**
  * this is for selecting tabs dynamically
  */
  }
  filterComp($element: any, filterType: string) {
    this.selectedTab = filterType
    $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
  }
  get currentProgress(): number {
    return 70
  }
  get getsubPath(): string {
    return `./#${this.selectedTab}`
  }
  fetchData() {
    this.activitySubscription = this.watStore.getactivitiesGroup.subscribe(activities => {
      if (activities.length > 0) {
        this.dataStructure.activityGroups = activities
      }
    })
    this.groupSubscription = this.watStore.getactivitiesGroup.subscribe(comp => {
      if (comp.length > 0) {
        this.dataStructure.compGroups = comp
      }
    })
  }
  get allWarning() {
    let warnings: IWarnError[] = []
    // let warnings: IWarnError | [] = []
    // _.each(this.dataStructure, (ds: any) => {

    // })
    // return warnings
    if (this.dataStructure.activityGroups) {
      warnings = this.calculateWarn(this.dataStructure.activityGroups)
    }
    return warnings
  }
  calculateWarn(data: any[]): IWarnError[] {
    let result: IWarnError[] = []
    let grpDescEmpty = Math.max(_.filter(data, () => ['groupDescription', 'Untited role']).length - 1, 0)
    if (grpDescEmpty) {
      result.push({ type: 'role', counts: grpDescEmpty, label: 'Role description missing' })
    }
    let unmapedActivities = _.size(_.get(_.first(data), 'activities'))
    if (unmapedActivities) {
      result.push({ type: 'activity', counts: unmapedActivities, label: 'Unmapped activities' })
    }

    return result
  }
  get allErrors() {
    let warnings: IWarnError | [] = []

    return warnings
  }
  ngOnDestroy() {
    this.activitySubscription.unsubscribe()
    this.groupSubscription.unsubscribe()
  }
}
