import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
// import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
// import { EventService } from '@sunbird-cb/utils'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { TrainingPlanDashboardService } from '../../services/training-plan-dashboard.service'
import moment from 'moment'
import { LoaderService } from '../../../../../../../../../src/app/services/loader.service'
import { TrainingPlanService } from '../../../training-plan/services/traininig-plan.service'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ConfirmationBoxComponent } from '../../../training-plan/components/confirmation-box/confirmation.box.component'

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
  tagListData: any = [{
    name: 'Designation',
    value: 'Designation',
    selected: true,
  }, {
    name: 'All users',
    value: 'AllUser',
    selected: false,
  }, {
    name: 'Custom users',
    value: 'CustomUser',
    selected: false,
  }]
  fetchContentDone!: boolean
  completeDataRes: any
  dialogRef: any
  conficSvc: any
  pageConfig: any

  constructor(
    // private events: EventService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private trainingDashboardSvc: TrainingPlanDashboardService,
    private loaderService: LoaderService,
    private trainingPlanService: TrainingPlanService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.conficSvc = this.activeRoute.snapshot.data['configService']
    this.pageConfig = this.activeRoute.snapshot.data['pageData']
    this.hasAccess()
    this.tabledata = {
      columns: [
        // { displayName: 'Id', key: 'identifier' },
        { displayName: 'Plan name', key: 'name' },
        { displayName: 'Assignee', key: 'assigneeCount' },
        { displayName: 'Total content', key: 'contentCount' },
        { displayName: 'Content type', key: 'contentType' },
        { displayName: 'Timeline', key: 'endDate' },
        { displayName: 'Created by', key: 'createdByName' },
        { displayName: 'Created on', key: 'updatedAt' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'updatedAt',
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
    this.fetchContentDone = false
    this.tagListData.map((item: any) => {
      if (item.value === 'Designation') {
        item.selected = true
      } else {
        item.selected = false
      }
    })
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
      this.completeDataRes = liveRes.result.content
      this.trainingPlanData = this.completeDataRes.filter((v: any) => v.userType === 'Designation')
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
      this.completeDataRes = draftRes.result.content
      this.trainingPlanData = this.completeDataRes.filter((v: any) => v.userType === 'Designation')
      this.convertDataAsPerTable()
    } else {
      this.loaderService.changeLoaderState(false)
    }
  }

  convertDataAsPerTable() {
    this.completeDataRes.map((res: any) => {
      res.contentCount = (res.contentList) ? res.contentList.length : 0
      res.assigneeCount = (res.userType === 'AllUser') ? 'All Users' : (res.userDetails) ? res.userDetails.length : 0
      res.endDate = (res.endDate) ? moment(res.endDate).format('MMM DD[,] YYYY') : ''
      res.updatedAt = (res.updatedAt) ? moment(res.updatedAt).format('MMM DD[,] YYYY') : ''
    })
    this.fetchContentDone = true
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
        this.showConformationModal(_event.row, _event.action)
        break
      case 'publishContent':
        this.showConformationModal(_event.row, _event.action)
        break
    }
  }

  previewData(_selectedRow: any) {
    // this.loaderService.changeLoaderState(true)
    this.router.navigate(['app', 'training-plan', 'preview-plan-for-dashboard', _selectedRow.id])
  }

  editContentData(_selectedRow: any) {
    this.router.navigate(['app', 'training-plan', 'update-plan', _selectedRow.id])
  }

  showConformationModal(_selectedRow: any, _type: any) {
    this.dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      disableClose: true,
      data: {
        type: 'conformation',
        icon: 'radio_on',
        title: (_type === 'deleteContent') ? 'Are you sure you want to delete?' :
          (_type === 'publishContent') ? 'Are you sure you want to publish?' : '',
        subTitle: 'You wont be able to revert this',
        primaryAction: (_type === 'deleteContent') ? 'Delete' : (_type === 'publishContent') ? 'Publish' : '',
        secondaryAction: 'Cancel',
      },
      autoFocus: false,
    })

    this.dialogRef.afterClosed().subscribe((_res: any) => {
      if (_res === 'confirmed') {
        if (_type === 'deleteContent') {
          this.deleteContentData(_selectedRow)
        } else if (_type === 'publishContent') {
          this.publishContentData(_selectedRow)
        }
      }
    })
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
      this.filterData()
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
        this.filterData()
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

  filterDataAsPerTab(_event: any) {
    this.tagListData.map((item: any) => {
      if (item.value === _event) {
        item.selected = true
      } else {
        item.selected = false
      }
    })
    this.trainingPlanData = this.completeDataRes.filter((v: any) => v.userType === _event)
  }

  hasAccess() {
    if (this.pageConfig && this.pageConfig.data && this.pageConfig.data.actionMenu) {
      this.pageConfig.data.actionMenu.map((_v: any) => {
        debugger
      })
    }
  }

}
