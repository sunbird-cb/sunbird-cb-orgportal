import { AfterViewInit, Component, OnInit, OnDestroy, ChangeDetectorRef, AfterContentChecked } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { environment } from '../../../../../../../../../src/environments/environment'
import { UsersService } from '../../services/users.service'
import { UsersService as UsersService2 } from '../../../users/services/users.service'

/* tslint:disable */
import _ from 'lodash'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { ProfileV2UtillService } from '../../../home/services/home-utill.service'

/* tslint:enable */
@Component({
  selector: 'ws-app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})

export class UsersComponent implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy {
  tabledata!: ITableData
  configSvc: any
  data: any = []
  usersData: any
  data2: any
  role: any
  roleName: string | undefined
  currentRole: any
  private defaultSideNavBarOpenedSubscription: any
  rootOrgId: any

  constructor(private usersSvc: UsersService, private router: Router, private activatedRoute: ActivatedRoute, private route: ActivatedRoute,
              private profileUtilSvc: ProfileV2UtillService, private userS: UsersService2, private cdref: ChangeDetectorRef) { }

  ngOnInit() {
    const url = this.router.url.split('/')
    this.role = url[url.length - 2]
    this.roleName = this.role.replace('%20', ' ')
    this.configSvc = _.get(this.route, 'snapshot.parent.data.configService') || {}
    this.rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')

    // int left blank
    this.activatedRoute.params.subscribe(params => {
      this.currentRole = params['role']
    })
    this.tabledata = {
      // actions: [{ name: 'Details', label: 'Details', icon: 'remove_red_eye', type: 'link' }],
      actions: [],
      columns: [
        { displayName: 'Full name', key: 'fullName' },
        { displayName: 'Email id', key: 'email' },
        // { displayName: 'Position', key: 'position' },
        { displayName: 'Role acc', key: 'role', isList: true },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'fullName',
      sortState: 'asc',
      needUserMenus: false,
    }
    this.fetchAllUsersWithRole()
  }

  fetchAllUsersWithRole() {
    this.userS.getTotalRoleUsers(this.rootOrgId, this.currentRole).subscribe((data: any) => {
      this.usersData = data.count
      this.getMyDepartment()
    })
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.cdref.detectChanges() /*cdRef injected in constructor*/
    // }, 0)
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges()
  }

  /* API call to get all roles*/
  fetchUsersWithRole() {
    this.usersSvc.getUsers(this.role).subscribe(res => {
      this.data2 = res
      this.data = res.users.map((user: any) => {
        return {
          fullName: `${user.first_name}`,
          // fullName: `${user.first_name} ${user.last_name}`,
          email: this.profileUtilSvc.emailTransform(user.email),
          position: user.department_name,
          role: this.role,
          wid: user.wid,
        }
      })
    })
  }
  getRoleList(user: any) {
    if (user.organisations && user.organisations.length > 0) {
      // tslint:disable-next-line
      return _.join(_.map(_.get(_.first(_.filter(user.organisations, { organisationId: _.get(this.configSvc, 'unMappedUser.rootOrg.id') })), 'roles'), role => `<li>${role}</li>`), '')
    }
    return []
  }
  getMyDepartment() {
    // debugger
    let users: any[] = []
    if (this.usersData && this.usersData.content && this.usersData.content.length > 0) {
      users = _.map(_.compact(_.map(this.usersData.content, i => {
        let consider = false
        if (!i.isDeleted && i.organisations && i.organisations.length > 0) {
          _.each(i.organisations, o => {
            if (!o.isDeleted && (o.roles || []).indexOf(this.roleName) >= 0) {
              consider = true
            }
          })
        }
        return consider ? i : null
      })),
        // tslint:disable-next-line
        user => {
          // debugger
          return {
            fullName: `${user.firstName}`,
            // fullName: `${user.first_name} ${user.last_name}`,
            email: this.profileUtilSvc.emailTransform(_.get(user, 'profileDetails.personalDetails.primaryEmail'))
              || this.profileUtilSvc.emailTransform(user.email),
            position: user.department_name,
            role: this.getRoleList(user),
            wid: user.userId,
          }
        })
    }
    this.data = users

    // this.profile.getMyDepartmentAll().subscribe(res => {
    //   res.active_users.map((user: any) => {
    //     if (user.roleInfo.length > 0) {
    //       user.roleInfo.forEach((eachrole: any) => {
    //         eachrole.roleName = eachrole.roleName.replace('_', ' ')
    //         if (eachrole.roleName === this.roleName) {
    //           users.push({
    //             fullName: `${user.firstName} ${user.lastName}`,
    //             email: user.emailId,
    //             position: user.department_name,
    //             role: this.roleName,
    //             wid: user.wid,
    //           })
    //         }
    //       })
    //     }
    //     this.data = users
    //   })
    // })

  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }
  menuActions($event: { action: string, row: any }) {
    const user = { userId: _.get($event.row, 'wid') }
    _.set(user, 'deptId', _.get(this.data2, 'id'))
    switch ($event.action) {
      case 'showOnKarma':
        window.open(`${environment.karmYogiPath}/app/person-profile/${user.userId}`)
        break
      case 'block':
        _.set(user, 'isBlocked', true)
        _.set(user, 'roles', _.map(_.get($event.row, 'roleInfo'), i => i.roleName))
        this.usersSvc.blockUser(user)
        break
      case 'unblock':
        _.set(user, 'isBlocked', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'roleInfo'), i => i.roleName))
        this.usersSvc.blockUser(user)
        break
      case 'deactive':
        _.set(user, 'isActive', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'roleInfo'), i => i.roleName))

        this.usersSvc.deActiveUser(user)
        break
      case 'active':
        _.set(user, 'isActive', true)
        _.set(user, 'roles', _.map(_.get($event.row, 'roleInfo'), i => i.roleName))
        this.usersSvc.activeUser(user)
        break
      //   case 'delete':
      //     _.set(user, 'isBlocked', false)
      //     this.usersSvc.deleteUser(user)
      //     break
    }
  }

  onEnterkySearch(enterValue: any) {
    const rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    // debugger
    this.usersSvc.searchUserByenter(enterValue, rootOrgId).subscribe(data => {
      this.usersData = data.result.response

      let users: any[] = []
      if (this.usersData && this.usersData.content && this.usersData.content.length > 0) {
        users = _.map(_.compact(_.map(this.usersData.content, i => {
          let consider = false
          if (!i.isDeleted && i.organisations && i.organisations.length > 0) {
            _.each(i.organisations, o => {
              if (!o.isDeleted && (o.roles || []).indexOf(this.roleName) >= 0) {
                consider = true
              }
            })
          }
          return consider ? i : null
        })),
          // tslint:disable-next-line
          user => {
            return {
              fullName: `${user.firstName}`,
              // fullName: `${user.firstName} ${user.lastName}`,
              email: this.profileUtilSvc.emailTransform(_.get(user, 'profileDetails.personalDetails.primaryEmail'))
                || this.profileUtilSvc.emailTransform(user.email),
              position: user.department_name,
              role: this.getRoleList(user),
              wid: user.userId,
            }
          })
      }
      this.data = users
    }
    )
  }
}
