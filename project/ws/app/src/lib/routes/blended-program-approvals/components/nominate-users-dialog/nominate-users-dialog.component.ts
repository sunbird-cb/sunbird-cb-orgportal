import { SelectionModel } from '@angular/cdk/collections'
import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatTableDataSource } from '@angular/material'
import { UsersService } from '../../../users/services/users.service'
import { MatSort } from '@angular/material/sort'
import { BlendedApporvalService } from '../../services/blended-approval.service'

@Component({
  selector: 'ws-app-nominate-users-dialog',
  templateUrl: './nominate-users-dialog.component.html',
  styleUrls: ['./nominate-users-dialog.component.scss'],

})
export class NominateUsersDialogComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'email']
  searchText = ''
  selection = new SelectionModel(true, [])
  filteredUsers: any = []
  dataSource = new MatTableDataSource<any>()
  displayLoader = false
  learners: any = []

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
    @Inject(MAT_DIALOG_DATA) public data: any, private bpService: BlendedApporvalService,
    private snackBar: MatSnackBar) { }

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
    this.displayLoader = true
    this.filteredUsers = []
    this.dataSource = new MatTableDataSource()
    this.learners = this.data.learners.map((u: any) => {
      return u.user_id
    })
    this.usersService.getAllUsers(filterObj).subscribe(data => {
      data.content.map((details: any) => {
        const dept = (details.profileDetails && details.profileDetails.employmentDetails)
          ? details.profileDetails.employmentDetails.departmentName : details.rootOrgName
        if (!this.learners.includes(details.id)) {
          this.filteredUsers.push({
            name: details.firstName,
            email: details.maskedEmail,
            userId: details.id,
            rootOrgId: this.data.orgId,
            actorUserId: details.id,
            state: 'APPROVED',
            serviceName: 'blendedprogram',
            deptName: dept,
            courseId: this.data.courseId, // blended program course ID
            applicationId: this.data.applicationId, // blended program batch ID
            updateFieldValues: [
              { toValue: { name: details.firstName } },
            ],
          })
        }

      })
      this.dataSource = new MatTableDataSource(this.filteredUsers)
      this.displayLoader = false
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
    const seletedLearner: any = []
    if (this.selection.selected.length > 0) {
      this.selection.selected.map((user: any) => {
        const obj = {
          userId: user.userId,
          rootOrgId: this.data.orgId,
          actorUserId: user.userId,
          state: 'INITIATE',
          serviceName: 'blendedprogram',
          deptName: user.deptName,
          courseId: this.data.courseId, // blended program course ID
          applicationId: this.data.applicationId, // blended program batch ID
          updateFieldValues: user.updateFieldValues,
        }
        seletedLearner.push(obj)
      })
      this.bpService.nominateLearners(seletedLearner).subscribe((_res: any) => {
        if (this.data.wfApprovalType === 'twoStepMDOAndPCApproval') {
          this.openSnackbar('Request sent to Program coordinator for approval.')
        } else {
          if (_res[0] && _res[0].result && _res[0].result.status === 'BAD_REQUEST') {
            this.openSnackbar(_res[0].result.errmsg)
          } else {
            this.openSnackbar('Users are nominated successfully!')
          }
        }
        this.dialogRef.close('done')
      }, (err: { error: any }) => {
        // tslint:disable-next-line:no-console
        console.log(err)
        this.openSnackbar('some thing went wrong, Please try after sometime.')
      })
    }

  }

  closeDiaogBox() {
    this.dialogRef.close('close')
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
