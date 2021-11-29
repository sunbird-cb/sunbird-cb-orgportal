import { Component, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material'
import { MatSort } from '@angular/material/sort'
import { ITableData, IColums } from '../../interface/interfaces'
import * as _ from 'lodash'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { StaffdetailspopupComponent } from '../../components/staffdetailspopup/staffdetailspopup.component'
import { ActivatedRoute } from '@angular/router'
import { MdoInfoService } from '../../services/mdoinfo.service'
import { ConfigurationsService } from '@sunbird-cb/utils'

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
      { displayName: 'Total positions filled currently', key: 'totalPositionsFilled', isList: true },
      { displayName: 'Total positions vacant currently', key: 'totalPositionsVacant' },
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
  pageSize = 20
  pageSizeOptions = [20, 40, 60, 80, 100]
  displayedColumns: IColums[] | undefined
  selection = new SelectionModel<any>(true, [])
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  data!: { srnumber: number; position: string; positionfilled: number; positionvacant: number; }[]
  deptID: any
  overallpos: any
  isDisabled = true
  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog, private activeRoute: ActivatedRoute,
    // tslint:disable-next-line:align
    private configSvc: ConfigurationsService, private mdoinfoSrvc: MdoInfoService) {
    this.staffdata = new FormGroup({
      totalpositions: new FormControl({ value: '', disabled: true }),
      posfilled: new FormControl('', [Validators.required]),
      posvacant: new FormControl('', [Validators.required]),
    })
    this.dataSource = new MatTableDataSource<any>()
    this.dataSource.paginator = this.paginator

    if (this.configSvc.userProfile) {
      this.deptID = this.configSvc.userProfile.rootOrgId
      this.getStaffDetails()
    } else if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')) {
      this.deptID = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')
      this.getStaffDetails()
    }
  }
  ngOnInit() {
    // this.data = [
    //   {
    //     srnumber: 1,
    //     position: 'Deputy Director',
    //     positionfilled: 2,
    //     positionvacant: 2,
    //   },
    //   {
    //     srnumber: 2,
    //     position: 'Deputy Director',
    //     positionfilled: 2,
    //     positionvacant: 2,
    //   },
    // ]
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

  getStaffDetails() {
    this.mdoinfoSrvc.getStaffdetails(this.deptID).subscribe(
      (res: any) => {
        const result = res.result.response
        result.sort((a: any, b: any) => {
          const textA = a.position.toUpperCase()
          const textB = b.position.toUpperCase()
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
        result.forEach((sres: any, index: any) => {
          sres.srnumber = index + 1
          if (sres.position === 'all') {
            this.staffdata.controls['posfilled'].setValue(sres.totalPositionsFilled)
            this.staffdata.controls['posvacant'].setValue(sres.totalPositionsVacant)
            const totalpos = sres.totalPositionsFilled + sres.totalPositionsVacant
            this.staffdata.controls['totalpositions'].setValue(totalpos)
            this.overallpos = sres
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
      },
      (error: any) => {
        if (error && error.status === 400) {
          this.openSnackbar('No staff positions found')
        }
      })
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
    this.onAddPosition(rowdata)
  }

  onAddPosition(rowdata: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    dialogConfig.width = '50%'
    dialogConfig.height = '52%'
    dialogConfig.maxHeight = 'auto'
    if (rowdata) {
      dialogConfig.data = {
        data: rowdata,
        addedposititons: this.data,
      }
    } else {
      dialogConfig.data = {
        data: [],
        addedposititons: this.data,
      }
    }

    const dialogRef = this.dialog.open(StaffdetailspopupComponent, dialogConfig)
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        if (!response.data.id) {
          const req = {
            orgId: this.deptID,
            position: response.data.designation || response.data.position,
            totalPositionsFilled: Number(response.data.posfilled) || Number(response.data.totalPositionsFilled),
            totalPositionsVacant: Number(response.data.posvacant) || Number(response.data.totalPositionsVacant),
          }
          this.mdoinfoSrvc.addStaffdetails(req).subscribe(
            (res: any) => {
              if (res) {
                this.openSnackbar('Staff details updated successfully')
                this.getStaffDetails()
              }
            },
            (error: any) => {
              if (error && error.status === 400) {
                this.openSnackbar('Position exists for given name')
              }
            })
        } else {
          this.updateStaffDetails(response.data)
        }
      }
    })
  }

  onSubmit(form: any) {
    if (!this.overallpos) {
      const req = {
        orgId: this.deptID,
        position: 'all',
        totalPositionsFilled: Number(form.value.posfilled),
        totalPositionsVacant: Number(form.value.posvacant),
      }
      this.mdoinfoSrvc.addStaffdetails(req).subscribe(
        (res: any) => {
          if (res) {
            this.openSnackbar('Staff details updated successfully')
            this.getStaffDetails()
          }
        },
        (_err: any) => {
        })
    } else {
      const req = {
        id: this.overallpos.id,
        orgId: this.deptID,
        position: 'all',
        totalPositionsFilled: Number(form.value.posfilled),
        totalPositionsVacant: Number(form.value.posvacant),
      }
      this.mdoinfoSrvc.updateStaffdetails(req).subscribe(
        (res: any) => {
          if (res) {
            this.openSnackbar('Staff details updated successfully')
            this.getStaffDetails()
          }
        },
        (_err: any) => {
        })
    }
  }

  updateStaffDetails(form: any) {
    const req = {
      id: form.id,
      orgId: this.deptID,
      position: form.position,
      totalPositionsFilled: Number(form.totalPositionsFilled),
      totalPositionsVacant: Number(form.totalPositionsVacant),
    }
    this.mdoinfoSrvc.updateStaffdetails(req).subscribe(
      (res: any) => {
        if (res) {
          this.openSnackbar('Staff details updated successfully')
          this.getStaffDetails()
        }
      },
      (_err: any) => {
      })
  }

  deleteStaffDetails(form: any) {
    this.mdoinfoSrvc.deleteStaffdetails(form.id, this.deptID).subscribe(
      (res: any) => {
        if (res) {
          this.openSnackbar('Staff details deleted successfully')
          this.getStaffDetails()
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

  // Only Integer Numbers
  keyPressNumbers(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault()
      return false
    }
    return true
  }

}
