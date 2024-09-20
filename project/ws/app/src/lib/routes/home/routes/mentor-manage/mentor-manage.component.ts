import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
// import { environment } from 'src/environments/environment'
import { PageEvent } from '@angular/material'
import { EventService } from '@sunbird-cb/utils'
import { NsContent } from '@sunbird-cb/collection'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { UsersService } from '../../../users/services/users.service'
import { LoaderService } from '../../../../../../../../../src/app/services/loader.service'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
import { ReportsVideoComponent } from '../reports-video/reports-video.component'

@Component({
  selector: 'ws-app-mentor-manage',
  templateUrl: './mentor-manage.component.html',
  styleUrls: ['./mentor-manage.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-col' },
  /* tslint:enable */
})
export class MentorManageComponent implements OnInit, OnDestroy {
  /* tslint:disable */
  Math: any
  /* tslint:enable */
  currentFilter = 'verified'
  // filterPath = '/app/home/users'
  discussionList!: any
  discussProfileData!: any
  portalProfile!: NSProfileDataV2.IProfile
  userDetails: any
  location!: string | null
  tabs: any
  isLoading = false
  // tabsData: NSProfileDataV2.IProfileTab[]
  currentUser!: any
  connectionRequests!: any[]
  data: any = []
  usersData!: any
  configSvc: any
  mentorUsersData!: any[]
  verifiedUsersData!: any[]
  nonverifiedUsersData!: any[]
  notmyuserUsersData!: any[]

  mentorUsersDataCount?: any | 0
  verifiedUsersDataCount?: any | 0
  content: NsContent.IContent = {} as NsContent.IContent
  isMdoAdmin = false

  reportsNoteList: string[] = []

  currentOffset = 0
  limit = 20
  pageIndex = 0
  searchQuery = ''
  rootOrgId: any
  currentUserStatus: any
  filetrGroup = []
  filterDesignation = []
  filterRoles = []
  filterTags = []
  sortOrder: any
  searchText = ''
  filterFacets = []

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private events: EventService,
    private loaderService: LoaderService,
    private sanitizer: DomSanitizer,
    // private configSvc: ConfigurationsService,
    private usersService: UsersService
  ) {
    this.Math = Math
    this.configSvc = this.route.parent && this.route.parent.snapshot.data.configService
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.currentUserStatus = this.configSvc.unMappedUser.profileDetails.profileStatus

    // this.usersData = _.get(this.route, 'snapshot.data.usersList.data') || {}
    // this.filterData()
  }

  ngOnDestroy() {
    // if (this.tabs) {
    //   this.tabs.unsubscribe()
    // }
  }

  ngOnInit() {
    this.currentFilter = this.route.snapshot.params['tab'] || 'verified'
    this.rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    this.searchQuery = ''
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.roles) {
      this.isMdoAdmin = this.configSvc.unMappedUser.roles.includes('MDO_ADMIN')
    }

    // this.getNMUsers('')
    this.usersService.mentorList$.subscribe(() => {
      setTimeout(() => {
        this.getAllVerifiedUsers('')
        this.getMentorUsers('')
      },         1000)

    })
    this.getAllVerifiedUsers('')
    this.getMentorUsers('')

    // this.getNVUsers('')

    this.reportsNoteList = [
      // tslint:disable-next-line: max-line-length
      `There are two tabs—<strong>All Verified Users</strong> (lists all verified users) and <strong>Assigned Mentors</strong> (lists users who have been assigned as mentors).`,
      // tslint:disable-next-line: max-line-length
      `Assign a mentor from the <strong>All Verified Users</strong> tab, and they will automatically appear in the <strong>Assigned Mentors</strong> tab.`,
      // tslint:disable-next-line: max-line-length
      `Mentors can be assigned or managed from either tab, with changes reflected across both.`,
    ]
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

  openVideoPopup() {
    this.dialog.open(ReportsVideoComponent, {
      data: {
        videoLink: 'https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1',
      },
      disableClose: true,
      width: '50%',
      height: '60%',
      panelClass: 'overflow-visable',
    })
  }

  filter(filter: string) {
    this.currentFilter = filter
    this.pageIndex = 0
    this.currentOffset = 0
    this.limit = 20
    this.searchQuery = ''
    this.filterData(this.searchQuery)
  }

  public tabTelemetry(label: string, index: number) {
    const data: TelemetryEvents.ITelemetryTabData = {
      label,
      index,
    }
    this.events.handleTabTelemetry(
      TelemetryEvents.EnumInteractSubTypes.USER_TAB,
      data,
    )
  }

  filterData(query: any) {
    if (this.currentFilter === 'verified') {
      this.getAllVerifiedUsers(query)
    } else if (this.currentFilter === 'mentor') {
      this.getMentorUsers(query)
    }
  }

  showEditUser(roles: any): boolean {
    if (this.isMdoAdmin) {
      if (roles && roles.length > 0) {
        return true
        //   return (roles.includes('PUBLIC') && roles.length === 1)
      }
      // return false
    }
    return true
  }

  // blockedUsers() {
  //   const blockedUsersData: any[] = []
  //   if (this.usersData && this.usersData.content && this.usersData.content.length > 0) {
  //     _.filter(this.usersData.content, { isDeleted: false }).forEach((user: any) => {
  //       blockedUsersData.push({
  //         fullname: user ? `${user.firstName}` : null,
  //         // fullname: user ? `${user.firstName} ${user.lastName}` : null,
  //         email: user.personalDetails && user.personalDetails.primaryEmail ?
  //           this.profileUtilSvc.emailTransform(user.personalDetails.primaryEmail) : this.profileUtilSvc.emailTransform(user.email),
  //         role: user.roles,
  //         userId: user.id,
  //         active: !user.isDeleted,
  //         blocked: user.blocked,
  //         roles: _.join(_.map(user.roleInfo, i => `<li>${i}</li>`), ''),
  //       })
  //     })
  //   }
  //   return blockedUsersData
  // }

  async getAllVerifiedUsers(query: any) {
    this.loaderService.changeLoad.next(true)
    let reqBody
    const filtreq = {
      rootOrgId: this.rootOrgId,
      status: 1,
      'profileDetails.profileStatus': 'VERIFIED',
    }
    if (this.getFilterGroup(query) && this.getFilterGroup(query) !== 'undefind') {
      Object.assign(filtreq, { 'profileDetails.professionalDetails.group': this.getFilterGroup(query) })
    }
    if (this.getFilterDesignation(query) && this.getFilterDesignation(query) !== 'undefind') {
      Object.assign(filtreq, { 'profileDetails.professionalDetails.designation': this.getFilterDesignation(query) })
    }
    if (this.getFilterRoles(query) && this.getFilterRoles(query) !== 'undefind') {
      Object.assign(filtreq, { 'profileDetails.professionalDetails.role': this.getFilterRoles(query) })
    }
    if (this.getFilterTags(query) && this.getFilterTags(query) !== 'undefind') {
      Object.assign(filtreq, { 'profileDetails.professionalDetails.tag': this.getFilterTags(query) })
    }
    reqBody = {
      request: {
        filters: filtreq,
        // facets: [
        //   'profileDetails.professionalDetails.group',
        //   'profileDetails.professionalDetails.designation',
        //   'profileDetails.additionalDetails.tag',
        // ],
        fields: [
          'rootOrgId',
          'profileDetails',
          'userId',
          'roles',
        ],
        limit: this.limit,
        offset: this.pageIndex,
        query: this.getSearchText(query),
        sort_by: this.getSortOrder(query),
      },
    }
    this.usersService.getAllUsersV3(reqBody).subscribe((data: any) => {
      const allusersData = data
      this.verifiedUsersData = allusersData.content
      this.verifiedUsersDataCount = allusersData.count
      this.filterFacets = allusersData.facets ? allusersData.facets : []

      // const i = this.activeUsersData.findIndex((wf: any) => wf.userId === this.currentUser)
      // if (i > -1) {
      //   this.activeUsersData.splice(i, 1)
      //   allusersData.count = allusersData.count - 1
      // }

      // if (this.notmyuserUsersDataCount && allusersData.count > this.notmyuserUsersDataCount) {
      //   this.activeUsersDataCount = allusersData.count - this.notmyuserUsersDataCount
      // }
    })
  }
  async getMentorUsers(query: any) {
    let reqBody
    this.loaderService.changeLoad.next(true)
    const filtreq = {
      rootOrgId: this.rootOrgId,
      'roles.role': 'MENTOR',
      'profileDetails.profileStatus': 'VERIFIED',
    }
    if (this.getFilterGroup(query) && this.getFilterGroup(query) !== 'undefind') {
      Object.assign(filtreq, { 'profileDetails.professionalDetails.group': this.getFilterGroup(query) })
    }
    if (this.getFilterDesignation(query) && this.getFilterDesignation(query) !== 'undefind') {
      Object.assign(filtreq, { 'profileDetails.professionalDetails.designation': this.getFilterDesignation(query) })
    }
    if (this.getFilterRoles(query) && this.getFilterRoles(query) !== 'undefind') {
      Object.assign(filtreq, { 'profileDetails.professionalDetails.role': this.getFilterRoles(query) })
    }
    if (this.getFilterTags(query) && this.getFilterTags(query) !== 'undefind') {
      Object.assign(filtreq, { 'profileDetails.professionalDetails.tag': this.getFilterTags(query) })
    }

    reqBody = {
      request: {
        filters: filtreq,
        // facets: [
        //   'profileDetails.professionalDetails.group',
        //   'profileDetails.professionalDetails.designation',
        //   'profileDetails.additionalDetails.tag',
        // ],
        fields: [
          'rootOrgId',
          'profileDetails',
          'userId',
          'roles',
        ],
        limit: this.limit,
        offset: this.pageIndex,
        query: this.getSearchText(query),
        sort_by: this.getSortOrder(query),
      },
    }
    this.usersService.getAllUsersV3(reqBody).subscribe((data: any) => {
      const allusersData = data
      this.mentorUsersData = allusersData.content
      this.mentorUsersDataCount = allusersData.count
      this.filterFacets = allusersData.facets ? allusersData.facets : []

      // if (this.currentUserStatus === 'VERIFIED') {
      //   const i = this.verifiedUsersData.findIndex((wf: any) => wf.userId === this.currentUser)
      //   if (i > -1) {
      //     this.verifiedUsersData.splice(i, 1)
      //     this.verifiedUsersDataCount = this.verifiedUsersDataCount ? this.verifiedUsersDataCount - 1 : this.verifiedUsersDataCount
      //   }
      // }
    })
  }

  getFilterGroup(query: any) {
    if (query && query.filters && (query.filters.group).length > 0) {
      return query.filters.group
    }
  }
  getFilterDesignation(query: any) {
    if (query && query.filters && (query.filters.designation).length > 0) {
      return query.filters.designation
    }
  }
  getFilterRoles(query: any) {
    if (query && query.filters && (query.filters.roles).length > 0) {
      return query.filters.roles
    }
  }
  getFilterTags(query: any) {
    if (query && query.filters && (query.filters.tags.length > 0)) {
      return query.filters.tags
    }
  }
  getSearchText(query: any) {
    return this.searchText = query && query.searchText ? query.searchText : ''
  }
  getSortOrder(query: any) {
    let sortBy
    if (query && query.sortOrder) {
      sortBy = query.sortOrder
      if (sortBy === 'alphabetical') {
        return { firstName: 'asc' }
      }
      if (sortBy === 'oldest') {
        return { createdDate: 'desc' }
      }
      if (sortBy === 'newest') {
        return { createdDate: 'asc' }
      }
    }
    return { firstName: 'asc' }
  }

  clickHandler(event: any) {
    switch (event.type) {
      case 'createUser':
        this.onCreateClick()
        break
      case 'upload':
        this.onUploadClick()
        break
    }
  }

  onCreateClick() {
    this.router.navigate([`/app/users/create-user`])
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.CREATE_BTN,
        id: 'create-user-btn',
      },
      {}
    )
  }

  onUploadClick() {
    this.filter('upload')
  }

  onRoleClick(user: any) {
    this.router.navigate([`/app/users/${user.userId}/details`])
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.CARD_CONTENT,
        id: TelemetryEvents.EnumIdtype.USER_ROW,
      },
      {
        id: user.userId,
        type: TelemetryEvents.EnumIdtype.USER,
      }
    )
  }

  onEnterkySearch(enterValue: any) {
    this.searchQuery = enterValue
    this.filterData(this.searchQuery)
  }

  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.limit = event.pageSize
    this.filterData(this.searchQuery)
  }
}
