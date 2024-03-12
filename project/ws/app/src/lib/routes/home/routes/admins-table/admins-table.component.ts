import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { MatSort, MatTableDataSource } from '@angular/material'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-admins-table',
  templateUrl: './admins-table.component.html',
  styleUrls: ['./admins-table.component.scss'],
})
export class AdminsTableComponent implements OnInit {

  @Input() tableHeaders: any
  @Input() tableData: any
  dataSource!: any

  @Output() updateAccess = new EventEmitter<any>()
  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }

  minDate = new Date()

  constructor() {
    this.dataSource = new MatTableDataSource<any>()
  }

  ngOnInit() {
    this.dataSource.data = this.tableData
  }

  getFinalColumns() {
    if (this.tableHeaders !== undefined) {
      const columns = _.map(this.tableHeaders.columns, c => c.key)
      return columns
    }
    return ''
  }

  enableAccessBtn(rowData: any) {
    rowData.enableAccessBtn = true
    rowData.assigned = false
  }

  emitSelectedDate(rowData: any) {
    this.updateAccess.emit(rowData)
  }

}
