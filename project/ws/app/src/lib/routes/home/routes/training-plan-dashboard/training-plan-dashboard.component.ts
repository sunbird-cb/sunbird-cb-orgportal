import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
// import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
// import { EventService } from '@sunbird-cb/utils'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'

@Component({
  selector: 'ws-app-training-plan-dashboard',
  templateUrl: './training-plan-dashboard.component.html',
  styleUrls: ['./training-plan-dashboard.component.scss'],
})
export class TrainingPlanDashboardComponent implements OnInit {

  currentFilter = 'live'
  pageIndex = 0
  currentOffset = 0
  limit = 20
  searchQuery = ''
  tabledata!: ITableData
  trainingPlanData: any = []
  tagListData: any = ['Designation', 'All users', 'Custom users']

  constructor(
    // private events: EventService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.tabledata = {
      columns: [
        // { displayName: 'Id', key: 'identifier' },
        { displayName: 'Plan name', key: 'planName' },
        { displayName: 'Assignee', key: 'assignee' },
        { displayName: 'Total content', key: 'totalContent' },
        { displayName: 'Content type', key: 'contentType' },
        { displayName: 'Timeline', key: 'timeline' },
        { displayName: 'Created by', key: 'CreatedBy' },
        { displayName: 'Created on', key: 'CreatedOn' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'dateCreatedOn',
      sortState: 'desc',
      needUserMenus: false,
      actions: [],
      actionColumnName: 'Action',
    }
    this.filter('live')
  }

  tabSelected(item: string) {
    this.currentFilter = item
  }

  onEnterkySearch(enterValue: any) {
    this.searchQuery = enterValue
    this.currentOffset = 0
    this.pageIndex = 0
    this.filterData(this.searchQuery)
  }

  filter(filter: string) {
    this.currentFilter = filter
    this.pageIndex = 0
    this.currentOffset = 0
    this.limit = 20
    this.searchQuery = ''
    this.filterData(this.searchQuery)
  }

  filterData(query: string) {
    if (this.currentFilter === 'live') {
      this.getLiveData(query)
    } else if (this.currentFilter === 'draft') {
      this.getDraftData(query)
    }
  }

  public tabTelemetry(_label: string, _index: number) {
    // const data: TelemetryEvents.ITelemetryTabData = {
    //   label,
    //   index,
    // }
    // this.events.handleTabTelemetry(
    //   TelemetryEvents.EnumInteractSubTypes.USER_TAB,
    //   data,
    // )
  }

  getLiveData(_searchText: string) {
    this.trainingPlanData = []
    this.trainingPlanData.push({
      planName: 'planName live',
      assignee: 'assignee live',
      totalContent: 'totalContent live',
      timeline: 'timeline live',
      contentType: 'contentType live',
      CreatedBy: 'CreatedBy live',
      CreatedOn: 'CreatedOn live',
    }, {
      planName: 'check live',
      assignee: 'assignee live',
      totalContent: 'totalContent live',
      timeline: 'timeline live',
      contentType: 'contentType live',
      CreatedBy: 'CreatedBy live',
      CreatedOn: 'CreatedOn live',
    })
  }

  getDraftData(_searchText: string) {
    this.trainingPlanData = []
    this.trainingPlanData.push({
      planName: 'planName draft',
      assignee: 'assignee draft',
      totalContent: 'totalContent draft',
      timeline: 'timeline draft',
      contentType: 'contentType draft',
      CreatedBy: 'CreatedBy draft',
      CreatedOn: 'CreatedOn draft',
    })
  }

  createCbp() {
    this.router.navigate(['app', 'training-plan', 'create-plan'])
  }

  clickHandler($event: any) {
    if ($event.type === 'createCbpPlan') {
      this.createCbp()
    }
  }

}
