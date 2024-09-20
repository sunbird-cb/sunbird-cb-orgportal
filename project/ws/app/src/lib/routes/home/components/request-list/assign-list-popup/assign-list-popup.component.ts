import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ProfileV2Service } from '../../../services/home.servive'
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material'
import { ConfigResolveService } from '../../../resolvers/config-resolve.service'

@Component({
  selector: 'ws-app-assign-list-popup',
  templateUrl: './assign-list-popup.component.html',
  styleUrls: ['./assign-list-popup.component.scss'],
})
export class AssignListPopupComponent implements OnInit {
  requestForm!: FormGroup
  displayedColumns: string[] = ['select', 'providerName', 'details', 'eta']
  providerList: any[] = []
  dataSource: any
  providerCount: any
  pageNumber = 0
  pageSize = 5
  fullProfile: any
  userId: any
  assignText = ''
  submitAssign = ''

  constructor(private fb: FormBuilder,
              private homeService: ProfileV2Service,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private configService: ConfigResolveService,
              public dialogRef: MatDialogRef<AssignListPopupComponent>,
  ) {
    this.requestForm = this.fb.group({
      assignee: new FormControl('', Validators.required),
    })
  }

  ngOnInit() {
    this.assignText = 'Assign'
    this.submitAssign = 'Assign'
    this.getInterestOrgList()
    if (this.configService['confService'].userProfile || this.configService['confService'].userProfileV2) {
      this.fullProfile = this.configService['confService'].userProfile ?
      this.configService['confService'].userProfile
       : this.configService['confService'].userProfileV2
      this.userId =  this.fullProfile.userId
    }
  }

  setFormData() {
    if (this.data.assignedProvider) {
      this.assignText = 'Re-assign'
      this.submitAssign = 'Re-Assign'
      const assignOrgData = this.providerList.find(option =>
        this.data.assignedProvider === option.orgName
      )
      // if (assignOrgData) {
      //   this.requestForm.controls['assignee'].setValue(assignOrgData)
      // }

      // move selected data to first
      const position = this.providerList.indexOf(assignOrgData)
       // check if the element exists in the array
       if (position > -1) {
        // Remove the element from its position
        const selectedData = this.providerList.splice(position, 1)[0]

        // Add the removed element to the beginning of the array
        this.providerList.unshift(selectedData)
      }

    }
   }

  getInterestOrgList() {
    const request = {
      filterCriteriaMap: {
        demandId: this.data.demand_id,

      },
      requestedFields: [
      ],
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    }
    this.homeService.getOrgInterestList(request).subscribe(res => {
     if (res.data) {
      this.providerList = res.data
      this.providerCount = res.totalCount
      this.dataSource = new MatTableDataSource<any>(this.providerList)
      this.setFormData()
     }
    }
  )
  }

  getAssigneeList() {

  }

  onChangePage(event: any) {
    this.pageNumber = event.pageIndex
    this.pageSize = event.pageSize
    this.getInterestOrgList()
    }

    onSubmitAssign() {
    const selectedProvider = this.requestForm.value.assignee
    if (selectedProvider) {
      const request = {
        interestId: selectedProvider.interestId ,
        demandId: selectedProvider.demandId,
        ownerId: selectedProvider.ownerId ,
        orgId: selectedProvider.orgId,
        description: selectedProvider.description ,
        turnAroundTime: selectedProvider.turnAroundTime ,
        orgName: selectedProvider.orgName,
        status: selectedProvider.status,
        createdOn: selectedProvider.createdOn ,
        updatedOn: selectedProvider.updatedOn,
        // assignedBy: this.userId,
      }
      this.homeService.assignToOrg(request).subscribe(res => {
        if (res) {
          this.dialogRef.close({ data: 'confirmed' })
        }

      },                                              error => {
       this.dialogRef.close({ error })

      }
    )
      // Implement your assign logic here
    } else {
    }
  }

  cancel() {
    this.dialogRef.close()
    // Implement your cancel logic here
  }

}
