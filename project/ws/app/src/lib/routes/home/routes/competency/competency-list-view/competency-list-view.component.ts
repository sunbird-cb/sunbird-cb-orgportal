import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { EventService } from '@sunbird-cb/utils'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
import { LoaderService } from '../../../../../../../../../../src/app/services/loader.service'
import { TelemetryEvents } from '../../../../../head/_services/telemetry.event.model'
import { ITableData } from '../../../interface/interfaces'

@Component({
  selector: 'ws-competency-list-view',
  templateUrl: './competency-list-view.component.html',
  styleUrls: ['./competency-list-view.component.scss'],
  providers: [LoaderService],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class CompetencyListViewComponent implements OnInit, OnDestroy {
  currentFilter = 'ownedByYou'
  tabledata: ITableData = {
    actions: [],
    columns: [
      { displayName: 'Competency', key: 'competency' },
      { displayName: 'Type', key: 'type' },
      { displayName: 'Micro Questions', key: 'microQuestions' },
    ],
    needCheckBox: false,
    needHash: false,
    sortColumn: 'competency',
    sortState: 'asc',
    needUserMenus: false,
  }
  dataForTable = [{
    competency: 'Desired 1',
    type: 'Behavioural',
    microQuestions: '15'
  },
  {
    competency: 'Desired 2',
    type: 'Behavioural',
    microQuestions: '20'
  }]

  constructor(
    private events: EventService,
    private router: Router,
  ) {
  }

  ngOnDestroy() {
  }
  ngOnInit() {
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

  filter(type: string) {
    switch (type) {
      case 'ownedByYou':
        this.currentFilter = type
        break
      case 'desiredCompetencies':
        this.currentFilter = type
        break
      case 'newCompetencyRequest':
        this.currentFilter = type
        break
    }
  }

  onRoleClick(item: any) {
    this.router.navigate(['app', 'home', 'competencyHome'], item)
  }
}
