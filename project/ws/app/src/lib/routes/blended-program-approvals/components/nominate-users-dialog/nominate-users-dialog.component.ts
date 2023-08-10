import { SelectionModel } from '@angular/cdk/collections'
import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material'
import { UsersService } from '../../../users/services/users.service'
import { MatSort } from '@angular/material/sort'

@Component({
  selector: 'ws-app-nominate-users-dialog',
  templateUrl: './nominate-users-dialog.component.html',
  styleUrls: ['./nominate-users-dialog.component.scss'],

})
export class NominateUsersDialogComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'email']
  searchText: string = ''
  selection = new SelectionModel(true, [])
  filteredUsers: any = []
  dataSource = new MatTableDataSource<any>()

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }

  tableColumns = [
    { name: 'name', dispalyName: 'Full name' },
    { name: 'email', dispalyName: 'Email' },
  ]

  constructor(public dialogRef: MatDialogRef<NominateUsersDialogComponent>,
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const filterObj = {
      request: {
        query: '',
        filters: {
          rootOrgId: this.data.orgId,
        },
      },
    }
    this.getAllUsers(filterObj)
  }

  getAllUsers(filterObj: any) {
    this.filteredUsers = []
    this.dataSource = new MatTableDataSource()
    this.usersService.getAllUsers(filterObj).subscribe(data => {
      data.content.map((details: any) => {
        this.filteredUsers.push({
          name: details.firstName,
          email: details.maskedEmail,
          userId: details.id,
        })
      })
      this.dataSource = new MatTableDataSource(this.filteredUsers)
    })
  }

  searchUsers(filterValue: any) {
    const filterObj = {
      request: {
        query: filterValue.value ? filterValue.value.trim().toLowerCase() : '',
        filters: {
          rootOrgId: this.data.orgId,
        },
      },
    }
    this.getAllUsers(filterObj)
  }

  addLearners() {
    console.log('learners', this.selection.selected)
  }

  closeDiaogBox() {
    this.dialogRef.close('close')
  }
}
