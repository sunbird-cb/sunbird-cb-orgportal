import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router'
import moment from 'moment'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { UsersService } from '../../services/users.service'
import { MatSnackBar } from '@angular/material'
// tslint:disable-next-line
import _ from 'lodash'
import { EventService } from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'

@Component({
  selector: 'ws-app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnInit, AfterViewInit {
  tabsData!: any[]
  currentTab = 'personalInfo'
  sticky = false
  elementPosition: any
  basicInfo: any
  fullname = ''
  academicDetails: any
  professionalDetails: any
  employmentDetails: any
  skillDetails: any
  interests: any
  profileData: any[] = []
  profileDataKeys: any[] = []
  wfHistory: any[] = []
  updateUserRoleForm: FormGroup
  department: any = {}
  departmentName = ''
  rolesList: any = []
  configSvc: any
  userID: any
  public userRoles: Set<string> = new Set()
  orguserRoles: any = []
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  userStatus: any
  routeSubscription: Subscription | null = null
  qpParam: any
  qpPath: any
  breadcrumbs: any

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }

  constructor(private activeRoute: ActivatedRoute, private router: Router, private events: EventService,
    // tslint:disable-next-line:align
    private usersSvc: UsersService,
    // tslint:disable-next-line:align
    private snackBar: MatSnackBar) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.configSvc = this.activeRoute.snapshot.data.configService || {}
        const profileDataAll = this.activeRoute.snapshot.data.profileData.data || {}
        const profileData = profileDataAll.profileDetails
        if (profileData) {
          this.userID = profileData.id || profileData.userId || profileDataAll.id
          this.basicInfo = profileData.personalDetails
          if (this.basicInfo) {
            this.fullname = `${this.basicInfo.firstname} ${this.basicInfo.surname}`
          }
          this.academicDetails = profileData.academics
          this.professionalDetails = profileData.professionalDetails ? profileData.professionalDetails[0] : []
          this.employmentDetails = profileData.employmentDetails
          this.skillDetails = profileData.skills
          this.interests = profileData.interests
          this.userStatus = profileDataAll.isDeleted ? 'Inactive' : 'Active'

        }
        const fullProfile = _.get(this.activeRoute.snapshot, 'data.configService')
        this.department = fullProfile.unMappedUser.rootOrgId
        this.departmentName = fullProfile ? fullProfile.unMappedUser.channel : ''
        const orgLst = _.get(this.activeRoute.snapshot, 'data.rolesList.data.orgTypeList')
        const filteredDept = _.compact(_.map(orgLst, ls => {
          const f = _.filter(ls.flags, (fl: any) => fullProfile.unMappedUser.rootOrg[fl])
          if (f && f.length > 0) {
            return ls
          }
          return null
        }))
        /* tslint:disable-next-line */
        const rolesListFull = _.uniq(_.map(_.compact(_.flatten(_.map(filteredDept, 'roles'))), rol => ({ roleName: rol, description: rol })))

        rolesListFull.forEach((role: any) => {
          if (!this.rolesList.some((item: any) => item.roleName === role.roleName)) {
            this.rolesList.push(role)
          }
        })

        const usrRoles = profileDataAll.roles
        usrRoles.forEach((role: any) => {
          this.orguserRoles.push(role)
          this.modifyUserRoles(role)
        })
        // if (this.department.active_users && this.department.active_users.length > 0) {
        //   this.department.active_users.forEach((user: any) => {
        //     if (this.userID === user.userId) {
        //       this.userStatus = 'Active'
        //       const usrRoles = user.roleInfo
        //       usrRoles.forEach((role: any) => {
        //         this.orguserRoles.push(role.roleName)
        //         this.modifyUserRoles(role.roleName)
        //       })
        //     }
        //   })
        // }
        // if (this.department.blocked_users && this.department.blocked_users.length > 0) {
        //   this.department.blocked_users.forEach((user: any) => {
        //     if (this.userID === user.userId) {
        //       this.userStatus = 'Blocked'
        //     }
        //   })
        // }
        // if (this.department.inActive_users && this.department.inActive_users.length > 0) {
        //   this.department.inActive_users.forEach((user: any) => {
        //     if (this.userID === user.userId) {
        //       this.userStatus = 'Inactive'
        //     }
        //   })
        // }

        let wfHistoryDatas = this.activeRoute.snapshot.data.workflowHistoryData.data.result.data || {}
        const datas: any[] = Object.values(wfHistoryDatas)
        wfHistoryDatas = [].concat.apply([], datas)
        const wfHistoryData = wfHistoryDatas.filter((wfh: { inWorkflow: any }) => !wfh.inWorkflow)
        let currentdate: Date

        this.activeRoute.data.subscribe(data => {
          this.profileData = data.pageData.data.profileData ? data.pageData.data.profileData : []
          this.profileDataKeys = data.pageData.data.profileDataKey ? data.pageData.data.profileDataKey : []
        })

        this.routeSubscription = this.activeRoute.queryParamMap.subscribe(qParamsMap => {
          this.qpParam = qParamsMap.get('param')
          this.qpPath = qParamsMap.get('path')
          if (this.qpParam === 'MDOinfo') {
            // tslint:disable-next-line:max-line-length
            this.breadcrumbs = { titles: [{ title: 'Users', url: '/app/home/users' }, { title: this.userStatus, url: 'none' }, { title: 'MDO information', url: '/app/home/mdoinfo/leadership' }, { title: this.fullname, url: 'none' }] }
          } else {
            // tslint:disable-next-line:max-line-length
            this.breadcrumbs = [{ title: 'Users', url: '/app/home/users/active' }, { title: this.userStatus, url: `/app/home/users/${this.userStatus.toLowerCase()}` }, { title: this.fullname, url: 'none' }]
          }
        })

        wfHistoryData.forEach((wfh: any) => {
          currentdate = new Date(wfh.createdOn)
          if (typeof wfh.updateFieldValues === 'string') {
            const fields = JSON.parse(wfh.updateFieldValues)
            let pendingwfh: any
            let feildNameObj: any
            let feildKeyObj: any
            if (fields.length > 0) {
              fields.forEach((field: any) => {
                pendingwfh = field
                const labelKey = Object.keys(field.toValue)[0]
                const fieldKey = field.fieldKey
                feildNameObj = this.profileData ? this.profileData.filter(userData => userData.key === labelKey)[0] : {}
                feildKeyObj = this.profileDataKeys ? this.profileDataKeys.filter(userData => userData.key === fieldKey)[0] : {}
              })
              this.wfHistory.push({
                fieldKey: feildKeyObj ? feildKeyObj.name : null,
                requestedon: `${currentdate.getDate()}
                  ${moment(currentdate.getMonth() + 1, 'MM').format('MMM')}
                  ${currentdate.getFullYear()}
                  ${currentdate.getHours()} :
                  ${currentdate.getMinutes()} :
                  ${currentdate.getSeconds()}`,
                toValue: pendingwfh.toValue ? pendingwfh.toValue[Object.keys(pendingwfh.toValue)[0]] : null,
                fromValue: pendingwfh.fromValue ? pendingwfh.fromValue[Object.keys(pendingwfh.fromValue)[0]] : null,
                fieldName: feildNameObj ? feildNameObj.name : null,
                comment: wfh.comment ? wfh.comment : null,
                action: wfh.action ? wfh.action : null,
              })

            }
          }
        })
      }
    })

    this.updateUserRoleForm = new FormGroup({
      roles: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    this.tabsData = [
      {
        name: 'Personal details',
        key: 'personalInfo',
        render: true,
        enabled: true,
      },
      {
        name: 'Academics',
        key: 'academics',
        render: true,
        enabled: true,
      },
      {
        name: 'Professional details',
        key: 'profdetails',
        render: true,
        enabled: true,
      },
      {
        name: 'Certification and skills',
        key: 'skills',
        render: true,
        enabled: true,
      },
      {
        name: 'Update roles',
        key: 'roles',
        render: true,
        enabled: true,
      }]
  }

  ngAfterViewInit() {
    this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
  }

  modifyUserRoles(role: string) {
    if (this.userRoles.has(role)) {
      this.userRoles.delete(role)
    } else {
      this.userRoles.add(role)
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
  changeToDefaultImg($event: any) {
    $event.target.src = '/assets/instances/eagle/app_logos/default.png'
  }

  resetRoles() {
    this.updateUserRoleForm.controls['roles'].setValue(this.orguserRoles)
  }

  onSubmit(form: any) {
    if (form.value.roles !== this.orguserRoles) {
      const dreq = {
        request: {
          organisationId: this.department,
          userId: this.userID,
          roles: form.value.roles,
        },
      }

      this.usersSvc.addUserToDepartment(dreq).subscribe(dres => {
        if (dres) {
          this.updateUserRoleForm.reset({ roles: '' })
          this.openSnackbar('User role updated Successfully')
          if (this.qpParam === 'MDOinfo') {
            this.router.navigate(['/app/home/mdoinfo/leadership'])
          } else {
            this.router.navigate(['/app/home/users'])
          }
        }
      })
    } else {
      this.openSnackbar('Select new roles')
    }
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
