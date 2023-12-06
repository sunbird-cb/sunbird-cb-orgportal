import { Component, OnInit } from '@angular/core'
// import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
// import { EventService } from '@sunbird-cb/utils'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'

@Component({
  selector: 'ws-app-training-plan',
  templateUrl: './training-plan.component.html',
  styleUrls: ['./training-plan.component.scss'],
})
export class TrainingPlanComponent implements OnInit {

  currentFilter = 'live'
  pageIndex: number = 0
  currentOffset: number = 0
  limit: number = 20
  searchQuery: string = ''
  tabledata!: ITableData
  trainingPlanData: any = []
  tagListData: any = ['Designation', 'All users', 'Custom users']

  constructor(
    // private events: EventService,
  ) {

  }

  ngOnInit() {
    this.tabledata = {
      columns: [
        // { displayName: 'Id', key: 'identifier' },
        { displayName: 'Plan name', key: 'planName' },
        { displayName: 'Assignee', key: 'assignee' },
        { displayName: 'Total content', key: 'totalContent' },
        { displayName: 'Timeline', key: 'timeline' },
        { displayName: 'Content type', key: 'contentType' },
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


}
