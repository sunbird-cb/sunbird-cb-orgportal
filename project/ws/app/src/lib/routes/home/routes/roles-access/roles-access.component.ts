import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { EventService, TelemetryService } from '@sunbird-cb/utils'
// tslint:disable-next-line
import _ from 'lodash'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
@Component({
  selector: 'ws-app-roles-access',
  templateUrl: './roles-access.component.html',
  styleUrls: ['./roles-access.component.scss'],
})
export class RolesAccessComponent implements OnInit, AfterViewInit, OnDestroy {
  tabledata: any = []
  data: any = []

  constructor(private router: Router,
              private activeRouter: ActivatedRoute,
              private telemetrySvc: TelemetryService,
              private events: EventService) { }

  ngOnInit() {
    this.tabledata = {
      // actions: [{ name: 'Details', label: 'Details', icon: 'remove_red_eye', type: 'link' }],
      columns: [
        { displayName: 'Role', key: 'role' },
        { displayName: 'Number of users', key: 'count' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
    }
    this.fetchRolesNew()
  }

  ngAfterViewInit() {
    // this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
  }

  /* Click event to navigate to a particular role */
  onRoleClick(role: any) {
    this.router.navigate([`/app/roles/${role.role}/users`])
    this.telemetrySvc.impression()
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.CARD_CONTENT,
        id: role.role,
      },
      {}
    )

  }

  /* API call to get all roles*/
  fetchRolesNew() {
    let totalUsers: any[] = []
    const usrsList = _.get(this.activeRouter.snapshot, 'data.usersList.data.content') || []
    totalUsers = _.map(_.groupBy(_.flatten(_.map(_.flatten(_.map(usrsList, 'organisations')), 'roles'))), (k, v) => {
      return {
        role: (v || ''),
        // .replace(/[/_/]/g, ' '),
        count: (k || []).length || 0,
      }
    })
    this.data = totalUsers
  }

  ngOnDestroy() { }
}
