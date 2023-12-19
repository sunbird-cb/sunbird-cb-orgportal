import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
// import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
// import { EventService } from '@sunbird-cb/utils'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { TrainingPlanDashboardService } from '../../services/training-plan-dashboard.service'
import moment from 'moment'
import { LoaderService } from '../../../../../../../../../src/app/services/loader.service'
import { TrainingPlanService } from '../../../training-plan/services/traininig-plan.service'
import { MatSnackBar } from '@angular/material'

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
    private router: Router,
    private trainingDashboardSvc: TrainingPlanDashboardService,
    private loaderService: LoaderService,
    private trainingPlanService: TrainingPlanService,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit() {
    this.tabledata = {
      columns: [
        // { displayName: 'Id', key: 'identifier' },
        { displayName: 'Plan name', key: 'name' },
        { displayName: 'Assignee', key: 'assigneeCount' },
        { displayName: 'Total content', key: 'contentCount' },
        { displayName: 'Content type', key: 'contentType' },
        { displayName: 'Timeline', key: 'endDate' },
        { displayName: 'Created by', key: 'createdByName' },
        { displayName: 'Created on', key: 'createdAt' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'dateCreatedOn',
      sortState: 'desc',
      needUserMenus: false,
      actions: [],
      actionColumnName: 'Action',
      cbpPlanMenu: true,
    }
    this.filter('live')
  }

  tabSelected(item: string) {
    this.currentFilter = item
  }

  // onEnterkySearch(enterValue: any) {
  //   this.searchQuery = enterValue
  //   this.currentOffset = 0
  //   this.pageIndex = 0
  //   this.filterData(this.searchQuery)
  // }

  filter(filter: string) {
    this.currentFilter = filter
    this.filterData()
  }

  filterData() {
    if (this.currentFilter === 'live') {
      this.getLiveData()
    } else if (this.currentFilter === 'draft') {
      this.getDraftData()
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

  async getLiveData() {
    this.loaderService.changeLoaderState(true)
    this.trainingPlanData = []
    this.trainingPlanData = []
    const req = {
      request: {
        filters: {
          status: 'Live',
        },
      },
    }
    const liveRes = await this.trainingDashboardSvc.getUserList(req).toPromise().catch(_error => { })
    if (liveRes.params && liveRes.params.status && liveRes.params.status === 'success') {
      this.trainingPlanData = liveRes.result.content
      this.convertDataAsPerTable()
    } else {
      this.loaderService.changeLoaderState(false)
    }
  }

  async getDraftData() {
    this.loaderService.changeLoaderState(true)
    this.trainingPlanData = []
    const req = {
      request: {
        filters: {
          status: 'DRAFT',
        },
      },
    }
    const draftRes = await this.trainingDashboardSvc.getUserList(req).toPromise().catch(_error => { })
    if (draftRes.params && draftRes.params.status && draftRes.params.status === 'success') {
      this.trainingPlanData = draftRes.result.content
      this.convertDataAsPerTable()
    } else {
      this.loaderService.changeLoaderState(false)
    }
  }

  convertDataAsPerTable() {
    this.trainingPlanData.map((res: any) => {
      res.contentCount = (res.contentList) ? res.contentList.length : 0
      res.assigneeCount = (res.userDetails) ? res.userDetails.length : 0
      res.endDate = (res.endDate) ? moment(res.endDate).format('MMM DD[,] YYYY') : ''
      res.createdAt = (res.createdAt) ? moment(res.createdAt).format('MMM DD[,] YYYY') : ''
    })
    this.loaderService.changeLoaderState(false)
  }

  createCbp() {
    this.router.navigate(['app', 'training-plan', 'create-plan'])
  }

  menuSelected(_event: any) {
    switch (_event.action) {
      case 'preivewContent':
        this.previewData(_event.row)
        break
      case 'editContent':
        this.editContentData(_event.row)
        break
      case 'deleteContent':
        this.deleteContentData(_event.row)
        break
      case 'publishContent':
        this.publishContentData(_event.row)
        break
    }
  }

  previewData(_selectedRow: any) {
    this.loaderService.changeLoaderState(true)
  }

  editContentData(_selectedRow: any) {
    this.router.navigate(['app', 'training-plan', 'create-plan'], { queryParams: { planId: _selectedRow.id } })
  }

  deleteContentData(_selectedRow: any) {
    this.loaderService.changeLoaderState(true)
    const obj = {
      request: {
        id: _selectedRow.id,
        comment: 'Content deleted',
      },
    }
    this.trainingPlanService.archivePlan(obj).subscribe((_data: any) => {
      this.snackBar.open('CBP plan deleted successfully.')
      this.loaderService.changeLoaderState(false)
      this.getDraftData()
    }, (_error) => {
      this.loaderService.changeLoaderState(false)
    })
  }

  publishContentData(_selectedRow: any) {
    this.loaderService.changeLoaderState(false)
    const obj = {
      request: {
        id: _selectedRow.id,
        comment: 'CBP plan approved',
      },
    }
    this.trainingPlanService.publishPlan(obj).subscribe((data: any) => {
      if (data && data.params && data.params.status && data.params.status.toLowerCase() === 'success') {
        this.snackBar.open('CBP plan published successfully.')
        this.loaderService.changeLoaderState(false)
        this.getDraftData()
      } else {
        this.snackBar.open('Something went wrong while publishing CBP plan. Try again later')
        this.loaderService.changeLoaderState(false)
      }
    }, (_error: any) => {
      this.snackBar.open('Something went wrong while publishing CBP plan. Try again later')
      this.loaderService.changeLoaderState(false)
    })
  }

  clickHandler(_event: any) {
    if (_event.type === 'createCbpPlan') {
      this.createCbp()
    }
  }

}
