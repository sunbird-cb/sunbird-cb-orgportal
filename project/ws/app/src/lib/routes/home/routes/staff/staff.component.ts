import { Component, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator, MatSnackBar } from '@angular/material'
import { MatSort } from '@angular/material/sort'
import { ITableData, IColums } from '../../interface/interfaces'
import * as _ from 'lodash'
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'ws-app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
})
export class StaffComponent implements OnInit, OnChanges {
  staffdata: FormGroup
  tableData: ITableData = {
    actions: [],
    columns: [
      { displayName: 'Sr. no.', key: 'srnumber' },
      { displayName: 'Position', key: 'position' },
      { displayName: 'Total positions filled currently', key: 'positionfilled', isList: true },
      { displayName: 'Total positions vacant currently', key: 'positionvacant' },
    ],
    needCheckBox: false,
    needHash: false,
    sortColumn: 'fullname',
    sortState: 'asc',
    needUserMenus: true,
  }
  dataSource!: any
  widgetData: any
  length!: number
  pageSize = 5
  pageSizeOptions = [5, 10, 20]
  displayedColumns: IColums[] | undefined
  selection = new SelectionModel<any>(true, [])
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  data!: { srnumber: number; position: string; positionfilled: number; positionvacant: number; }[]
  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }

  constructor(private snackBar: MatSnackBar) {
    this.staffdata = new FormGroup({
      totalpositions: new FormControl('', [Validators.required]),
      posfilled: new FormControl('', [Validators.required]),
      posvacant: new FormControl('', [Validators.required]),
    })
    this.dataSource = new MatTableDataSource<any>()
    // this.actionsClick = new EventEmitter()
    // this.clicked = new EventEmitter()
    this.dataSource.paginator = this.paginator
  }
  ngOnInit() {
    this.data = [
      {
        srnumber: 1,
        position: 'Deputy Director',
        positionfilled: 2,
        positionvacant: 2,
      },
      {
        srnumber: 1,
        position: 'Deputy Director',
        positionfilled: 2,
        positionvacant: 2,
      },
    ]
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    if (this.data) {
      this.dataSource.data = this.data
      this.dataSource.paginator = this.paginator
    }
  }

  ngOnChanges(data: SimpleChanges) {
    this.dataSource.data = _.get(data, 'data.currentValue')
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

  // onCreateClick() {
    // this.eOnCreateClick.emit()
  // }

  onSubmit(form: any) {
    console.log('form', form.value)
    // const newobj = {
    //   personalDetails: {
    //     email: form.value.email,
    //     userName: form.value.fname,
    //     firstName: form.value.fname,
    //     lastName: form.value.lname,
    //     channel: this.departmentName ? this.departmentName : null,
    //   },
    // }

    // this.usersSvc.createUser(newobj).subscribe(res => {
    //   if (res) {
    //     const dreq = {
    //       request: {
    //         organisationId: this.department,
    //         userId: res.userId,
    //         roles: form.value.roles,
    //       },
    //     }

    //     this.usersSvc.addUserToDepartment(dreq).subscribe(dres => {
    //       if (dres) {
    //         this.createUserForm.reset({ fname: '', lname: '', email: '', department: this.departmentName, roles: '' })
            this.openSnackbar('User Created Successfully')
    //         this.router.navigate(['/app/home/users'])
    //       }
    //     },
          // tslint:disable-next-line
          // (err: any) => { this.openSnackbar(err.error || err || `Some error occurred while updateing new user's role, Please try again later!`) })
      // }
    // },
      // tslint:disable-next-line
      // (err: any) => { this.openSnackbar(err.error || err || 'Some error occurred while creating user, Please try again later!') })
  }

  private openSnackbar(primaryMsg: string) {
    this.snackBar.open(primaryMsg)
  }

}
