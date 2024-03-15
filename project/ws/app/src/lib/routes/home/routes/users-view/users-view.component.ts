import { Component, OnDestroy, OnInit } from '@angular/core'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { UsersService } from '../../../users/services/users.service'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
import { environment } from 'src/environments/environment'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { MatSnackBar, PageEvent } from '@angular/material'
import { EventService } from '@sunbird-cb/utils'
import { NsContent } from '@sunbird-cb/collection'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
import { LoaderService } from '../../../../../../../../../src/app/services/loader.service'
import { ProfileV2UtillService } from '../../services/home-utill.service'

// import * as XLSX from 'xlsx'

@Component({
  selector: 'ws-app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss'],
  providers: [LoaderService],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class UsersViewComponent implements OnInit, OnDestroy {
  /* tslint:disable */
  Math: any
  /* tslint:enable */
  currentFilter = 'active'
  discussionList!: any
  discussProfileData!: any
  portalProfile!: NSProfileDataV2.IProfile
  tabs: any
  currentUser!: any
  connectionRequests!: any[]
  data: any = []
  usersData!: any
  configSvc: any
  activeUsersData!: any[]
  inactiveUsersData!: any[]
  content: NsContent.IContent = {} as NsContent.IContent
  isMdoAdmin = false
  currentOffset = 0
  userDataTotalCount?: number | 0
  limit = 20
  pageIndex = 0
  searchQuery = ''
  rootOrgId: any

  tabledata: ITableData = {
    actions: [],
    columns: [
      { displayName: 'Full name', key: 'fullname' },
      { displayName: 'Email', key: 'email' },
      { displayName: 'Roles', key: 'roles', isList: true },
    ],
    needCheckBox: false,
    needHash: false,
    sortColumn: 'fullName',
    sortState: 'asc',
    needUserMenus: true,
  }

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private events: EventService,
    private loaderService: LoaderService,
    private profileUtilSvc: ProfileV2UtillService,
    // private telemetrySvc: TelemetryService,
    // private configSvc: ConfigurationsService,
    // private discussService: DiscussService,
    // private configSvc: ConfigurationsService,
    // private networkV2Service: NetworkV2Service,
    // private profileV2Svc: ProfileV2Service
    private usersService: UsersService
  ) {
    this.Math = Math
    this.configSvc = this.route.parent && this.route.parent.snapshot.data.configService
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
  }

  ngOnDestroy() {
    // if (this.tabs) {
    //   this.tabs.unsubscribe()
    // }
  }
  ngOnInit() {
    this.rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    this.currentFilter = this.route.snapshot.params['tab'] || 'active'
    this.searchQuery = ''
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.roles) {
      this.isMdoAdmin = this.configSvc.unMappedUser.roles.includes('MDO_ADMIN')
    }
    this.filterData('')
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

  get dataForTable() {
    switch (this.currentFilter) {
      case 'active':
        return this.activeUsersData
      case 'inactive':
        return this.inactiveUsersData
      // case 'blocked':
      //   return this.blockedUsers()
      default:
        return []
    }

  }
  filterData(query: string) {
    if (this.currentFilter === 'active') {
      this.activeUsers(query)
    } else if (this.currentFilter === 'inactive') {
      this.inActiveUsers(query)
    }
  }

  activeUsers(query: string) {
    this.loaderService.changeLoad.next(true)
    const activeUsersData: any[] = []
    const status = this.currentFilter === 'active' ? 1 : 0
    this.currentOffset = this.limit * ((this.pageIndex + 1) - 1)
    this.usersService.getAllKongUsers(this.rootOrgId, status, this.limit, this.currentOffset, query).subscribe(data => {
      this.userDataTotalCount = data.result.response.count
      this.usersData = data.result.response
      if (this.usersData && this.usersData.content && this.usersData.content.length > 0) {
        _.filter(this.usersData.content, { isDeleted: false }).forEach((user: any) => {
          // tslint:disable-next-line
          const org = { roles: _.get(_.first(_.filter(user.organisations, { organisationId: _.get(this.configSvc, 'unMappedUser.rootOrg.id') })), 'roles') }
          activeUsersData.push({
            fullname: user ? `${user.firstName}` : null,
            // fullname: user ? `${user.firstName} ${user.lastName}` : null,
            email: user.personalDetails && user.personalDetails.primaryEmail ?
              this.profileUtilSvc.emailTransform(user.personalDetails.primaryEmail) : this.profileUtilSvc.emailTransform(user.email),
            role: org.roles || [],
            userId: user.id,
            active: !user.isDeleted,
            blocked: user.blocked,
            roles: _.join(_.map((org.roles || []), i => `<li>${i}</li>`), ''),
            orgId: user.rootOrgId,
            orgName: user.rootOrgName,
            allowEditUser: this.showEditUser(org.roles),
          })
        })

      }
      this.activeUsersData = activeUsersData
      return this.activeUsersData
    })
  }
  inActiveUsers(query: string) {
    this.loaderService.changeLoad.next(true)
    const inactiveUsersData: any[] = []
    const status = this.currentFilter === 'active' ? 1 : 0
    this.currentOffset = this.limit * ((this.pageIndex + 1) - 1)
    this.usersService.getAllKongUsers(this.rootOrgId, status, this.limit, this.currentOffset, query).subscribe(
      data => {
        this.userDataTotalCount = data.result.response.count
        this.usersData = data.result.response
        if (this.usersData && this.usersData.content && this.usersData.content.length > 0) {
          _.filter(this.usersData.content, { isDeleted: true }).forEach((user: any) => {
            // tslint:disable-next-line
            const org = { roles: _.get(_.first(_.filter(user.organisations, { organisationId: _.get(this.configSvc, 'unMappedUser.rootOrg.id') })), 'roles') }
            inactiveUsersData.push({
              fullname: user ? `${user.firstName}` : null,
              // fullname: user ? `${user.firstName} ${user.lastName}` : null,
              email: user.personalDetails && user.personalDetails.primaryEmail ?
                this.profileUtilSvc.emailTransform(user.personalDetails.primaryEmail) : this.profileUtilSvc.emailTransform(user.email),
              role: org.roles || [],
              userId: user.id,
              active: !user.isDeleted,
              blocked: user.blocked,
              roles: _.join(_.map((org.roles || []), i => `<li>${i}</li>`), ''),
              orgId: user.rootOrgId,
              orgName: user.rootOrgName,
              allowEditUser: this.showEditUser(org.roles),
            })
          })
        }
        this.inactiveUsersData = inactiveUsersData
        return this.inactiveUsersData
      })

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

  blockedUsers() {
    const blockedUsersData: any[] = []
    if (this.usersData && this.usersData.content && this.usersData.content.length > 0) {
      _.filter(this.usersData.content, { isDeleted: false }).forEach((user: any) => {
        blockedUsersData.push({
          fullname: user ? `${user.firstName}` : null,
          // fullname: user ? `${user.firstName} ${user.lastName}` : null,
          email: user.personalDetails && user.personalDetails.primaryEmail ?
            this.profileUtilSvc.emailTransform(user.personalDetails.primaryEmail) : this.profileUtilSvc.emailTransform(user.email),
          role: user.roles,
          userId: user.id,
          active: !user.isDeleted,
          blocked: user.blocked,
          roles: _.join(_.map(user.roleInfo, i => `<li>${i}</li>`), ''),
        })
      })
    }
    return blockedUsersData
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
  menuActions($event: { action: string, row: any }) {
    this.loaderService.changeLoad.next(true)
    const loggedInUserId = _.get(this.route, 'snapshot.parent.data.configService.userProfile.userId')
    // const user = { userId: _.get($event.row, 'userId') }
    // _.set(user, 'deptId', _.get(_.first(_.filter(this.usersData.content, { id: user.userId })), 'rootOrgId'))
    // _.set(user, 'isBlocked', _.get($event.row, 'blocked'))
    // _.set(user, 'isDeleted', _.get($event.row, 'active'))
    // _.set(user, 'requestedBy', this.currentUser)
    const user = {
      request: {
        userId: _.get($event.row, 'userId'),
        requestedBy: this.currentUser,
      },
    }

    switch ($event.action) {
      case 'showOnKarma':
        window.open(`${environment.karmYogiPath}/app/person-profile/${user.request.userId}`)
        break
      case 'editInfo':
        this.onRoleClick($event.row)
        break
      case 'block':
        _.set(user, 'isBlocked', true)
        _.set(user, 'isDeleted', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i))
        this.usersService.blockUser(user).subscribe(response => {
          if (response) {
            // this.getAllUsers()
            this.filterData('')
            this.snackBar.open(response.result.response)
          }
        })
        break
      case 'unblock':
        _.set(user, 'isBlocked', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i))
        this.usersService.blockUser(user).subscribe(response => {
          if (response) {
            // this.getAllUsers()
            this.filterData('')
            this.snackBar.open('Updated successfully !')
          }
        })
        break
      case 'deactive':
        // _.set(user, 'isDeleted', true)
        // _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i))
        // this.usersService.deActiveUser(user).subscribe(response => {
        this.usersService.newBlockUser(loggedInUserId, user.request.userId).subscribe(response => {
          if (_.toUpper(response.params.status) === 'SUCCESS') {
            setTimeout(() => {
              // this.getAllUsers()
              // this.activeUsers('')
              this.filterData('')

              this.snackBar.open('Deactivated successfully!')
            },
              // tslint:disable-next-line: align
              1500)
            // this.changeDetectorRefs.detectChanges()
          } else {
            this.loaderService.changeLoad.next(false)
            this.snackBar.open('Update unsuccess!')
          }
        },
          // tslint:disable-next-line:align
          () => {
            this.snackBar.open('Given User Data doesnt exist in our records. Please provide a valid one.')
          })
        break
      case 'active':
        const state = _.get(user, 'isBlocked')
        if (state === true) {
          _.set(user, 'isDeleted', false)
          _.set(user, 'isBlocked', false)
        } else {
          _.set(user, 'isDeleted', false)
        }
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i))
        // this.usersService.deActiveUser(user).subscribe(response => {
        this.usersService.newUnBlockUser(loggedInUserId, user.request.userId).subscribe(response => {
          if (_.toUpper(response.params.status) === 'SUCCESS') {
            setTimeout(() => {
              // this.getAllUsers()
              this.filterData('')
              this.snackBar.open('Activated successfully!')
              // tslint:disable-next-line: align
            }, 1500)
          } else {
            this.loaderService.changeLoad.next(false)
            this.snackBar.open('Update unsuccess!')
          }
        })
        break
      //   case 'delete':
      //     _.set(user, 'isBlocked', false)
      //     this.usersSvc.deleteUser(user)
      //     break
    }
  }

  onEnterkySearch(enterValue: any) {
    this.searchQuery = enterValue
    this.currentOffset = 0
    this.pageIndex = 0
    this.filterData(this.searchQuery)
  }

  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.limit = event.pageSize
    this.filterData(this.searchQuery)
  }
}
