import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { EventService } from '@sunbird-cb/utils'
// tslint:disable-next-line
import _ from 'lodash'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
import { UsersService } from '../../../users/services/users.service'
@Component({
  selector: 'ws-app-roles-access',
  templateUrl: './roles-access.component.html',
  styleUrls: ['./roles-access.component.scss'],
})
export class RolesAccessComponent implements OnInit, AfterViewInit, OnDestroy {
  tabledata!: ITableData
  data: any = []
  roleCountSpinner = true

  constructor(private router: Router,
              private activeRouter: ActivatedRoute,
              private usersService: UsersService,
    // private telemetrySvc: TelemetryService,
              private events: EventService) { }

  ngOnInit() {
    this.tabledata = {
      // actions: [{ name: 'Details', label: 'Details', icon: 'remove_red_eye', type: 'link' }],
      columns: [
        { displayName: 'Role', key: 'role' },
        { displayName: 'Number of users', key: 'count' },
      ],
      actions: [{ icon: 'refresh', label: 'Refresh', name: 'ViewCount', type: 'link', disabled: false }],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
      needUserMenus: false,
      actionColumnName: 'Refresh',
    }
    this.fetchRolesNew()
  }

  ngAfterViewInit() {
    // this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
  }

  /* Click event to navigate to a particular role */
  onRoleClick(role: any) {
    this.router.navigate([`/app/roles/${role.role}/users`])
    // this.telemetrySvc.impression()
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.CARD_CONTENT,
        id: TelemetryEvents.EnumIdtype.ROLES_ROW,
      },
      {
        id: role.role,
        type: TelemetryEvents.EnumIdtype.ROLES,
      }
    )

  }
  fetchIndidualRoleData(rootOrgId: string, rolename: string) {
    this.usersService.getAllRoleUsers(rootOrgId, rolename).subscribe(data => {
      this.roleCountSpinner = true
      const individualCount = data.count
      for (let i = 0; i < this.data.length; i += 1) {
        if (this.data[i].role === rolename) {
          this.data[i].count = individualCount
        }
      }
    })
  }
  actionsClick(evt: any) {
    if (evt.action === 'ViewCount') {
      this.roleCountSpinner = false
      const individualRole = evt.row.role
      const rootOrgId = _.get(this.activeRouter.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
      this.fetchIndidualRoleData(rootOrgId, individualRole)
    }
  }

  /* API call to get all roles*/
  fetchRolesNew() {
    let totalUsers: any[] = []
    const usrsList = _.get(this.activeRouter.snapshot, 'data.usersList.data.content') || []
    totalUsers = _.map(_.groupBy(_.flatten(_.map(_.flatten(_.map(usrsList, 'organisations')), 'roles'))), (_k, v) => {
      return {
        role: (v || ''),
        // .replace(/[/_/]/g, ' '),
        // count: (k || []).length || 0,
        count: 0,
      }
    })
    this.data = totalUsers
  }

  ngOnDestroy() { }
}
