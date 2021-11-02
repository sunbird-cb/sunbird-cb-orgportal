import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material'
import { FormGroup } from '@angular/forms'
import { SelectionModel } from '@angular/cdk/collections'
import { Router } from '@angular/router'

// tslint:disable-next-line:interface-name
export interface PeriodicElement {
  fullname: string
  email: string
  mobile: number
  position: string
  id: number,
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   { name: 'Devprathap Nagendra', email: 'test@tt.com', mobile: 1234567890 },
//   { name: 'Nancy Jimenez', email: 'test@tt.com', mobile: 1234567890 },
//   { name: 'Manish Malhthra', email: 'test@tt.com', mobile: 1234567890 },
//   { name: 'Priya Sood', email: 'test@tt.com', mobile: 1234567890 },
//   { name: 'Charmi Singh', email: 'test@tt.com', mobile: 1234567890 },
// ]

@Component({
  selector: 'ws-app-adduserpopup',
  templateUrl: './adduserpopup.component.html',
  styleUrls: ['./adduserpopup.component.scss'],
})
export class AdduserpopupComponent implements OnInit {
  usersListData: PeriodicElement[] = []
  statedata: {
    param: any, path: any
  } | undefined
  form!: FormGroup
  displayedColumns: string[] = ['select', 'name', 'email', 'mobile']
  dataSource = new MatTableDataSource<PeriodicElement>(this.usersListData)
  selection = new SelectionModel<PeriodicElement>(true, [])

  constructor(private dialogRef: MatDialogRef<AdduserpopupComponent>, @Inject(MAT_DIALOG_DATA) data: any, private router: Router) {
    this.usersListData = data.data
    this.usersListData.forEach((user: any) => {
      const obj = {
        fullname: `${user.firstName} ${user.lastName}`,
        email: user.email,
        position: user.channel,
        id: user.id,
        mobile: user.phone,
      }
      this.dataSource.data.push(obj)
    })
  }

  ngOnInit() {
    this.statedata = { param: 'MDOinfo', path: 'Leadership' }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear()
      return
    }

    this.selection.select(...this.dataSource.data)
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`
  }

  addUser() {
    this.dialogRef.close({ data: this.selection.selected })
  }

  createnewuser() {
    this.router.navigate([`/app/users/create-user`, { queryParams: { page: 'MDOinfo' } }])
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

}
