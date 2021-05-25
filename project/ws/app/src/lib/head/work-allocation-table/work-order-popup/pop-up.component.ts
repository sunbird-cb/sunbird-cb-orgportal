import {
  Component, OnInit, Output, EventEmitter, ViewChild,
  AfterViewInit, OnChanges, SimpleChanges, Inject,
} from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialogRef, MatPaginator, MAT_DIALOG_DATA } from '@angular/material'
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'
import { Router } from '@angular/router'
import { ITableData, IColums } from '../interface/interfaces'
import { UserViewPopUpService } from './ui-user-table-pop-up.services'

interface IUser { fullname: string; email: string, userId: string }

@Component({
  selector: 'ws-widget-ui-user-table-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss'],
})
export class WorkAllocationPopUpComponent implements OnInit, AfterViewInit, OnChanges {
  tableData!: ITableData | undefined
  data!: IUser[] | undefined
  @Output() clicked?: EventEmitter<any>
  @Output() actionsClick?: EventEmitter<any>
  @Output() eOnRowClick = new EventEmitter<any>()
  bodyHeight = document.body.clientHeight - 125
  displayedColumns: IColums[] | undefined
  viewPaginator = false
  dataSource!: any
  widgetData: any
  length!: number
  chkBox = false
  isSearched = false
  pageSize = 5
  userData: any
  pageSizeOptions = [5, 10, 20]
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  @ViewChild(MatSort, { static: true }) sort?: MatSort
  selection = new SelectionModel<any>(true, [])

  constructor(private userViewPopUpService: UserViewPopUpService, private router: Router,
              public dialogRef: MatDialogRef<WorkAllocationPopUpComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    this.dataSource = new MatTableDataSource<any>()
    this.actionsClick = new EventEmitter()
    this.clicked = new EventEmitter()
    this.dataSource.paginator = this.paginator

  }

  ngOnInit() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    this.dataSource.data = []
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.viewPaginator = true
    this.tableData = {
      columns: [
        { displayName: 'Work orders', key: 'workorders' },
        { displayName: 'Officers', key: 'officers' },
        { displayName: 'Published By', key: 'publishedby' },
      ],
      actions: [],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
      needUserMenus: false,
    }
    this.userData = [
      {
        id: 2,
        workorders: 'Work order division 1',
        officers: '12',
        lastupdatedon: '03:30 PM 18 May  2021',
        lastupdatedby: 'Garima Joshi',
        publishedon: '03:30 PM 18 May  2021',
        publishedby: 'Manjunatha HS',
        errors: '11',
        approval: 'Download',
      },
      {
        id: 2,
        workorders: 'Work order division 1',
        officers: '12',
        lastupdatedon: '03:30 PM 18 May  2021',
        lastupdatedby: 'Manjunatha HS',
        publishedon: '03:30 PM 18 May  2021',
        publishedby: 'Manjunatha HS',
        errors: '11',
        approval: 'Download',

      },

    ]
    this.getAllUserByKey(this.userData)
  }

  ngOnChanges(data: SimpleChanges) {
    this.dataSource.data = _.get(data, 'data.currentValue')
    this.length = this.dataSource.data.length
  }
  ngAfterViewInit() {

  }
  goToWorkAllocation() {
    this.dialogRef.close()
    this.router.navigate([`/app/workallocation/create`])
  }
  applyFilter(filterValue: any) {
    this.isSearched = true
    if (filterValue) {
      let fValue = filterValue.trim()
      fValue = filterValue.toLowerCase()
      this.dataSource.filter = fValue
      this.getAllActiveUsersAPI(fValue)
    } else {
      this.dataSource.filter = ''
      this.dataSource.data = []
    }
  }

  buttonClick(action: string, row: any) {
    if (this.tableData) {
      const isDisabled = _.get(_.find(this.tableData.actions, ac => ac.name === action), 'disabled') || false
      if (!isDisabled && this.actionsClick) {
        this.actionsClick.emit({ action, row })
      }
    }

  }
  getAllActiveUsersAPI(searchString: string) {
    this.userViewPopUpService.getAllUsersByDepartments(searchString).subscribe(res => {
      this.getAllUserByKey(res)
    })

  }
  getAllUserByKey(userObj: any) {
    if (userObj && userObj !== null && userObj !== undefined) {
      this.dataSource.data = []
      userObj.forEach((user: any) => {
        const obj = {
          workorders: user.workorders,
          officers: user.officers,
          lastupdatedon: user.lastupdatedon,
          lastupdatedby: user.lastupdatedby,
          errors: user.errors,
          publishedon: user.publishedon,
          publishedby: user.publishedby,
          approval: user.approval,
        }
        this.dataSource.data.push(obj)
        this.dataSource.data = this.dataSource.data.slice()
      })
    }
    return []

  }

  getFinalColumns() {
    if (this.tableData !== undefined) {
      const columns = _.map(this.tableData.columns, c => c.key)
      if (this.tableData.actions && this.tableData.actions.length > 0) {
        columns.push('Actions')
      }
      if (this.tableData.needCheckBox) {
        columns.splice(0, 0, 'select')
      }
      if (this.tableData.needHash) {
        columns.splice(0, 0, 'SR')
      }
      if (this.tableData.actions && this.tableData.actions.length > 0) {
        // columns.push('Menu')
      }
      return columns
    }
    return ''
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  filterList(list: any[], key: string) {
    return list.map(lst => lst[key])
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: any) => this.selection.select(row))
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`
  }

  onRowClick(e: any) {
    this.eOnRowClick.emit(e)

  }
}
