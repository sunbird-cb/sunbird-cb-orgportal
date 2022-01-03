import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms'
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { ActivatedRoute, Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'
import { AllocationService } from '../../services/allocation.service'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
import * as _ from 'lodash'
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
  similarUsers!: any[]
  similarRoles!: any[]
  nosimilarRoles = false
  similarPositions!: any[]
  nosimilarPositions = false
  similarActivities!: any[]
  nosimilarActivities = false
  selectedUser: any
  orgselectedUser: any
  selectedRole: any
  selectedActivity: any
  selectedPosition: any
  ralist: any[] = []
  archivedlist: any[] = []
  data: any = []
  showRAerror = false
  today: number = Date.now()
  displaytemplate = false

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'downloadtemp',
    // options: {
    //   jsPDF: {
    //     orientation: 'landscape',
    //   },
    //   pdfCallbackFn: this.pdfCallbackFn, // to add header and footer
    // },
  }
  activitieslist: any[] = []
  allocateduserID: any
  departmentName: any
  departmentID: any
  currentTime = new Date()

  constructor(
    private exportAsService: ExportAsService, private snackBar: MatSnackBar, private router: Router,
    private fb: FormBuilder, private allocateSrvc: AllocationService,
    private activeRoute: ActivatedRoute, private configSvc: ConfigurationsService,
    private events: EventService) {
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
    // this.allocateSrvc.getAllUsers().subscribe(res => {
    this.departmentName = this.configSvc.unMappedUser.channel
    this.departmentID = this.configSvc.unMappedUser.rootOrgId

    this.getAllUsers()
    // })
  }

  getAllUsers() {
    const req = {
      pageNo: 0,
      pageSize: 1000,
      departmentName: this.departmentName,
    }
    this.allocateSrvc.getUsers(req).subscribe(res => {
      const userslist = res.result.data
      userslist.forEach((user: any) => {
        // if (user.userDetails) {
        if (this.allocateduserID === (user.allocationDetails.id || user.allocationDetails.userId)) {
          this.orgselectedUser = user
          this.selectedUser = user

          if (this.selectedUser) {
            this.newAllocationForm.patchValue({
              fname: this.selectedUser.allocationDetails.userName,
              email: this.selectedUser.allocationDetails.userEmail,
              position: this.selectedUser.allocationDetails ? this.selectedUser.allocationDetails.userPosition : '',
            })

            const downloaddata = {
              fullname: user.allocationDetails.userName,
              email: user.allocationDetails.userEmail,
              roles: user.allocationDetails.activeList,
              userId: user.userDetails ? user.userDetails.wid : user.allocationDetails.userId,
            }
            this.data.push(downloaddata)

            this.setRole()
            // const newrole = this.newAllocationForm.get('rolelist') as FormArray
            // newrole.at(0).patchValue(this.selectedUser.allocationDetails.activeList)

            this.ralist = this.selectedUser.allocationDetails.activeList
            this.archivedlist = this.selectedUser.allocationDetails.archivedList

            // this.newAllocationForm.controls['fname'].disable()
            // this.newAllocationForm.controls['email'].disable()
          }
        }
        // }
      })
    })
  }

  export() {
    // download the file using old school javascript method
    // if (this.data) {
    this.exportAsService.save(this.config, 'WorkAllocation').subscribe(() => {
      // save started
      this.displaytemplate = true
    })
    this.displaytemplate = false
    // }
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    // this.exportAsService.get(this.config).subscribe(content => {
    //   console.log(content)
    // })
  }

  pdfCallbackFn(pdf: any) {
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
    let menuName = ''
    this.tabsData.forEach(e => {
      if (e.key === id) {
        menuName = e.name
      }
    })
    this.currentTab = id
    const el = document.getElementById(id)
    if (el != null) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    }
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.SIDE_NAV,
        id: `${_.camelCase(menuName)}-scrolly-menu `,
      },
      {}
    )
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
      this.displayLoader('true')
      this.nosimilarPositions = false
      this.similarRoles = []
      this.similarActivities = []
      this.similarPositions = []
      const req = {
        searches: [
          {
            type: 'POSITION',
            field: 'name',
            keyword: val,
          },
          {
            type: 'POSITION',
            field: 'status',
            keyword: 'VERIFIED',
          },
        ],
      }
      this.allocateSrvc.onSearchPosition(req).subscribe(res => {
        this.similarPositions = res.responseData
        this.displayLoader('false')
        if (this.similarPositions && this.similarPositions.length === 0) {
          this.nosimilarRoles = false
          this.nosimilarPositions = true
          this.nosimilarActivities = false
        } else {
          this.setAllMsgFalse()
        }
      })
    }
  }

  // to get suggested similar roles in right sidebar
  onSearchRole(event: any) {
    const val = event.target.value
    if (val.length > 2) {
      this.displayLoader('true')
      this.nosimilarRoles = false
      this.similarRoles = []
      this.similarActivities = []
      this.similarPositions = []
      this.allocateSrvc.onSearchRole(val).subscribe(res => {
        this.similarRoles = res
        this.displayLoader('false')
        if (this.similarRoles && this.similarRoles.length === 0) {
          this.nosimilarRoles = true
          this.nosimilarPositions = false
          this.nosimilarActivities = false
        } else {
          this.setAllMsgFalse()
        }
      })
    }
  }

  onSearchActivity(event: any) {
    const val = event.target.value
    if (val.length > 2) {
      this.displayLoader('true')
      this.nosimilarActivities = false
      this.similarRoles = []
      this.similarActivities = []
      this.similarPositions = []
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
        this.displayLoader('false')
        if (this.similarActivities && this.similarActivities.length === 0) {
          this.nosimilarRoles = false
          this.nosimilarPositions = false
          this.nosimilarActivities = true
        } else {
          this.setAllMsgFalse()
        }
      })
    }
  }

  setAllMsgFalse() {
    this.nosimilarRoles = false
    this.nosimilarPositions = false
    this.nosimilarActivities = false
  }

  displayLoader(value: any) {
    // tslint:disable-next-line:no-non-null-assertion
    const vart = document.getElementById('loader')!
    if (value === 'true') {
      vart.style.display = 'block'
    } else {
      vart.style.display = 'none'
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
    this.inputvar.nativeElement.value = ''
    this.newAllocationForm.value.rolelist[0].childNodes = ''
  }

  selectActivity(activity: any) {
    this.selectedActivity = activity
    this.similarActivities = []
    this.inputvar.nativeElement.value = ''
    this.activitieslist.push(activity)
    this.selectedActivity = ''
  }

  selectPosition(pos: any) {
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
        this.showRAerror = false
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
        this.showRAerror = true
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
      } else {
        this.showRAerror = true
      }
    }
  }

  addActivity() {
    if (!this.selectedActivity) {
      const newactivity = this.newAllocationForm.value.rolelist[0].childNodes
      if (newactivity) {
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
      }
      this.inputvar.nativeElement.value = ''
      this.newAllocationForm.value.rolelist[0].childNodes = ''
    }
  }

  showRemoveActivity(index: any) {
    const id = `showremove${index}`
    // tslint:disable-next-line:no-non-null-assertion
    const vart = document.getElementById(id)!
    vart.style.display = 'block'
  }

  removeActivity(index: any) {
    if (index >= 0) {
      this.activitieslist.splice(index, 1)
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
        row.archivedAt = new Date().getTime()
        this.archivedlist.push(row)
      }
    }
  }

  // final form submit
  onSubmit() {
    // if (this.orgselectedUser !== this.selectedUser) {
    const reqdata = {
      id: (this.selectedUser.allocationDetails && this.selectedUser.allocationDetails.id !== null) ?
        this.selectedUser.allocationDetails.id : '',
      userId: (this.selectedUser.allocationDetails && this.selectedUser.allocationDetails.userId !== null) ?
        this.selectedUser.allocationDetails.userId : '',
      deptId: this.departmentID,
      deptName: this.departmentName,
      activeList: this.ralist,
      archivedList: this.archivedlist,
      // userPosition: this.selectedPosition ? this.selectedPosition.name : this.selectedUser.allocationDetails.userPosition,
      userName: this.newAllocationForm.value.fname,
      userEmail: this.newAllocationForm.value.email,
      userPosition: this.newAllocationForm.value.position,
      positionId: this.selectedPosition ? this.selectedPosition.id : this.selectedUser.allocationDetails.positionId,
    }
    if (!this.selectedPosition && this.selectedUser.allocationDetails.positionId) {
      if (this.selectedUser.allocationDetails.userPosition !== this.newAllocationForm.value.position) {
        reqdata.positionId = ''
      }
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
