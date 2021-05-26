import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild,
  AfterViewInit, OnChanges, SimpleChanges,
} from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog, MatPaginator, MatSnackBar } from '@angular/material'
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'

import { ITableData, IColums } from '../interface/interfaces'
import { Router, ActivatedRoute } from '@angular/router'
import { UserPopupComponent } from '../user-popup/user-popup'
import { CreateMDOService } from '../create-mdo.services'
import { ExportAsConfig } from 'ngx-export-as'
import * as fileSavers from 'file-saver'

@Component({
  selector: 'ws-work-allocation-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class WorkAllocationTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() tableData!: ITableData | undefined
  @Input() data?: []
  @Input() needCreateUser?: boolean = undefined
  @Input() needAddAdmin?: boolean
  @Input() isUpload?: boolean
  @Input() isCreate?: boolean
  @Input() inputDepartmentId?: string | undefined
  @Output() clicked?: EventEmitter<any>
  @Output() actionsClick?: EventEmitter<any>
  @Output() eOnRowClick = new EventEmitter<any>()
  bodyHeight = document.body.clientHeight - 125
  displayedColumns: IColums[] | undefined
  viewPaginator = false
  dataSource!: any
  widgetData: any
  length!: number
  departmentRole!: string
  departmentId!: string | undefined
  pageSize = 5
  pageSizeOptions = [5, 10, 20]
  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'downloadtemplate',
  }
  downloaddata: any = []
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  @ViewChild(MatSort, { static: true }) sort?: MatSort
  selection = new SelectionModel<any>(true, [])
  constructor(
    private router: Router, public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private createMDOService: CreateMDOService,
    private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource<any>()
    this.actionsClick = new EventEmitter()
    this.clicked = new EventEmitter()
    this.dataSource.paginator = this.paginator

  }

  ngOnInit() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    this.dataSource.data = this.data
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.viewPaginator = true
    this.activatedRoute.params.subscribe(params => {
      this.departmentRole = params['currentDept']
      this.departmentId = params['roleId']
      if (this.needCreateUser !== false && this.departmentRole && this.departmentId) {
        this.needAddAdmin = true
        this.needCreateUser = true
      }

    })
    if (!this.departmentId && this.inputDepartmentId) {
      this.departmentId = this.inputDepartmentId
    }
  }

  ngOnChanges(data: SimpleChanges) {
    this.dataSource.data = _.get(data, 'data.currentValue')
    this.length = this.dataSource.data.length
  }

  ngAfterViewInit() { }

  applyFilter(filterValue: any) {

    if (filterValue) {
      let fValue = filterValue.trim()
      fValue = filterValue.toLowerCase()
      this.dataSource.filter = fValue
    } else {
      this.dataSource.filter = ''
    }
  }
  buttonClick(action: string, row: any) {
    if (action && row.fromdata === 'draft') {
      const pdfName = 'draft'
      const pdfUrl = '/assetsfiles/draft.pdf'
      fileSavers.saveAs(pdfUrl, pdfName)
    } else if (action && row.fromdata === 'published') {

      const pdfName = 'published'
      const pdfUrl = '/assets/files/published.pdf'
      fileSavers.saveAs(pdfUrl, pdfName)
    } else {
      const pdfName = 'scaned'
      const pdfUrl = '/assets/files/scaned.pdf'
      fileSavers.saveAs(pdfUrl, pdfName)
    }

  }

  getFinalColumns() {
    if (this.tableData !== undefined) {
      const columns = _.map(this.tableData.columns, c => c.key)
      if (this.tableData.needCheckBox) {
        columns.splice(0, 0, 'select')
      }
      if (this.tableData.needHash) {
        columns.splice(0, 0, 'SR')
      }
      if (this.tableData.actions && this.tableData.actions.length > 0) {
        columns.push('Actions')
      }
      if (this.tableData.needUserMenus) {
        columns.push('Menu')
      }
      return columns
    }
    return ''
  }
  openPopup() {
    const dialogRef = this.dialog.open(UserPopupComponent, {
      maxHeight: 'auto',
      height: '65%',
      width: '80%',
      panelClass: 'remove-pad',
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      response.data.forEach((user: { userId: string }) => {
        if (this.departmentId) {
          const role = `MDO ADMIN`
          this.createMDOService.assignAdminToDepartment(user.userId, this.departmentId, role).subscribe(res => {
            if (res) {
              this.snackBar.open('Admin assigned Successfully')
              this.router.navigate(['/app/home/directory', { department: this.departmentRole }])
            }
          },
            // tslint:disable-next-line: align
            (err: { error: any }) => {
              this.openSnackbar(err.error.message)
            })
        }
      })

    })

  }
  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
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
    if (e.fromdata === 'draft') {
      this.router.navigate([`/app/workallocation/drafts`], { queryParams: { status: 'New' } })
    } else if (e.fromdata === 'published') {
      this.router.navigate([`/app/workallocation/published`])
    }

  }
  gotoCreateUser() {
    this.router.navigate([`/app/home/create-user`], { queryParams: { id: this.departmentId, currentDept: this.departmentRole } })
  }
}
