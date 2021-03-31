import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms'
import { AllocationService } from '../../services/allocation.service'
import { ActivatedRoute, Router } from '@angular/router'
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'ws-app-update-workallocation',
  templateUrl: './update-workallocation.component.html',
  styleUrls: ['./update-workallocation.component.scss'],
})
export class UpdateWorkallocationComponent implements OnInit {
  @ViewChild('childNodes', { static: false })
  inputvar!: ElementRef
  tabsData!: any[]
  userslist!: any[]
  currentTab = 'officer'
  sticky = false
  newAllocationForm: FormGroup
  formdata = {
    fname: '',
    email: '',
    position: '',
    rolelist: [
      {
        name: '',
        childNodes: '',
      },
    ],
  }
  similarUsers!: any []
  similarRoles!: any []
  similarPositions!: any []
  similarActivities!: any []
  selectedUser: any
  orgselectedUser: any
  selectedRole: any
  selectedActivity: any
  selectedPosition: any
  ralist: any [] = []
  archivedlist: any [] = []
  data: any = []
  showRAerror = false
  today: number = Date.now()

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'downloadtemp',
    options: {
      jsPDF: {
        orientation: 'landscape',
      },
      // pdfCallbackFn: this.pdfCallbackFn, // to add header and footer
    },
  }
  activitieslist: any[] = []
  allocateduserID: any
  departmentName: any
  departmentID: any
  currentTime = new Date()

  constructor(private exportAsService: ExportAsService, private snackBar: MatSnackBar, private router: Router,
              private fb: FormBuilder, private allocateSrvc: AllocationService, private activeRoute: ActivatedRoute) {
            this.allocateduserID = this.activeRoute.snapshot.params.userId

            this.newAllocationForm = this.fb.group({
              fname: ['', Validators.required],
              email: ['', [Validators.required, Validators.email]],
              position: ['', Validators.required],
              rolelist: this.fb.array([]),
            })
            // this.setRole()
            this.getdeptUsers()
  }

  ngOnInit() {
    this.tabsData = [
      {
        name: 'Officer',
        key: 'officer',
        render: true,
        enabled: true,
      },
      {
        name: 'Roles and activities',
        key: 'roles',
        render: true,
        enabled: true,
      },
      {
        name: 'Archived',
        key: 'archived',
        render: true,
        enabled: true,
      },
    ]

  }
  getdeptUsers() {
    this.allocateSrvc.getAllUsers().subscribe(res => {
      this.departmentName = res.deptName
      this.departmentID = res.id

      this.getAllUsers()
    })
  }

  getAllUsers() {
    const req = {
      pageNo : 0,
      pageSize : 20,
      departmentName : this.departmentName,
    }
    this.allocateSrvc.getUsers(req).subscribe(res => {
      const userslist = res.result.data
      userslist.forEach((user: any) => {
        if (user.userDetails) {
          if (this.allocateduserID === user.userDetails.wid) {
            this.orgselectedUser = user
            this.selectedUser = user

            if (this.selectedUser) {
              this.newAllocationForm.patchValue({
                fname: this.selectedUser.userDetails.first_name,
                email: this.selectedUser.userDetails.email,
                position: this.selectedUser.allocationDetails ? this.selectedUser.allocationDetails.userPosition : '',
              })

              const downloaddata = {
                fullname: user.userDetails ? `${user.userDetails.first_name} ${user.userDetails.last_name}` : null,
                email: user.userDetails ? user.userDetails.email : '',
                roles: user.allocationDetails.activeList,
                userId: user.userDetails ? user.userDetails.wid : '',
              }
              this.data.push(downloaddata)
              console.log('data', this.data)

              this.setRole()
              // const newrole = this.newAllocationForm.get('rolelist') as FormArray
              // newrole.at(0).patchValue(this.selectedUser.allocationDetails.activeList)

              this.ralist = this.selectedUser.allocationDetails.activeList
              this.archivedlist = this.selectedUser.allocationDetails.archivedList

              this.newAllocationForm.controls['fname'].disable()
              this.newAllocationForm.controls['email'].disable()
            }
          }
        }
      })
    })
  }

  export() {
    // download the file using old school javascript method
    if (this.data) {
      this.exportAsService.save(this.config, 'WorkAllocation').subscribe(() => {
        // save started
      })
    }
     // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    // this.exportAsService.get(this.config).subscribe(content => {
    //   console.log(content)
    // })
  }

  pdfCallbackFn (pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages()
    // tslint:disable-next-line:no-increment-decrement
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i)
      // tslint:disable-next-line:prefer-template
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30)
    }
  }

  onSideNavTabClick(id: string) {
    this.currentTab = id
    const el = document.getElementById(id)
    if (el != null) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    }
  }

  // to set roles array field
  setRole() {
    const control = <FormArray>this.newAllocationForm.controls.rolelist
    this.formdata.rolelist.forEach((x: any) => {
      control.push(this.fb.group({
        name: x.name,
        childNodes: x.childNodes,
      }))
    })
  }

  // to set new roles array field
  newRole(): FormGroup {
    return this.fb.group({
      name: new FormControl('', []),
      childNodes: new FormControl('', []),
    })
  }

  get newroleControls() {
    const rl = this.newAllocationForm.get('rolelist')
    return (<any>rl)['controls']
  }

   // to get suggested position in right sidebar
   onSearchPosition(event: any) {
    const val = event.target.value
    if (val.length > 2) {
      const req = {
        searches: [
            {
                type: 'POSITION',
                field: 'name',
                keyword: val,
            },
        ],
    }
      this.allocateSrvc.onSearchPosition(req).subscribe(res => {
        this.similarPositions = res.responseData
      })
    }
  }

  // to get suggested similar roles in right sidebar
  onSearchRole(event: any) {
    const val = event.target.value
    if (val.length > 2) {
      this.similarRoles = []
      this.allocateSrvc.onSearchRole(val).subscribe(res => {
        this.similarRoles = res
      })
    }
  }

  onSearchActivity (event: any) {
    const val = event.target.value
    if (val.length > 2) {
      this.similarActivities = []
      const req = {
        searches: [
          {
            type: 'ACTIVITY',
            field: 'name',
            keyword: val,
          },
          {
            type: 'ACTIVITY',
            field: 'status',
            keyword: 'VERIFIED',
          },
        ],
      }
      this.allocateSrvc.onSearchActivity(req).subscribe(res => {
        this.similarActivities = res.responseData
      })
    }
  }

  // to add the selected role to form value
  selectRole(role: any) {
    this.selectedRole = role
    this.activitieslist = this.selectedRole.childNodes
    this.similarRoles = []

    const formatselectedRole = role
    const actnodes: any[] = []
    formatselectedRole.childNodes.forEach((x: any) => {
      actnodes.push(x.name)
    })
    formatselectedRole.childNodes = actnodes
    const newrole = this.newAllocationForm.get('rolelist') as FormArray
    // newrole.push(this.newRole())
    newrole.at(0).patchValue(formatselectedRole)
  }

  selectActivity(activity: any) {
    this.selectedActivity = activity
    this.similarActivities = []
    this.inputvar.nativeElement.value = ''
    this.activitieslist.push(activity)
    this.selectedActivity = ''
  }

  selectPosition (pos: any) {
    this.selectedPosition = pos
    this.similarPositions = []
    this.newAllocationForm.patchValue({
      position: this.selectedPosition.name,
    })
  }

  // to push new obj to rolelist
  addRolesActivity(index: number) {
    if (index === 0 && this.selectedRole) {
      if (this.activitieslist.length > 0) {
        this.showRAerror =  false
        this.selectedRole.childNodes = this.activitieslist
        this.ralist.push(this.selectedRole)
        this.selectedRole = ''
        this.activitieslist = []

        const control = this.newAllocationForm.get('rolelist') as FormArray
        // tslint:disable-next-line:no-increment-decrement
        for (let i = control.length - 1; i >= 0; i--) {
            control.removeAt(i)
        }

        const newrolefield = this.newAllocationForm.get('rolelist') as FormArray
        newrolefield.push(this.newRole())

        this.newAllocationForm.value.rolelist = this.ralist
      } else {
        this.showRAerror =  true
      }
    } else {
      if (this.newAllocationForm.value.rolelist[0].name && this.activitieslist.length > 0) {
        this.showRAerror = false
        const newroleformat = {
          description: '',
          id: '',
          name: this.newAllocationForm.value.rolelist[0].name,
          source: 'ISTM',
          status: 'UNVERIFIED',
          type: 'ROLE',
          childNodes: this.activitieslist,
        }
        this.ralist.push(newroleformat)
        this.activitieslist = []

        const control = this.newAllocationForm.get('rolelist') as FormArray
        // tslint:disable-next-line:no-increment-decrement
        for (let i = control.length - 1; i >= 0; i--) {
            control.removeAt(i)
        }
        const newrolefield = this.newAllocationForm.get('rolelist') as FormArray
        newrolefield.push(this.newRole())
        this.newAllocationForm.value.rolelist = this.ralist
      } else  {
        this.showRAerror =  true
      }
    }
  }

  addActivity() {
    if (!this.selectedActivity) {
      const newactivity = this.newAllocationForm.value.rolelist[0].childNodes
      const activityformat = {
        description: '',
        id: '',
        name: newactivity,
        parentRole: '',
        source: 'ISTM',
        status: 'UNVERIFIED',
        type: 'ACTIVITY',
      }
      this.activitieslist.push(activityformat)
      this.inputvar.nativeElement.value = ''
      this.newAllocationForm.value.rolelist[0].childNodes = ''
    }
  }

  buttonClick(action: string, row: any) {
    if (this.ralist) {
      if (action === 'Delete') {
        const index = this.ralist.indexOf(row)
        if (index >= 0) {
          this.ralist.splice(index, 1)
        }
      } else if (action === 'Archive') {
        const index = this.ralist.indexOf(row)
        if (index >= 0) {
          this.ralist.splice(index, 1)
        }
        row.isArchived = true
        this.archivedlist.push(row)
      }
    }
  }

  // final form submit
  onSubmit() {
    // if (this.orgselectedUser !== this.selectedUser) {
      const reqdata = {
        userId: this.selectedUser.userDetails.wid,
        deptId: this.departmentID,
        deptName: this.departmentName,
        activeList: this.ralist,
        archivedList: this.archivedlist,
        userPosition: this.selectedPosition ? this.selectedPosition.name : this.selectedUser.allocationDetails.userPosition,
      }

      this.allocateSrvc.updateAllocation(reqdata).subscribe(res => {
        if (res) {
          this.openSnackbar('Work Allocation updated Successfully')
          this.newAllocationForm.reset()
          this.selectedUser = ''
          this.selectedRole = ''
          this.ralist = []
          this.archivedlist = []
          this.router.navigate(['/app/home/workallocation'])
          // this.getAllUsers()
        }
      })
    // } else {
    //   this.openSnackbar('No changes to update')
    // }
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
