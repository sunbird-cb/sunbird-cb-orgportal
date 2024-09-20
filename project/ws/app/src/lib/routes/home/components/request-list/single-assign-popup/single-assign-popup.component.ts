import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material'
import { MatPaginator } from '@angular/material/paginator'
import { ProfileV2Service } from '../../../services/home.servive'
import { ConfigResolveService } from '../../../resolvers/config-resolve.service'

@Component({
  selector: 'ws-app-single-assign-popup',
  templateUrl: './single-assign-popup.component.html',
  styleUrls: ['./single-assign-popup.component.scss'],
})
export class SingleAssignPopupComponent implements OnInit {

  requestForm!: FormGroup
  displayedColumns: string[] = ['select', 'name']
  providerList: any[] = []
  providerCount: any
  pageNumber = 0
  pageSize = 5
  fullProfile: any
  userId: any
  assignText = ''
  submitAssign = ''
  requestTypeData: any[] = []
  filterRequestData: any[] = []
  isDisable = false
  // @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>([])
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | null = null
  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator
    this.setDataSourceAttributes()
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator
  }

  constructor(private fb: FormBuilder,
              private homeService: ProfileV2Service,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private configService: ConfigResolveService,
              public dialogRef: MatDialogRef<SingleAssignPopupComponent>,
  ) {
    this.requestForm = this.fb.group({
      assignee: new FormControl('', Validators.required),
      orgSearch: new FormControl(''),

    })
  }

  ngOnInit() {
    this.assignText = 'Assign'
    this.submitAssign = 'Assign'
    this.getOrgListData()
    if (this.configService['confService'].userProfile || this.configService['confService'].userProfileV2) {
      this.fullProfile = this.configService['confService'].userProfile ?
        this.configService['confService'].userProfile
        : this.configService['confService'].userProfileV2
      this.userId = this.fullProfile.userId
    }
  }

  setFormData() {
    if (this.data.assignedProvider) {
      this.assignText = 'Re-assign'
      this.submitAssign = 'Re-Assign'
      const assignOrgData = this.requestTypeData.find(option =>
        this.data.assignedProvider === option.orgName
      )
      // if (assignOrgData) {
      //   this.requestForm.controls['assignee'].setValue(assignOrgData)
      // }
      // move selected data to first
      const position = this.requestTypeData.indexOf(assignOrgData)

      // check if the element exists in the array
      if (position > -1) {
        // Remove the element from its position
        const selectedData = this.requestTypeData.splice(position, 1)[0]

        // Add the removed element to the beginning of the array
        this.requestTypeData.unshift(selectedData)
      }
    }
  }

  getOrgListData() {
    const requestObj = {
      request: {
        filters: {
          isCbp: true,
        },
        limit: 1000,
      },
    }
    this.homeService.getRequestTypeList(requestObj).subscribe(data => {
      if (data) {
        this.requestTypeData = data
        this.filterRequestData = this.requestTypeData
        this.dataSource.data = this.requestTypeData

        this.dataSource.paginator = this.paginator
        this.setFormData()

      }
    })
  }

  //  searchText(event:any){
  //   this.requestForm.controls['orgSearch'].valueChanges.subscribe((newValue: any) => {
  //     this.filterRequestData = this.filterOrgValues(newValue, this.requestTypeData)
  //     this.dataSource.data = this.filterRequestData
  //     this.dataSource.paginator = this.paginator
  //     this.setFormData()
  //   })
  //  }

  //  filterOrgValues(searchValue: string, array: any) {
  //   return array.filter((value: any) =>
  //     value.orgName.toLowerCase().includes(searchValue.toLowerCase()))
  // }

  onChangePage(event: any) {
    this.pageNumber = event.pageIndex
    this.pageSize = event.pageSize
    this.getOrgListData()
  }

  onSubmitAssign() {
    const selectedProvider = this.requestForm.value.assignee
    let assigneeProvider: any
    if (this.requestForm.value.assignee) {
      assigneeProvider = {
        providerName: this.requestForm.value.assignee.orgName,
        providerId: this.requestForm.value.assignee.id,
      }
    }
    if (selectedProvider) {
      const request = {
        title: this.data.title,
        objective: this.data.objective,
        typeOfUser: this.data.typeOfUser,
        // learningMode: this.requestForm.value.learningMode.toLowerCase(),
        competencies: this.data.competencies,
        referenceLink: this.data.referenceLink,
        requestType: this.data.requestType,
        preferredProvider: this.data.preferredProvider,
        assignedProvider: assigneeProvider,
        status: this.data.status,
        source: this.data.owner,
        demand_id: this.data.demand_id,
        learningMode: this.data.learningMode,
        // assignedBy: this.userId,
      }
      this.homeService.createDemand(request).subscribe((res: any) => {
        if (res) {
          this.dialogRef.close({ data: 'confirmed' })
        }

      },                                               (error: any) => {
        this.dialogRef.close({ error })

      }
      )
    } else {
    }
  }

  cancel() {
    this.dialogRef.close()
    // Implement your cancel logic here
  }

}
