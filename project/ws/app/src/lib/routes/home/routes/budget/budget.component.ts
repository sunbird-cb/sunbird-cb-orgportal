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
import { MdoInfoService } from '../../services/mdoinfo.service'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { ActivatedRoute } from '@angular/router'

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
      { displayName: 'Allocated training/capacity building budget', key: 'budgetallocated' },
      { displayName: 'Projected utilization of training budget', key: 'budgetutilization' },
      { displayName: 'Financial year', key: 'budgetyear' },
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
  overallmdodata!: { srnumber: number; filename: string; filetype: string; filesize: string; uploadedon: string }[]
  mdosalarydata!: { srnumber: number; filename: string; filetype: string; filesize: string; uploadedon: string }[]
  mdotrainingdata!: { srnumber: number; filename: string; filetype: string; filesize: string; uploadedon: string }[]
  schemewisedata!: { srnumber: number; filename: string; filetype: string; filesize: string; uploadedon: string }[]
  scehemetableDatadata!: { srnumber: number; schemename: string; budgetallocated: number; budgetutilization: number; }[]
  yearsList: any = []
  deptID: any
  data: any
  overallbudget: any
  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    if (!this.dataSource1.sort) {
      this.dataSource1.sort = sort
    }
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog, private configSvc: ConfigurationsService,
    private mdoinfoSrvc: MdoInfoService, private activeRoute: ActivatedRoute) {
    this.budgetdata = new FormGroup({
      budgetyear: new FormControl('', [Validators.required]),
      salarybudget: new FormControl('', [Validators.required]),
      trainingbudget: new FormControl('', [Validators.required]),
      budgetutilized: new FormControl('', [Validators.required]),
    })
    this.dataSource1 = new MatTableDataSource<any>()
    this.dataSource = new MatTableDataSource<any>()
    this.dataSource1.paginator = this.paginator
    this.dataSource.paginator = this.paginator

    if (this.configSvc.userProfile) {
      this.deptID = this.configSvc.userProfile.rootOrgId
      this.getBudgetDetails()
    } else if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')) {
      this.deptID = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')
      this.getBudgetDetails()
    }
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

    this.yearsList = ['2020-2021', '2021-2022']
  }

  ngOnChanges(data: SimpleChanges) {
    this.dataSource1.data = data.currentValue ? _.get(data, 'data.currentValue') : []
    this.dataSource.data = data.currentValue ? _.get(data, 'data.currentValue') : []
    this.length = this.dataSource.data.length || this.dataSource1.data.length
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

  updateData(rowdata: any) {
    this.onaddScehme(rowdata)
  }

  onaddScehme(rowdata: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    dialogConfig.width = '50%'
    dialogConfig.height = '52%'
    dialogConfig.maxHeight = 'auto'
    if (rowdata) {
      dialogConfig.data = {
        data: rowdata,
      }
    } else {
      dialogConfig.data = {
        data: [],
      }
    }

    const dialogRef = this.dialog.open(BudgetschemepopupComponent, dialogConfig)

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        if (!response.data.id) {
          const req = {
            orgId: this.deptID,
            budgetYear: response.data.budgetyear,
            schemeName: response.data.schemename,
            // salaryBudgetAllocated: Number(response.data.salarybudget),
            trainingBudgetAllocated: Number(response.data.budgetallocated),
            trainingBudgetUtilization: Number(response.data.budgetutilized),
          }
          this.mdoinfoSrvc.addBudgetdetails(req).subscribe(
            (res: any) => {
              if (res) {
                this.openSnackbar('Staff details updated successfully')
                this.getBudgetDetails()
              }
            },
            (_err: any) => {
            })
        } else {
          this.updateBudgetDetails(response.data)
        }
      }
    })
  }

  getBudgetDetails() {
    const currentYear = new Date().getFullYear()
    const nextYear = new Date().getFullYear() + 1
    const budgetyear = `${currentYear}-${nextYear}`
    this.mdoinfoSrvc.getBudgetdetails(this.deptID, budgetyear).subscribe(
      (res: any) => {
        const result = res.result.response
        result.sort((a: any, b: any) => {
          const textA = a.schemeName.toUpperCase()
          const textB = b.schemeName.toUpperCase()
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
        result.forEach((sres: any, index: any) => {
          sres.srnumber = index + 1
          if (sres.schemeName === 'all') {
            this.budgetdata.controls['budgetyear'].setValue(result.budgetYear)
            this.budgetdata.controls['salarybudget'].setValue(result.salaryBudgetAllocated)
            this.budgetdata.controls['trainingbudget'].setValue(result.trainingBudgetAllocated)
            this.budgetdata.controls['budgetutilized'].setValue(result.trainingBudgetUtilization)
            this.overallbudget = sres
            result.splice(index, 1)
          }
          this.data = result
        })

        if (this.data) {
          this.data.forEach((sres: any, index: any) => {
            sres.srnumber = index + 1
          })
          this.dataSource.data = this.data
          this.dataSource.paginator = this.paginator
        }
      })
  }

  onSubmit(form: any) {
    console.log('form', form.value)
    if (!this.overallbudget) {
      const req = {
        orgId: this.deptID,
        budgetYear: form.value.budgetyear,
        schemeName: 'all',
        salaryBudgetAllocated: Number(form.value.salarybudget),
        trainingBudgetAllocated: Number(form.value.trainingbudget),
        trainingBudgetUtilization: Number(form.value.budgetutilized),
      }
      this.mdoinfoSrvc.addBudgetdetails(req).subscribe(
        (res: any) => {
          if (res) {
            this.openSnackbar('Budget details updated successfully')
            this.getBudgetDetails()
          }
        },
        (_err: any) => {
        })
    } else {
      const req = {
        id: this.overallbudget.id,
        orgId: this.deptID,
        budgetYear: form.value.budgetyear,
        schemeName: 'all',
        trainingBudgetUtilization: Number(form.value.budgetutilized),
      }
      this.mdoinfoSrvc.updateBudgetdetails(req).subscribe(
        (res: any) => {
          if (res) {
            this.openSnackbar('Budget details updated successfully')
            this.getBudgetDetails()
          }
        },
        (_err: any) => {
        })
    }
  }

  updateBudgetDetails(form: any) {
    const req = {
      id: form.id,
      orgId: this.deptID,
      budgetYear: form.budgetyear,
      schemeName: form.schemename,
      trainingBudgetUtilization: Number(form.value.budgetutilized),
    }
    this.mdoinfoSrvc.updateStaffdetails(req).subscribe(
      (res: any) => {
        if (res) {
          this.openSnackbar('Staff details updated successfully')
          this.getBudgetDetails()
        }
      },
      (_err: any) => {
      })
  }

  deleteBudgetDetails(form: any) {
    this.mdoinfoSrvc.deleteBudgetdetails(form.id, this.deptID).subscribe(
      (res: any) => {
        if (res) {
          this.openSnackbar('Staff details deleted successfully')
          this.getBudgetDetails()
        }
      },
      (_err: any) => {
      })
  }

  private openSnackbar(primaryMsg: string) {
    this.snackBar.open(primaryMsg)
  }

  applyFilter(filterValue: any) {
    // this.isSearched = true
    if (filterValue) {
      let fValue = filterValue.trim()
      fValue = filterValue.toLowerCase()
      this.dataSource.filter = fValue
    } else {
      this.dataSource.filter = ''
    }
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
