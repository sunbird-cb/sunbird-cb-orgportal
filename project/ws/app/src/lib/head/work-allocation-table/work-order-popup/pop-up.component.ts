import { WorkallocationService } from './../../../routes/home/services/workallocation.service'
import {
  Component, OnInit, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges, Inject, Renderer2,
} from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialogRef, MatPaginator, MAT_DIALOG_DATA } from '@angular/material'
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'
import { Router } from '@angular/router'
import { ITableData, IColums } from '../interface/interfaces'

interface IUser { fullname: string; email: string, userId: string }

@Component({
  selector: 'ws-widget-ui-user-table-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss'],
})
export class WorkAllocationPopUpComponent implements OnInit, OnChanges {
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
  isBlank = true
  tableElement: any
  departmentName!: string
  departmentID!: number
  currentCheckedValue = null
  currentCheckedValue2 = null
  favoriteSeason: string | undefined
  workOrder = 'Work Order'
  pageSizeOptions = [5, 10, 20]
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  @ViewChild(MatSort, { static: true }) sort?: MatSort
  selection = new SelectionModel<any>(true, [])

  constructor(
    private router: Router, private ren: Renderer2,
    public dialogRef: MatDialogRef<WorkAllocationPopUpComponent>, private workallocationSrvc: WorkallocationService,
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
        { displayName: 'Published on', key: 'publishedon' },
        { displayName: 'Published by', key: 'publishedby' },
      ],
      actions: [],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
      needUserMenus: false,
    }
    this.getdeptUsers()
    this.getAllUserByKey()
  }

  ngOnChanges(data: SimpleChanges) {
    this.dataSource.data = _.get(data, 'data.currentValue')
    this.length = this.dataSource.data.length
  }
  getdeptUsers() {
    this.workallocationSrvc.getAllUsers().subscribe(res => {
      this.departmentName = res.result.response.channel
      this.departmentID = res.result.response.rootOrgId
    })
  }
  goToNewWat() {
    this.workallocationSrvc.addWAT(this.currentCheckedValue, this.departmentID).subscribe(res => {
      if (res.result.data.id) {
        this.dialogRef.close()
        this.router.navigate([`app/workallocation/drafts/${res.result.data.id}`])
      }
    })

  }
  goToCopyWat() {
    this.workallocationSrvc.copyWAT(this.currentCheckedValue2, this.currentCheckedValue).subscribe(res => {
      if (res.result.data.id) {
        this.dialogRef.close()
        this.router.navigate([`app/workallocation/drafts/${res.result.data.id}`])
      }
    })

  }
  applyFilter(filterValue: any) {
    this.isSearched = true
    if (filterValue) {
      let fValue = filterValue.trim()
      fValue = filterValue.toLowerCase()
      this.dataSource.filter = fValue
    } else {
      this.dataSource.filter = ''
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
  checkState(el: any) {
    this.tableElement = el
    setTimeout(() => {
      if (this.currentCheckedValue2 && this.currentCheckedValue2 === this.tableElement.value.id) {
        this.tableElement.checked = false
        this.ren.removeClass(this.tableElement['_elementRef'].nativeElement, 'cdk-focused')
        this.ren.removeClass(this.tableElement['_elementRef'].nativeElement, 'cdk-program-focused')
        this.currentCheckedValue2 = null
        this.isBlank = true
      } else {
        this.currentCheckedValue2 = this.tableElement.value.id
        this.isBlank = false
      }
    })
  }
  getAllUserByKey() {
    const currentStatus = 'Published'
    const finalData: any[] = []
    this.workallocationSrvc.fetchWAT(currentStatus).subscribe(res => {
      if (res.result.data) {
        res.result.data.forEach((element: any) => {
          const watData = {
            id: element.id,
            workorders: element.name,
            officers: element.userIds.length || 0,
            lastupdatedon: this.workallocationSrvc.getTime(element.updatedAt),
            lastupdatedby: element.updatedByName,
            errors: element.errorCount,
            publishedon: this.workallocationSrvc.getTime(element.createdAt),
            publishedby: element.createdByName,
            approval: 'Download',
            fromdata: currentStatus,

          }
          finalData.push(watData)
        })
      }
      this.dataSource.data = finalData
    })
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
  clearSelection() {
    this.tableElement.checked = false
    this.ren.removeClass(this.tableElement['_elementRef'].nativeElement, 'cdk-focused')
    this.ren.removeClass(this.tableElement['_elementRef'].nativeElement, 'cdk-program-focused')
    this.currentCheckedValue2 = null
    this.isBlank = true
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
