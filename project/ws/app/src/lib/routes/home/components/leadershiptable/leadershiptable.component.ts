import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges } from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator, MatDialogConfig, MatDialog } from '@angular/material'
import { MatSort } from '@angular/material/sort'
import { IColums } from '../../interface/interfaces'
import * as _ from 'lodash'
import { AdduserpopupComponent } from '../adduserpopup/adduserpopup.component'

@Component({
  selector: 'ws-app-leadershiptable',
  templateUrl: './leadershiptable.component.html',
  styleUrls: ['./leadershiptable.component.scss'],
})
export class LeadershiptableComponent implements OnInit, OnChanges {
  @Input() data!: {
    srnumber: number;
    fullname: string;
    position: string;
    email: string;
  }[]
  @Input() tableData: any = []
  @Input() usersData: any = []
  dataSource!: any
  widgetData: any
  length!: number
  pageSize = 5
  pageSizeOptions = [5, 10, 20]
  displayedColumns: IColums[] | undefined
  selection = new SelectionModel<any>(true, [])
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  // tslint:disable-next-line:max-line-length
  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }

  constructor(public dialog: MatDialog) {
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

  // onRowClick(e: any) {
    // this.eOnRowClick.emit(e)
  // }

  adduser() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    dialogConfig.width = '77%'
    dialogConfig.height = '75%'
    dialogConfig.maxHeight = 'auto'
    dialogConfig.data = {
      data: this.usersData,
    }

    const dialogRef = this.dialog.open(AdduserpopupComponent, dialogConfig)

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        console.log('response', response)
      }
    })
  }

}
