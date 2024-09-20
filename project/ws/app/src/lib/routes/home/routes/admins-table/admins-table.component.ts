import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatSort, MatTableDataSource } from '@angular/material'
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter'
import * as _ from 'lodash'

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}

@Component({
  selector: 'ws-app-admins-table',
  templateUrl: './admins-table.component.html',
  styleUrls: ['./admins-table.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
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
  today = new Date()
  maxDate: any

  constructor() {
    this.dataSource = new MatTableDataSource<any>()
    this.maxDate = new Date(this.today.getFullYear() + 1, this.today.getMonth(), this.today.getDate())
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
    if (rowData.preExpiryDate) {
      rowData.buttonText = 'Update Access'
    }
  }

  emitSelectedDate(rowData: any) {
    this.updateAccess.emit(rowData)
  }

}
