import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms'
import { AllocationService } from '../../services/allocation.service'
import { Router } from '@angular/router'
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { MatSnackBar, MatDialog } from '@angular/material'
import { DialogConfirmComponent } from 'src/app/component/dialog-confirm/dialog-confirm.component'
import { AllocationActionsComponent } from '../../components/allocation-actions/allocation-actions.component'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
import * as _ from 'lodash'
@Component({
  selector: 'ws-app-create-workallocation',
  templateUrl: './create-workallocation.component.html',
  styleUrls: ['./create-workallocation.component.scss'],
})
export class CreateWorkallocationComponent implements OnInit {
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
  nosimilarUsers = false
  similarRoles!: any[]
  nosimilarRoles = false
  similarPositions!: any[]
  nosimilarPositions = false
  similarActivities!: any[]
  nosimilarActivities = false
  selectedUser: any
  selectedRole: any
  selectedActivity: any
  selectedPosition: any
  ralist: any[] = []
  departmentName: any
  departmentID: any
  showRAerror = false
  width = '35vw'
  dialogRef: any
  selectedIndex: number | null  // for tabs

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
    options: {
      jsPDF: {
        orientation: 'landscape',
      },
      pdfCallbackFn: this.pdfCallbackFn, // to add header and footer
    },
  }
  activitieslist: any[] = []
  showPublishButton = false
  publishWorkAllocationData: any
  waId: any
  roleCompetencyList!: any[]
  showAddNewRole = false

  constructor(
    private exportAsService: ExportAsService, private snackBar: MatSnackBar,
    private fb: FormBuilder, private allocateSrvc: AllocationService,
    private router: Router, public dialog: MatDialog,
    private events: EventService,
    private configSvc: ConfigurationsService) {
    this.selectedIndex = 0
    this.newAllocationForm = this.fb.group({
      fname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      rolelist: this.fb.array([this.newRole()]),
    })
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
    ]

    this.getdeptUsers()
  }

  getdeptUsers() {
    // this.allocateSrvc.getAllUsers().subscribe(res => {
    this.departmentName = this.configSvc.unMappedUser.channel
    this.departmentID = this.configSvc.unMappedUser.rootOrgId
    // })
  }

  export() {
    // download the file using old school javascript method
    this.exportAsService.save(this.config, 'WorkAllocation').subscribe(() => {
      // save started
    })
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
    const control = this.newAllocationForm.get('rolelist') as FormArray
    this.formdata.rolelist.forEach((x: any) => {
      control.push(this.fb.group({
        name: x.name,
        childNodes: x.childNodes,
      }))
    })
  }

  newRole(): FormGroup {
    return this.fb.group({
      name: new FormControl(''),
      childNodes: new FormControl(''),
    })
  }

  get newroleControls() {
    const rl = this.newAllocationForm.get('rolelist')
    return (<any>rl)['controls']
  }

  // to get suggested similar users in right sidebar
  onSearchUser(event: any) {
    this.showAddNewRole = false
    const val = event.target.value
    if (val.length > 2) {
      this.displayLoader('true')
      this.nosimilarUsers = false
      this.similarUsers = []
      this.similarRoles = []
      this.similarActivities = []
      this.similarPositions = []

      this.allocateSrvc.onSearchUser(val).subscribe(res => {
        this.userslist = res.result.data
        this.similarUsers = this.userslist
        this.displayLoader('false')
        if (this.similarUsers && this.similarUsers.length === 0) {
          this.nosimilarUsers = true
          this.nosimilarRoles = false
          this.nosimilarPositions = false
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
      this.similarUsers = []
      this.similarRoles = []
      this.similarActivities = []
      this.similarPositions = []
      this.allocateSrvc.onSearchRole(val).subscribe(res => {
        this.similarRoles = res
        this.displayLoader('false')
        if (this.similarRoles && this.similarRoles.length === 0) {
          this.nosimilarUsers = false
          this.nosimilarRoles = true
          this.nosimilarPositions = false
          this.nosimilarActivities = false
        } else {
          this.setAllMsgFalse()
        }
      })
    }
  }

  // to get suggested position in right sidebar
  onSearchPosition(event: any) {
    this.showAddNewRole = false
    const val = event.target.value
    if (val.length > 2) {
      this.displayLoader('true')
      this.nosimilarPositions = false
      this.similarUsers = []
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
          this.nosimilarUsers = false
          this.nosimilarRoles = false
          this.nosimilarPositions = true
          this.nosimilarActivities = false
        } else {
          this.setAllMsgFalse()
        }
      })
    }
  }

  setAllMsgFalse() {
    this.nosimilarUsers = false
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

  // to add the selected user to form value
  selectUser(user: any) {
    this.selectedUser = user
    this.similarUsers = []
    // tslint:disable-next-line:prefer-template
    const fullname = user.userDetails.last_name ? user.userDetails.first_name + ' ' +
      user.userDetails.last_name : user.userDetails.first_name

    this.newAllocationForm.patchValue({
      fname: fullname,
      email: this.selectedUser.userDetails.email,
      // tslint:disable-next-line:max-line-length
      position: (this.newAllocationForm.value.position === '') ? (this.selectedUser.allocationDetails ? this.selectedUser.allocationDetails.userPosition : '') : this.newAllocationForm.value.position,
    })
    if (this.newAllocationForm.value.position !== undefined) {
      this.showAddNewRole = true
    }
    // if (this.selectedUser.allocationDetails && this.selectedUser.allocationDetails.activeList.length > 0) {
    //   this.ralist = this.selectedUser.allocationDetails.activeList
    // }
  }
  removeSelectedUSer() {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        title: 'Remove User',
        body: 'Removing the selected user will clear all the form values',
      },
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedUser = ''
        this.ralist = []
        this.activitieslist = []
        this.newAllocationForm.reset()
      }
    })
  }
  // to add the selected role to form value
  selectRole(role: any) {
    this.selectedRole = role
    // this.activitieslist = this.selectedRole.childNodes
    this.selectedRole.childNodes.forEach((node: any) => {
      if (node.name) {
        this.activitieslist.push(node)
      }
    })
    this.similarRoles = []
    this.selectedActivity = ''

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
    this.selectedUser.userDetails.position = this.selectedPosition.name
    if (this.newAllocationForm.value.fname !== '' && this.newAllocationForm.value.email !== '') {
      this.showAddNewRole = true
    }
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
        // const newrole = this.newAllocationForm.get('rolelist') as FormArray
        // newrole.at(0).patchValue(newroleformat)
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
      }
    }
  }

  // final form submit
  onSubmit() {
    this.ralist.forEach((r: any) => {
      r.isArchived = false
    })
    this.newAllocationForm.value.rolelist = this.ralist
    const reqdata = {
      userId: this.selectedUser ? this.selectedUser.userDetails.wid : '',
      deptId: this.departmentID,
      deptName: this.departmentName,
      activeList: this.ralist,
      userName: this.newAllocationForm.value.fname,
      userEmail: this.newAllocationForm.value.email,
      userPosition: this.newAllocationForm.value.position,
      positionId: this.selectedPosition ? this.selectedPosition.id : '',
      archivedList: [],
    }

    if (this.selectedUser && this.selectedUser.allocationDetails) {
      reqdata.activeList = this.selectedUser.allocationDetails.archivedList
    }
    this.allocateSrvc.createAllocation(reqdata).subscribe(res => {
      if (res) {
        this.openSnackbar('Work Allocated Successfully')
        this.newAllocationForm.reset()
        this.selectedUser = ''
        this.selectedRole = ''
        this.ralist = []
        this.router.navigate(['/app/home/workallocation'])
      }
    })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  // openDialog() {
  //   this.dialog.open(AllocationActionsComponent, {
  //     width: '500px',
  //     minHeight: '350px',
  //     data: {},
  //   })
  // }

  openDialog() {
    const userObj = {
      userData: this.selectedUser,
      department_name: this.departmentName,
      department_id: this.departmentID,
    }
    this.dialogRef = this.dialog.open(AllocationActionsComponent, {
      width: '1000px',
      height: '80%',
      panelClass: 'wa-dialog',
      data: userObj,
    })
    this.dialogRef.afterClosed().subscribe((result: any) => {

      if (result.data !== undefined) {
        this.showPublishButton = true
        this.publishWorkAllocationData = result.data
        if (this.publishWorkAllocationData !== undefined) {
          this.roleCompetencyList = this.publishWorkAllocationData.roleCompetencyList
        }
        this.getWorkAllocationDetails(result.data.userId)
      }
    })
  }

  getWorkAllocationDetails(reqUserId: any) {
    const reqUserObj = {
      pageNo: 0,
      pageSize: 100,
      departmentName: this.departmentName,
      status: 'Draft',
      userId: reqUserId,

    }
    this.allocateSrvc.getAllocationDetails(reqUserObj).subscribe((res: any) => {
      if (res) {
        this.waId = res.result.data[0].allocationDetails.draftWAObject.id
      }
    })
  }

  publishWorkOrder() {
    this.publishWorkAllocationData.waId = this.waId
    this.publishWorkAllocationData.status = 'Published'
    this.allocateSrvc.updateAllocation(this.publishWorkAllocationData).subscribe((res: any) => {
      if (res) {
        this.openSnackbar('Work Allocated Successfully')
        this.router.navigate(['/app/home/workallocation'])
      }
    })
  }

}
