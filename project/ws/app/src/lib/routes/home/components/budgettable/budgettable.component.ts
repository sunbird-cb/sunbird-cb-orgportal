import { Component, OnInit, OnChanges, Input, Output, ViewChild, SimpleChanges, EventEmitter } from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material'
import { MatSort } from '@angular/material/sort'
import { IColums } from '../../interface/interfaces'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-budgettable',
  templateUrl: './budgettable.component.html',
  styleUrls: ['./budgettable.component.scss'],
})
export class BudgettableComponent implements OnInit, OnChanges {
  @Input() type: any
  @Input() data!: {
    srnumber: number;
    filename: string;
    filesize: string;
    uploadedon: string;
  }[]
  @Input() tableData: any = []
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onUploadFilesClick = new EventEmitter<any>()
  dataSource!: any
  widgetData: any
  length!: number
  pageSize = 20
  pageSizeOptions = [20, 40, 60]
  displayedColumns: IColums[] | undefined
  selection = new SelectionModel<any>(true, [])
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }

  constructor() {
    this.dataSource = new MatTableDataSource<any>()
    // this.actionsClick = new EventEmitter()
    // this.clicked = new EventEmitter()
    this.dataSource.paginator = this.paginator
  }

  ngOnInit() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    if (this.data) {
      this.dataSource.data = this.data
      this.dataSource.paginator = this.paginator
    }
  }

  ngOnChanges(data: SimpleChanges) {
    this.dataSource.data = data.currentValue ? _.get(data, 'data.currentValue') : []
    this.length = this.dataSource.data.length
    this.paginator.firstPage()
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

  uploadFilesClick(e: any) {
    this.onUploadFilesClick.emit(e)
  }

  // onCreateClick() {
  // this.eOnCreateClick.emit()
  // }
}
