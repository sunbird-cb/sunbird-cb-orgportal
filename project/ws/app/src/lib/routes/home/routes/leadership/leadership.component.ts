import { Component, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { MatPaginator, MatTabChangeEvent, MatTableDataSource } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { IColums, ITableData } from '../../interface/interfaces'
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'
import { MdoInfoService } from '../../services/mdoinfo.service'

@Component({
  selector: 'ws-app-leadership',
  templateUrl: './leadership.component.html',
  styleUrls: ['./leadership.component.scss'],
})
export class LeadershipComponent implements OnInit, AfterViewInit, OnChanges {
  tableData: ITableData = {
    actions: [],
    columns: [
      { displayName: 'Sr. no.', key: 'srnumber' },
      { displayName: 'Full name', key: 'fullname' },
      { displayName: 'Position', key: 'position', isList: true },
      { displayName: 'Email', key: 'email' },
    ],
    needCheckBox: false,
    needHash: false,
    sortColumn: 'fullname',
    sortState: 'asc',
    needUserMenus: true,
  }
  data: any = []
  dataSource!: any
  widgetData: any
  length!: number
  pageSize = 20
  pageSizeOptions = [20, 40, 60, 80, 100]
  displayedColumns: IColums[] | undefined
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  // tslint:disable-next-line:max-line-length
  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }
  ltdata: any = []
  admindata: any = []
  usersData:  any = []
  bodyHeight = document.body.clientHeight - 125
  deptID: any
  tabData = 'MDO_LEADER'

  constructor(private activeRoute: ActivatedRoute, private configSvc: ConfigurationsService, private mdoinfoSrvc: MdoInfoService) {
    this.dataSource = new MatTableDataSource<any>()
    this.dataSource.paginator = this.paginator
  }

  ngOnInit() {
    // this.getUsers('MDO_LEADER')
    if (this.configSvc.userProfile) {
      this.deptID = this.configSvc.userProfile.rootOrgId
    } else if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')) {
      this.deptID = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')
    }

    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
  }

  ngOnChanges(data: SimpleChanges) {
    this.dataSource.data = _.get(data, 'data.currentValue')
    this.length = this.dataSource.data.length
    this.paginator.firstPage()
  }

  ngAfterViewInit() { }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    if (tabChangeEvent.index === 0 && tabChangeEvent.tab.textLabel === 'Leadership team') {
      this.tabData = 'MDO_LEADER'
    }

    if (tabChangeEvent.index === 1 && tabChangeEvent.tab.textLabel === 'Admin team') {
      this.tabData = 'MDO_ADMIN'
    }
  }

  applyFilter(filterValue: any) {
    if (filterValue) {
      let fValue = filterValue.trim()
      fValue = filterValue.toLowerCase()
      this.dataSource.filter = fValue
    } else {
      this.dataSource.filter = ''
    }
  }

  // buttonClick(action: string, row: any) {
  //   if (this.tableData) {
  //     const isDisabled = _.get(_.find(this.tableData.actions, ac => ac.name === action), 'disabled') || false
  //     if (!isDisabled && this.actionsClick) {
  //       this.actionsClick.emit({ action, row })
  //     }
  //   }
  // }

  getFinalColumns() {
    if (this.tableData !== undefined) {
      const columns = _.map(this.tableData.columns, c => c.key)
      if (this.tableData.needCheckBox) {
        columns.splice(0, 0, 'select')
      }
      if (this.tableData.needHash) {
        columns.splice(0, 0, 'SR')
      }
      if (this.tableData.needUserMenus) {
        columns.push('Menu')
      }
      return columns
    }
    return ''
  }

  getUsers(role: any) {
    const req = {
      request: {
        filters: {
            rootOrgId: this.deptID,
            'roles.role': [
              role,
          ],
        },
      },
    }
    this.mdoinfoSrvc.getTeamUsers(req).subscribe(
      (res: any) => {
        this.usersData = res.result.response.content
        if (this.usersData.length > 0) {
          this.usersData.forEach((user: any, index: any)  => {
            const obj = {
              fullname: `${user.firstName} ${user.lastName}`,
              email: user.email,
              position: user.channel,
              id: user.id,
              srnumber: index + 1,
            }
            if (role === 'MDO_LEADER') {
              this.data.push(obj)
            } else if (role === 'MDO_ADMIN') {
              this.admindata.push(obj)
            }
          })

          if (this.data) {
            // console.log('this.data', this.data)
            this.dataSource.data = this.data
            this.dataSource.paginator = this.paginator
          }
        }
      },
      (_err: any) => {
      })
  }
}
