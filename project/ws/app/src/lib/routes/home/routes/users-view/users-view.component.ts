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
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'ws-app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss'],
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
  userDetails: any
  location!: string | null
  tabs: any
  // tabsData: NSProfileDataV2.IProfileTab[]
  currentUser!: any
  connectionRequests!: any[]
  data: any = []
  usersData!: any
  configSvc: any
  activeUsersData!: any[]
  inactiveUsersData!: any[]

  tabledata: ITableData = {
    actions: [],
    columns: [
      { displayName: 'Full Name', key: 'fullname' },
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
    // private discussService: DiscussService,
    // private configSvc: ConfigurationsService,
    // private networkV2Service: NetworkV2Service,
    // private profileV2Svc: ProfileV2Service
    private usersService: UsersService
  ) {
    this.Math = Math
    this.configSvc = this.route.parent && this.route.parent.snapshot.data.configService
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.usersData = _.get(this.route, 'snapshot.data.usersList.data') || {}
    this.filterData()
  }

  // decideAPICall() {
  // }
  ngOnDestroy() {
    if (this.tabs) {
      this.tabs.unsubscribe()
    }
  }
  ngOnInit() {

  }

  filter(filter: string) {
    this.currentFilter = filter
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
  filterData() {
    this.activeUsersData = this.activeUsers
    this.inactiveUsersData = this.inActiveUsers
  }
  get activeUsers() {
    const activeUsersData: any[] = []
    if (this.usersData && this.usersData.content && this.usersData.content.length > 0) {
      _.filter(this.usersData.content, { isDeleted: false }).forEach((user: any) => {
        // tslint:disable-next-line
        const org = { roles: _.get(_.first(_.filter(user.organisations, { organisationId: _.get(this.configSvc, 'unMappedUser.rootOrg.id') })), 'roles') }
        activeUsersData.push({
          fullname: user ? `${user.firstName} ${user.lastName}` : null,
          email: user.personalDetails && user.personalDetails.primaryEmail ? user.personalDetails.primaryEmail : user.email,
          role: org.roles || [],
          userId: user.id,
          active: !user.isDeleted,
          blocked: user.blocked,
          roles: _.join(_.map((org.roles || []), i => `<li>${i}</li>`), ''),
        })
      })
    }
    return activeUsersData
  }
  get inActiveUsers() {
    const inactiveUsersData: any[] = []
    if (this.usersData && this.usersData.content && this.usersData.content.length > 0) {
      _.filter(this.usersData.content, { isDeleted: true }).forEach((user: any) => {
        // tslint:disable-next-line
        const org = { roles: _.get(_.first(_.filter(user.organisations, { organisationId: _.get(this.configSvc, 'unMappedUser.rootOrg.id') })), 'roles') || [] }
        inactiveUsersData.push({
          fullname: user ? `${user.firstName} ${user.lastName}` : null,
          email: user.personalDetails && user.personalDetails.primaryEmail ? user.personalDetails.primaryEmail : user.email,
          role: org.roles || [],
          userId: user.id,
          active: !user.isDeleted,
          blocked: user.blocked,
          roles: _.join(_.map((org.roles || []), i => `<li>${i}</li>`), ''),
        })
      })
    }
    return inactiveUsersData
  }

  blockedUsers() {
    const blockedUsersData: any[] = []
    if (this.usersData && this.usersData.content && this.usersData.content.length > 0) {
      _.filter(this.usersData.content, { isDeleted: false }).forEach((user: any) => {
        blockedUsersData.push({
          fullname: user ? `${user.firstName} ${user.lastName}` : null,
          email: user.personalDetails && user.personalDetails.primaryEmail ? user.personalDetails.primaryEmail : user.email,
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

  getAllUsers() {
    const filterObj = {
      request: {
        query: '',
        filters: {
          rootOrgId: this.configSvc,
        },
      },
    }
    this.usersService.getAllUsers(filterObj).subscribe(data => {
      this.usersData = data
      this.filterData()
    })
  }

  onCreateClick() {
    this.router.navigate([`/app/users/create-user`])
  }

  onRoleClick(user: any) {
    this.router.navigate([`/app/users/${user.userId}/details`])
  }
  menuActions($event: { action: string, row: any }) {
    const user = { userId: _.get($event.row, 'userId') }
    // _.set(user, 'deptId', _.get(_.first(_.filter(this.usersData.content, { id: user.userId })), 'rootOrgId'))
    // _.set(user, 'isBlocked', _.get($event.row, 'blocked'))
    // _.set(user, 'isDeleted', _.get($event.row, 'active'))
    _.set(user, 'requestedBy', this.currentUser)

    switch ($event.action) {
      case 'showOnKarma':
        window.open(`${environment.karmYogiPath}/app/person-profile/${user.userId}`)
        break
      case 'block':
        _.set(user, 'isBlocked', true)
        _.set(user, 'isDeleted', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i))
        this.usersService.blockUser(user).subscribe(response => {
          if (response) {
            this.getAllUsers()
            this.snackBar.open('Updated successfully !')
          }
        })
        break
      case 'unblock':
        _.set(user, 'isBlocked', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i))
        this.usersService.blockUser(user).subscribe(response => {
          if (response) {
            this.getAllUsers()
            this.snackBar.open('Updated successfully !')
          }
        })
        break
      case 'deactive':
        // _.set(user, 'isDeleted', true)
        // _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i))
        this.usersService.deActiveUser(user).subscribe(response => {
          if (response) {
            this.getAllUsers()
            this.snackBar.open('Updated successfully !')
          }
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
        this.usersService.deActiveUser(user).subscribe(response => {
          if (response) {
            this.getAllUsers()
            this.snackBar.open('Updated successfully !')
          }
        })
        break
      //   case 'delete':
      //     _.set(user, 'isBlocked', false)
      //     this.usersSvc.deleteUser(user)
      //     break
    }
  }
}
