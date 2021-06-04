// import { untilDestroyed } from 'ngx-take-until-destroy'
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
// tslint:disable
import _ from 'lodash'
import { NSWatActivity } from '../../models/activity-wot.model'
import { NSWatCompetency } from '../../models/competency-wat.model'
// tslint:enable
// import { NSWatActivity } from '../../models/activity-wot.model'
import { AllocationService } from '../../services/allocation.service'
import { WatStoreService } from '../../services/wat.store.service'

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
  public competenciesOffset!: number | null
  public competencyDetailsOffset!: number | null

  @ViewChild('mainWindow', { static: true }) mainWindowElement!: ElementRef
  @ViewChild('officer', { static: true }) officerElement!: ElementRef
  @ViewChild('activities', { static: true }) activitiesElement!: ElementRef
  // @ViewChild('roles', { static: true }) rolesElement!: ElementRef
  @ViewChild('competencies', { static: true }) competenciesElement!: ElementRef
  @ViewChild('competencyDetails', { static: true }) competencyDetailsElement!: ElementRef
  /**
   * this is for selecting tabs dynamically
   */
  private activitySubscription: any
  private groupSubscription: any
  officerFormSubscription: any
  dataStructure: any = {}
  departmentName: any
  departmentID: any
  content1 = {
    name: 'Drafting competencies',
    // tslint:disable-next-line: max-line-length
    appIcon: 'https://igot.blob.core.windows.net/public/content/do_11327647969989427214307/artifact/do_11327647970098380814308_1620664026741_test448192519201591623096543.thumb.jpg',
    duration: '12 minutes',
    mimeType: 'video',
  }
  content2 = {
    name: '12 step work allocation process',
    // tslint:disable-next-line: max-line-length
    appIcon: 'https://igot.blob.core.windows.net/public/content/do_11328133285267046414498/artifact/do_11327648079200256014382_1620664160384_gdp11597836661217.thumb.jpg',
    duration: '8 minutes',
    mimeType: 'pdf',
  }
  // tslinr=t
  constructor(
    private watStore: WatStoreService,
    private allocateSrvc: AllocationService,
    private router: Router
  ) {
  }
  ngOnInit(): void {
    this.fetchFormsData()
    this.getdeptUsers()
  }

  getdeptUsers() {
    this.allocateSrvc.getAllUsers().subscribe(res => {
      this.departmentName = res.deptName
      this.departmentID = res.id
    })
  }

  @HostListener('window:scroll', ['$event'])
  /**
    * this is for selecting tabs dynamically
    */
  onScroll(_$event: any) {
    // const offset = $event.srcElement.scrollTop || this.document.body.scrollTop || 0
    const offset = window.pageYOffset || 0
    if (this.officerOffset != null &&
      this.activitiesOffset &&
      this.competenciesOffset &&
      this.competencyDetailsOffset
    ) {
      if (offset >= this.officerOffset && offset < this.activitiesOffset) {
        this.selectedTab = 'officer'
      } else if (offset >= this.activitiesOffset && offset < this.competenciesOffset) {
        this.selectedTab = 'activities'
      } else if (offset >= this.competenciesOffset && offset < this.competencyDetailsOffset) {
        this.selectedTab = 'competencies'
      } else if (offset >= this.competencyDetailsOffset) {
        this.selectedTab = 'competencyDetails'
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
    this.competenciesOffset = this.competenciesElement.nativeElement.offsetTop - defaultOffsetToMinus
    this.competencyDetailsOffset = this.competencyDetailsElement.nativeElement.offsetTop - defaultOffsetToMinus
    /**
  * this is for selecting tabs dynamically
  */
  }
  filterComp($element: any, filterType: string) {
    this.selectedTab = filterType
    $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }
  get currentProgress(): number {
    return 70
  }
  get getsubPath(): string {
    return `./#${this.selectedTab}`
  }
  get getOfficerName(): string {
    return _.get(this.dataStructure, 'officerFormData.officerName')
  }
  // This method is used to fetch the form data from all children components
  fetchFormsData() {
    this.activitySubscription = this.watStore.getactivitiesGroup.subscribe(activities => {
      if (activities.length > 0) {
        this.dataStructure.activityGroups = activities
      }
    })
    this.groupSubscription = this.watStore.getcompetencyGroup.subscribe(comp => {
      if (comp.length > 0) {
        this.dataStructure.compGroups = comp
      }
    })

    this.officerFormSubscription = this.watStore.getOfficerGroup.subscribe(officerFormData => {
      this.dataStructure.officerFormData = officerFormData
    })
  }

  saveWAT() {
    const req = this.getStrcuturedReq()
    console.log(req)
    // this.allocateSrvc.createAllocation(req).subscribe(res => {
    //   if (res) {
    //     this.openSnackbar('Work order saved!')
        this.router.navigate(['/app/workallocation/drafts'])
    //   }
    //   this.watStore.clear()
    // })
  }
  getStrcuturedReq(): any {
    let req = {}
    const officer = this.getUserDetails()
    const roles = this.getRoles
    req = {
      userId: officer.user ? officer.user.userDetails.wid : '',
      deptId: this.departmentID,
      deptName: this.departmentName,
      status: 'DRAFT',
      // activeList: this.ralist,
      userName: officer.officerName,
      userEmail: officer.user ? officer.user.userDetails.email : '',
      userPosition: officer.position,
      positionDescription: officer.positionDescription,
      roleCompetencyList: roles,
      positionId: officer.positionObj.id ? officer.positionObj.id : '',
    }
    return req
  }

  getUserDetails() {
    if (this.dataStructure && this.dataStructure.officerFormData && this.dataStructure.officerFormData.user) {
      return {
        user: this.dataStructure.officerFormData.user,
        positionObj: this.dataStructure.officerFormData.positionObj,
        officerName: this.dataStructure.officerFormData.officerName || '',
        position: this.dataStructure.officerFormData.position || '',
        positionDescription: this.dataStructure.officerFormData.positionDescription || '',
      }
    }
    return {}
  }

  get getRoles() {
    return _.compact(_.map(this.dataStructure.activityGroups, (ag: NSWatActivity.IActivityGroup, index: number) => {
      if (index !== 0) {
        return {
          roleDetails: {
            type: 'ROLE',
            name: ag.groupName,
            description: ag.groupDescription,
            // status: 'VERIFIED',
            // source: 'ISTM',
            childNodes: _.map(ag.activities, (a: NSWatActivity.IActivity) => {
              return {
                type: 'ACTIVITY',
                id: a.activityId,
                name: a.activityName,
                description: a.activityDescription,
                assignedTo: a.assignedTo,
                // status: 'UNVERIFIED',
                // source: 'WAT',
                // parentRole: null,
              }
            }),
          },
          competencyDetails: _.compact(_.map(
            // tslint:disable-next-line: max-line-length
            _.get(_.first(_.flatten(_.filter(this.dataStructure.compGroups, i => i.roleName === ag.groupName))), 'competincies'), (c: NSWatCompetency.ICompActivity) => {
              return {
                type: 'COMPETENCY',
                id: c.compId,
                name: c.compName,
                description: c.compDescription,
                // id='123',
                // compLevel
                // source: 'ISTM',
                // status: 'UNVERIFIED',
                additionalProperties: {
                  competencyArea: c.compArea,
                  competencyType: c.compType,
                },
                // children: [],
              }
            })),
        }
      }
      return undefined
    }))
    // _.chain(this.dataStructure.compGroups).filter(i => i.roleName === ag.groupName)
    // .flatten().map('competincies').map((c: NSWatCompetency.ICompActivity) => {
    // }).flatten().compact().value()
  }

  // private openSnackbar(primaryMsg: string, duration: number = 5000) {
  //   this.snackBar.open(primaryMsg, 'X', {
  //     duration,
  //   })
  // }
  ngOnDestroy() {
    this.activitySubscription.unsubscribe()
    this.groupSubscription.unsubscribe()
    this.officerFormSubscription.unsubscribe()
  }
}
