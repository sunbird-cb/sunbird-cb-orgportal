import { Component, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material'
import { MatSort } from '@angular/material/sort'
import { ITableData, IColums } from '../../interface/interfaces'
import * as _ from 'lodash'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { BudgetschemepopupComponent } from '../../components/budgetschemepopup/budgetschemepopup.component'
import { BudgetproofspopupComponent } from '../../components/budgetproofspopup/budgetproofspopup.component'

@Component({
  selector: 'ws-app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
})
export class BudgetComponent implements OnInit, OnChanges {
  budgetdata: FormGroup
  scehemetableData: ITableData = {
    actions: [],
    columns: [
      { displayName: 'Sr. no.', key: 'srnumber' },
      { displayName: 'Scheme name', key: 'schemename' },
      { displayName: 'Training/capacity building budget allocated in current FY', key: 'budgetallocated' },
      { displayName: 'Training building utilization in current FY', key: 'budgetutilization' },
    ],
    needCheckBox: false,
    needHash: false,
    sortColumn: 'fullname',
    sortState: 'asc',
    needUserMenus: true,
  }
  tableData: ITableData = {
    actions: [],
    columns: [
      { displayName: 'Sr. no.', key: 'srnumber' },
      { displayName: 'File name', key: 'filename' },
      { displayName: 'File type', key: 'filetype' },
      { displayName: 'File size', key: 'filesize' },
      { displayName: 'Uploaded on', key: 'uploadedon' },
    ],
    needCheckBox: false,
    needHash: false,
    sortColumn: 'fullname',
    sortState: 'asc',
    needUserMenus: true,
  }
  dataSource1!: any
  dataSource!: any
  widgetData: any
  length!: number
  pageSize = 5
  pageSizeOptions = [5, 10, 20]
  displayedColumns1: IColums[] | undefined
  displayedColumns: IColums[] | undefined
  selection = new SelectionModel<any>(true, [])
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  overallmdodata!: { srnumber: number; filename: string; filetype: string; filesize: string; uploadedon: string}[]
  mdosalarydata!: { srnumber: number; filename: string; filetype: string; filesize: string; uploadedon: string}[]
  mdotrainingdata!: { srnumber: number; filename: string; filetype: string; filesize: string; uploadedon: string}[]
  schemewisedata!: { srnumber: number; filename: string; filetype: string; filesize: string; uploadedon: string}[]
  scehemetableDatadata!: { srnumber: number; schemename: string; budgetallocated: number; budgetutilization: number; }[]
  yearsList: any = []
  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    if (!this.dataSource1.sort) {
      this.dataSource1.sort = sort
    }
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.budgetdata = new FormGroup({
      budgetyear: new FormControl('', [Validators.required]),
      salarybudget: new FormControl('', [Validators.required]),
      trainingbudget: new FormControl('', [Validators.required]),
      budgetutilized: new FormControl('', [Validators.required]),
    })
    this.dataSource1 = new MatTableDataSource<any>()
    this.dataSource = new MatTableDataSource<any>()
    // this.actionsClick = new EventEmitter()
    // this.clicked = new EventEmitter()
    this.dataSource1.paginator = this.paginator
    this.dataSource.paginator = this.paginator
  }
  ngOnInit() {
    if (this.scehemetableData) {
      this.displayedColumns1 = this.scehemetableData.columns
    }
    if (this.scehemetableDatadata) {
      this.dataSource1.data = this.overallmdodata
      this.dataSource1.paginator = this.paginator
    }

    this.scehemetableDatadata = [
      {
        srnumber: 1,
        schemename: 'Newfile',
        budgetallocated: 20,
        budgetutilization: 10,
      },
    ]

    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    if (this.overallmdodata) {
      this.dataSource.data = this.overallmdodata
      this.dataSource.paginator = this.paginator
    }

    this.overallmdodata = [
      {
        srnumber: 1,
        filename: 'Newfile',
        filetype: 'PDF',
        filesize: '43242KB',
        uploadedon: '22 Sep, 2021',
      },
    ]

    this.yearsList = ['2020-2021' , '2021-2022' ]
  }

  ngOnChanges(data: SimpleChanges) {
    this.dataSource1.data = data.currentValue ? _.get(data, 'data.currentValue') : []
    this.dataSource.data = data.currentValue ? _.get(data, 'data.currentValue') : []
    this.length =  this.dataSource.data.length || this.dataSource1.data.length
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

  onaddScehme() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    dialogConfig.width = '50%'
    dialogConfig.height = '52%'
    dialogConfig.maxHeight = 'auto'
    dialogConfig.data = {
      data: '',
    }

    const dialogRef = this.dialog.open(BudgetschemepopupComponent, dialogConfig)

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        console.log('response', response)
      }
    })
  }

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

  browsefiles(tab: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    dialogConfig.width = '60%'
    dialogConfig.height = '60%'
    dialogConfig.maxHeight = 'auto'
    dialogConfig.data = {
      data: tab,
    }

    const dialogRef = this.dialog.open(BudgetproofspopupComponent, dialogConfig)

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        console.log('response', response)
      }
    })

  }

}
