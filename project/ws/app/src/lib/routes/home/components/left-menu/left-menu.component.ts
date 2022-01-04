import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { EventService } from '@sunbird-cb/utils'
import * as _ from 'lodash'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'

@Component({
  selector: 'ws-app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit, OnDestroy {

  @Input()
  tabsData!: any
  constructor(
    private events: EventService,
  ) { }

  ngOnInit(): void {

  }
  ngOnDestroy() {

  }

  public menuClick(tab: any) {
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.SIDE_NAV,
        id: `${_.camelCase(tab.name)}-menu`,
      },
      {},
    )
  }

}
