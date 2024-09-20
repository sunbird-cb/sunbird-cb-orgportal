import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output,
  QueryList, TemplateRef, ViewChild, ViewChildren,
} from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { UsersService } from '../../../users/services/users.service'
import {
  DateAdapter, MAT_DATE_FORMATS, MatChipInputEvent, MatDialog,
  MatExpansionPanel, MatPaginator, MatSnackBar, PageEvent,
} from '@angular/material'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
// tslint:disable-next-line
import _ from 'lodash'
import { RolesService } from '../../../users/services/roles.service'
import { ActivatedRoute } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators'
import { environment } from '../../../../../../../../../src/environments/environment'
// import { OtpService } from '../../../users/services/otp.service'
// import { ConfigurationsService } from '@sunbird-cb/utils'
// import { RejectionPopupComponent } from '../rejection-popup/rejection-popup.component'
import { APP_DATE_FORMATS, AppDateAdapter } from '../../../events/routes/format-datepicker'
import { ApprovalsService } from '../../services/approvals.service'
import { EventService } from '@sunbird-cb/utils'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
import { DatePipe } from '@angular/common'

// const EMAIL_PATTERN = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_]+)*@[a-zA-Z0-9]*.[a-zA-Z]{2,}$/
const EMAIL_PATTERN = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/

@Component({
  selector: 'ws-widget-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class UserCardComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit {
  @Input() userId: any
  @Input() tableData: any
  @Input() usersData: any
  @Input() totalRecords: any
  @Input() tabChangeIndex: any
  @Input() currentFilter: any
  @Input() isApprovals: any
  @Input() handleApiData: any
  @Input() activeTab: any
  @Input() forMentor = false
  @Input() pendingApprovals?: any = []
  @Output() paginationData = new EventEmitter()
  @Output() searchByEnterKey = new EventEmitter()
  @Output() disableButton = new EventEmitter()
  @Output() updateList = new EventEmitter()
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>

  @ViewChild('rejectDialog', { static: false })
  rejectDialog!: TemplateRef<any>
  @ViewChild('updaterejectDialog', { static: false })
  updaterejectDialog!: TemplateRef<any>

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | any

  @ViewChild('toggleElement', { static: true }) ref!: ElementRef

  startIndex = 0
  lastIndex = 20
  pageSize = 20

  cacheProfilePageIndex = 0
  cacheTransferPageIndex = 0

  rolesList: any = []
  rolesObject: any = []
  uniqueRoles: any = []
  public userRoles: Set<string> = new Set()
  orguserRoles: any = []
  isMdoAdmin = false
  isMdoLeader = false
  isBoth = false
  updateUserDataForm: FormGroup
  approveUserDataForm: FormGroup
  designationsMeta: any = []
  groupsList: any = []
  selectedtags: any[] = []
  reqbody: any
  isTagsEdited = false
  separatorKeysCodes: number[] = [ENTER, COMMA]
  namePatern = '^[a-zA-Z ]*$'
  orgTypeList: any = []
  // public countryCodes: string[] = []
  masterLanguages: Observable<any[]> | undefined
  masterLanguagesEntries: any
  genderList = ['Male', 'Female', 'Others']
  categoryList = ['General', 'OBC', 'SC', 'ST']
  // needApprovalList: any[] = []
  profileData: any[] = []
  userwfData!: any
  comment = ''
  listupdateFieldValues: any[] = []
  actionList: any = []

  phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
  emailRegix = `^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`
  pincodePattern = '(^[0-9]{6}$)'
  yearPattern = '(^[0-9]{4}$)'
  empIDPattern = `^[A-Za-z0-9]+$`

  noHtmlCharacter = new RegExp(/<[^>]*>|(function[^\s]+)|(javascript:[^\s]+)/i)
  htmlDetected = false

  userGroup: any

  otpSend = false
  otpVerified = false
  OTP_TIMER = environment.resendOTPTIme
  timerSubscription: Subscription | null = null
  timeLeftforOTP = 0
  isMobileVerified = false
  disableVerifyBtn = false
  qpParam: any
  department: any
  approvalData: any
  showeditText = false
  today = new Date()
  memberAlertMessage = ''
  currentUserRole = ''
  checked = false
  currentUserStatus = ''
  constructor(private usersSvc: UsersService, private roleservice: RolesService,
              private dialog: MatDialog, private approvalSvc: ApprovalsService,
              private route: ActivatedRoute, private snackBar: MatSnackBar,
              private events: EventService,
              private datePipe: DatePipe,
              private cdr: ChangeDetectorRef) {
    this.updateUserDataForm = new FormGroup({
      designation: new FormControl('', []),
      group: new FormControl('', [Validators.required]),
      employeeID: new FormControl('', [Validators.pattern(this.empIDPattern)]),
      ehrmsID: new FormControl({ value: '', disabled: true }, []),
      dob: new FormControl('', []),
      primaryEmail: new FormControl('', [Validators.required, Validators.email, Validators.pattern(EMAIL_PATTERN)]),
      // countryCode: new FormControl('+91', []),
      mobile: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
      tags: new FormControl('', [Validators.pattern(this.namePatern)]),
      roles: new FormControl('', [Validators.required]),
      domicileMedium: new FormControl('', []),
      gender: new FormControl('', []),
      category: new FormControl('', []),
      pincode: new FormControl('', []),
    })

    this.approveUserDataForm = new FormGroup({
      approveDesignation: new FormControl('', []),
      approveGroup: new FormControl('', []),
    })

    const fullProfile = _.get(this.route.snapshot, 'data.configService')
    this.department = fullProfile.unMappedUser.rootOrgId

    if (fullProfile.unMappedUser && fullProfile.unMappedUser.roles) {
      this.isMdoAdmin = fullProfile.unMappedUser.roles.includes('MDO_ADMIN')
      this.isMdoLeader = fullProfile.unMappedUser.roles.includes('MDO_LEADER')
      this.isBoth = fullProfile.unMappedUser.roles.includes('MDO_LEADER') && fullProfile.unMappedUser.roles.includes('MDO_ADMIN')
    }

    if (this.usersData && this.usersData.length > 0) {
      this.usersData = _.orderBy(this.usersData, item => item.firstName.toUpperCase(), ['asc'])

      // formatting profileStatusUpdatedOn value
      this.usersData.forEach((u: any) => {
        if (u.profileDetails.profileStatusUpdatedOn) {
          const val = u.profileDetails.profileStatusUpdatedOn.split(' ')
          u.profileDetails.profileStatusUpdatedOn = val[0]
        }
      })
    }
  }

  enableUpdateButton(appData: any): boolean {
    let enableBtn = true
    if (appData.needApprovalList) {
      appData.needApprovalList.forEach((field: any) => {
        if (field.label === 'Group' && this.approveUserDataForm.controls.approveGroup.invalid) {
          enableBtn = false
        }
        if (field.label === 'Designation' && this.approveUserDataForm.controls.approveDesignation.invalid) {
          enableBtn = false
        }
      })
    }
    return enableBtn
  }

  ngOnInit() {
    const cacheValProfile = localStorage.getItem('profileverificationOffset')
    const cacheValTransfer = localStorage.getItem('transferOffset')
    const storedPageSize = localStorage.getItem(`${this.currentFilter}PageSize`)
    this.cacheProfilePageIndex = cacheValProfile !== null ? parseInt(cacheValProfile, 10) : 0
    this.cacheTransferPageIndex = cacheValTransfer !== null ? parseInt(cacheValTransfer, 10) : 0
    this.pageSize = storedPageSize !== null ? parseInt(storedPageSize, 10) : 20

    if (this.isApprovals && this.usersData) {
      this.getApprovalData()
    } else {
      this.init()
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      if (this.currentFilter === 'profileverification') {
        this.paginator.pageIndex = this.cacheProfilePageIndex
      } else if (this.currentFilter === 'transfers') {
        this.paginator.pageIndex = this.cacheTransferPageIndex
      }
      this.paginator.pageSize = this.pageSize
      this.cdr.detectChanges()
    }
  }

  ngOnChanges() {

    if (this.usersData) {
      this.usersData = _.orderBy(this.usersData, item => {
        if (item.profileDetails && item.profileDetails.personalDetails) {
          return item.profileDetails.personalDetails.firstname ?
            item.profileDetails.personalDetails.firstname.toUpperCase() : item.firstName.toUpperCase()
        }
        // tslint:disable-next-line
      }, ['asc'])

      if (this.isApprovals) {
        this.getApprovalData()
      }
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges()
  }

  getApprovalData() {
    this.approvalData = this.usersData
    if (this.approvalData && this.approvalData.length > 0) {
      this.getUserMappedData(this.approvalData)
      this.approvalSvc.getProfileConfig().then((res: any) => {
        this.profileData = res && res.profileData
      })
      if (this.profileData) {
        this.getFieldsMappedData(this.approvalData)
      }
    }
  }

  // for approvals
  async getUserMappedData(approvalData: any) {
    approvalData.forEach((data: any) => {
      if (data.userWorkflow && data.userWorkflow.userInfo) {
        const id = data.userWorkflow.userInfo.wid
        this.usersSvc.getUserById(id).subscribe((res: any) => {
          if (res) {
            data.user = res
            if (this.currentFilter === 'transfers') {
              data.enableToggle = res.profileDetails.profileStatus !== 'NOT-MY-USER' ? true : false
            }

            if (data.user) {
              if (data.needApprovalList && data.needApprovalList.length === 1) {
                data.noneedApprovalList = []
                if (data.needApprovalList[0].feildName === 'group') {
                  const obj = {
                    label: 'Designation',
                    feildName: 'designation',
                    value: data.user.profileDetails.professionalDetails[0].designation || '',
                  }
                  data.noneedApprovalList.push(obj)
                }
                if (data.needApprovalList[0].feildName === 'designation') {
                  const obj = {
                    label: 'Group',
                    feildName: 'group',
                    value: data.user.profileDetails.professionalDetails[0].group || '',
                  }
                  data.noneedApprovalList.push(obj)
                }
              }
            }
          }
        })
      }
    })
  }

  async getFieldsMappedData(approvalData: any) {
    approvalData.forEach((appdata: any) => {
      if (appdata.userWorkflow.wfInfo && appdata.userWorkflow.wfInfo.length > 0) {
        appdata.needApprovalList = []
        appdata.userWorkflow.wfInfo.forEach((wf: any) => {
          if (typeof wf.updateFieldValues === 'string') {
            const fields = JSON.parse(wf.updateFieldValues)
            if (fields.length > 0) {
              fields.forEach((field: any) => {
                const labelKey = Object.keys(field.toValue)[0]
                const feildNameObj = labelKey === 'designation' ? 'Designation' : 'Group'
                if (labelKey === 'designation' || labelKey === 'group') {
                  appdata.needApprovalList.push(
                    Object.assign({
                      wf,
                      feildName: labelKey,
                      label: feildNameObj,
                      value: field.toValue[labelKey],
                      fieldKey: field.fieldKey,
                      wfId: wf.wfId,
                    })
                  )
                }
              })
            }
          }
        })
      }
    })
  }

  async init() {
    await this.loadDesignations()
    await this.loadGroups()
    await this.loadLangauages()
    // await this.loadCountryCodes()
    await this.loadRoles()
  }

  async loadDesignations() {
    await this.usersSvc.getDesignations({}).subscribe(
      (data: any) => {
        this.designationsMeta = data.responseData
      },
      (_err: any) => {
      })
  }

  async loadGroups() {
    await this.usersSvc.getGroups().subscribe(
      (data: any) => {
        const res = data.result.response.filter((ele: any) => ele !== 'Others')
        this.groupsList = res
      },
      (_err: any) => {
      })
  }

  async loadLangauages() {
    await this.usersSvc.getMasterLanguages().subscribe(
      (data: any) => {
        this.masterLanguagesEntries = data.languages
        this.onChangesLanuage()
      },
      (_err: any) => {
      })
  }

  // async loadCountryCodes() {
  //   this.usersSvc.getMasterNationlity().subscribe((data: any) => {
  //     data.nationality.map((item: any) => {
  //       this.countryCodes.push(item.countryCode)
  //     })

  //     this.updateUserDataForm.patchValue({
  //       countryCode: '+91',
  //     })
  //   },
  //     // tslint:disable-next-line
  //     (_err: any) => {
  //     })
  // }

  async loadRoles() {
    this.roleservice.getAllRoles().subscribe((_data: any) => {
      const parseRoledata = JSON.parse(_data.result.response.value)
      this.orgTypeList = parseRoledata.orgTypeList
    })
  }

  closeOtherPanels(openPanel: MatExpansionPanel) {
    this.panels.forEach(panel => {
      if (panel !== openPanel) {
        panel.close()
      }
    })
  }

  otherDropDownChange(value: any, field: string) {
    if (field === 'designation' && value !== 'Other') {
      this.updateUserDataForm.controls['designation'].setValue(value)
    }
  }

  onChangesLanuage(): void {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterLanguages = this.updateUserDataForm.get('domicileMedium')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map((value: any) => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
        map((name: any) => name ? this.filterLanguage(name) : this.masterLanguagesEntries.slice()),
      )
  }

  private filterLanguage(name: string) {
    if (name) {
      const filterValue = name.toLowerCase()
      return this.masterLanguagesEntries.filter((option: any) => option.name.toLowerCase().includes(filterValue))
    }
    return this.masterLanguagesEntries
  }

  numericOnly(event: any): boolean {
    const pattren = /^([0-9])$/
    const result = pattren.test(event.key)
    return result
  }

  onEditUser(user: any, pnael: any) {
    let userval = user
    this.usersSvc.getUserById(user.userId).subscribe((res: any) => {
      if (res) {
        userval = res
        // console.log('userval', userval)
        this.usersData.forEach((u: any) => {
          if (u.userId === user.userId) {
            if (this.isMdoLeader) {
              u.enableEdit = true
              userval.enableEdit = true
            } else if (this.isMdoAdmin && userval.roles.includes('MDO_ADMIN')) {
              u.enableEdit = false
              userval.enableEdit = false
              this.snackBar.open('Only MDO Leader Can Update Profile')
            } else {
              u.enableEdit = true
              userval.enableEdit = true
            }

          } else {
            u.enableEdit = false
          }
        })

        pnael.open()
        this.setUserDetails(userval)
      }
    })
  }

  getApprovalUserData(user: any, data: any, openPanel: MatExpansionPanel) {
    if (openPanel.expanded) {
      user.enableEdit = false
      this.approveUserDataForm.reset()
      user.needApprovalList = []
      this.actionList = []
      this.comment = ''
      this.getApprovalList(data)
    }
  }

  getUerData(user: any, openPanel: MatExpansionPanel, index: any) {
    if (openPanel.expanded) {
      user.enableEdit = false
      const profileDataAll = user

      const profileData = profileDataAll.profileDetails
      this.updateTags(profileData)

      this.usersSvc.getUserById(user.userId).subscribe((res: any) => {
        if (res) {
          // tslint:disable-next-line
          user = res
          // user.enableEdit = false
          this.userRoles.clear()
          this.mapRoles(user)
          this.usersData[index] = user
        }
      })
    }
  }

  mapRoles(user: any) {
    if (this.orgTypeList && this.orgTypeList.length > 0) {
      // New code for roles
      for (let i = 0; i < this.orgTypeList.length; i += 1) {
        if (this.orgTypeList[i].name === 'MDO') {
          _.each(this.orgTypeList[i].roles, rolesObject => {
            if (rolesObject !== 'MDO_LEADER') {
              this.uniqueRoles.push({
                roleName: rolesObject, description: rolesObject,
              })
            }
          })
        }
      }
      this.uniqueRoles.forEach((role: any) => {
        if (!this.rolesList.some((item: any) => item.roleName === role.roleName)) {
          this.rolesList.push(role)
        }
      })
      const usrRoles = user.organisations[0] && user.organisations[0].roles
        ? user.organisations[0].roles : []
      if (usrRoles.length > 0) {
        this.updateUserDataForm.controls['roles'].setValue(usrRoles)
        usrRoles.forEach((role: any) => {
          this.orguserRoles.push(role)
          this.userRoles.add(role)
          // this.modifyUserRoles(role)
        })
      }
    } else {
      this.loadRoles()
      this.mapRoles(user)
    }
  }

  setUserDetails(user: any) {
    if (user && user.profileDetails) {
      this.updateUserDataForm.reset()
      if (user.profileDetails.additionalProperties) {
        if (user.profileDetails.additionalProperties.externalSystemId) {
          this.updateUserDataForm.controls['ehrmsID'].setValue(user.profileDetails.additionalProperties.externalSystemId)
        }
      }
      if (user.profileDetails.professionalDetails) {
        if (user.profileDetails.professionalDetails[0].designation) {
          this.updateUserDataForm.controls['designation'].setValue(user.profileDetails.professionalDetails[0].designation)
        }
        if (user.profileDetails.professionalDetails[0].group) {
          this.updateUserDataForm.controls['group'].setValue(user.profileDetails.professionalDetails[0].group)
        }
      }
      if (user.profileDetails.personalDetails) {
        if (user.profileDetails.personalDetails.primaryEmail) {
          this.updateUserDataForm.controls['primaryEmail'].setValue(user.profileDetails.personalDetails.primaryEmail)
        }
        if (user.profileDetails.personalDetails.mobile) {
          this.updateUserDataForm.controls['mobile'].setValue(user.profileDetails.personalDetails.mobile)
        }
        if (user.profileDetails.personalDetails.gender) {
          if (user.profileDetails.personalDetails.gender === 'FEMALE') {
            this.updateUserDataForm.controls['gender'].setValue('Female')
          } else if (user.profileDetails.personalDetails.gender === 'MALE') {
            this.updateUserDataForm.controls['gender'].setValue('Male')
          } else if (user.profileDetails.personalDetails.gender === 'OTHERS') {
            this.updateUserDataForm.controls['gender'].setValue('Others')
          } else {
            this.updateUserDataForm.controls['gender'].setValue(user.profileDetails.personalDetails.gender)
          }
        }
        if (user.profileDetails.personalDetails.dob) {
          // this.updateUserDataForm.controls['dob'].setValue(user.profileDetails.personalDetails.dob)
          this.updateUserDataForm.patchValue({
            dob: this.getDateFromText(user.profileDetails.personalDetails.dob),
          })
        }
        if (user.profileDetails.personalDetails.domicileMedium) {
          this.updateUserDataForm.controls['domicileMedium'].setValue(user.profileDetails.personalDetails.domicileMedium)
        }
        if (user.profileDetails.personalDetails.category) {
          this.updateUserDataForm.controls['category'].setValue(user.profileDetails.personalDetails.category)
        }
        // if (user.profileDetails.personalDetails.pinCode) {
        //   this.updateUserDataForm.controls['pincode'].setValue(user.profileDetails.personalDetails.pinCode)
        // }
      }

      if (user.profileDetails.employmentDetails) {
        if (user.profileDetails.employmentDetails.pinCode) {
          this.updateUserDataForm.controls['pincode'].setValue(user.profileDetails.employmentDetails.pinCode)
        }
        if (user.profileDetails.employmentDetails.employeeCode) {
          this.updateUserDataForm.controls['employeeID'].setValue(user.profileDetails.employmentDetails.employeeCode)
        }
      }
      this.mapRoles(user)
    }
  }

  private getDateFromText(dateString: string): any {
    if (dateString) {
      const sv: string[] = dateString.split('T')
      if (sv && sv.length > 1) {
        return sv[0]
      }
      const splitValues: string[] = dateString.split('-')
      const [dd, mm, yyyy] = splitValues
      const dateToBeConverted = dd.length !== 4 ? `${yyyy}-${mm}-${dd}` : `${dd}-${mm}-${yyyy}`
      return new Date(dateToBeConverted)
    }
    return ''
  }

  getUseravatarName(user: any) {
    let name = ''
    if (user && user.profileDetails && user.profileDetails.personalDetails) {
      if (user.profileDetails.personalDetails.firstname) {
        name = `${user.profileDetails.personalDetails.firstname}`
      } else if (user.profileDetails.personalDetails.firstName) {
        name = `${user.profileDetails.personalDetails.firstName}`
      }
    } else {
      name = `${user.firstName}`
    }
    return name
  }

  getApprovalList(approvalData: any) {
    this.userwfData = approvalData
  }

  cancelSubmit(user: any) {
    this.updateUserDataForm.reset()
    user.enableEdit = !user.enableEdit
  }

  modifyUserRoles(role: string) {
    if (this.userRoles.has(role)) {
      this.userRoles.delete(role)
    } else {
      this.userRoles.add(role)
    }
  }

  updateTags(profileData: any) {
    this.selectedtags = _.get(profileData, 'additionalProperties.tag') || []
  }

  addActivity(event: MatChipInputEvent) {
    const input = event.input
    const value = event.value as string
    // if ((value && value.trim()) && this.updateUserDataForm.valid) {
    if ((value && value.trim())) {
      this.isTagsEdited = true
      this.selectedtags.push(value)
    }
    if (input) {
      input.value = ''
    }
    if (this.updateUserDataForm.get('tags')) {
      // tslint:disable-next-line: no-non-null-assertion
      this.updateUserDataForm.get('tags')!.setValue(null)
    }
    this.updateUserDataForm.controls['tags'].reset()
  }

  removeActivity(interest: any) {
    const index = this.selectedtags.indexOf(interest)
    if (index >= 0) {
      this.selectedtags.splice(index, 1)
      this.isTagsEdited = true
    }
  }

  checkForChange(activityList: any) {
    const newobj: any = []
    activityList.forEach((val: any) => {
      const reqObj = {
        name: val,
      }
      newobj.push(reqObj)
    })
  }

  onChangePage(pe: PageEvent) {
    if (this.isApprovals) {
      this.startIndex = pe.pageIndex
      this.lastIndex = pe.pageSize
      this.paginationData.emit({ pageIndex: this.startIndex, pageSize: pe.pageSize })
    } else {
      this.startIndex = (pe.pageIndex) * pe.pageSize
      this.lastIndex = pe.pageSize
      this.paginationData.emit({ pageIndex: this.startIndex, pageSize: pe.pageSize })
    }
  }
  onSearch(event: any) {
    this.searchByEnterKey.emit(event)
  }

  onSubmit(form: any, user: any, panel: any) {
    if (form.valid) {
      const dobn = this.datePipe.transform(this.updateUserDataForm.controls['dob'].value, 'dd-MM-yyyy')
      this.reqbody = {
        request: {
          userId: user.userId,
          profileDetails: {
            personalDetails: {
              dob: dobn ? dobn : '',
              domicileMedium: this.updateUserDataForm.controls['domicileMedium'].value ?
                this.updateUserDataForm.controls['domicileMedium'].value : '',
              gender: this.updateUserDataForm.controls['gender'].value ? this.updateUserDataForm.controls['gender'].value : '',
              category: this.updateUserDataForm.controls['category'].value ? this.updateUserDataForm.controls['category'].value : '',
              mobile: this.updateUserDataForm.controls['mobile'].value,
              primaryEmail: this.updateUserDataForm.controls['primaryEmail'].value,
            },
            professionalDetails: [
              {
                designation: this.updateUserDataForm.controls['designation'].value ?
                  this.updateUserDataForm.controls['designation'].value : '',
                group: this.updateUserDataForm.controls['group'].value,
              },
            ],
            additionalProperties: {
              tag: this.selectedtags,
            },
            employmentDetails: {
              pinCode: this.updateUserDataForm.controls['pincode'].value ?
                this.updateUserDataForm.controls['pincode'].value : '',
              employeeCode: this.updateUserDataForm.controls['employeeID'].value ?
                this.updateUserDataForm.controls['employeeID'].value : '',
            },
          },
        },
      }
      this.usersSvc.updateUserDetails(this.reqbody).subscribe(dres => {
        if (dres) {
          if (this.isMdoLeader) {
            if (form.value.roles !== this.orguserRoles) {
              const dreq = {
                request: {
                  organisationId: this.department,
                  userId: user.userId,
                  roles: Array.from(this.userRoles),
                },
              }
              this.usersSvc.addUserToDepartment(dreq).subscribe(res => {
                if (res) {
                  this.updateUserDataForm.reset({ roles: '' })
                  // this.openSnackbar('User role updated Successfully')q
                  this.openSnackbar('User updated Successfully, updated data will be reflecting in sometime.')
                  panel.close()
                  this.updateList.emit()
                  this.searchByEnterKey.emit('')
                }
              })
            } else {
              this.openSnackbar('Select new roles')
            }
          } else {
            user['enableEdit'] = false

            panel.close()
            this.updateList.emit()
            this.openSnackbar('User updated Successfully, updated data will be reflecting in sometime.')
          }
        }
      },
        // tslint:disable-next-line: align
        (err: { error: any }) => {
          if (err.error.params.errmsg && err.error.params.errmsg !== 'null') {
            this.openSnackbar(err.error.params.errmsg)
            panel.close()
          } else {
            this.openSnackbar('Error in updating user')
            panel.close()
          }
        })
    }
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
  /* tslint:disable */
  // for approval & rejection
  onClickHandleWorkflow(field: any, action: string) {
    field.action = action
    const req = {
      action,
      comment: '',
      state: 'SEND_FOR_APPROVAL',
      userId: field.wf.userId,
      applicationId: field.wf.applicationId,
      actorUserId: this.userwfData.userInfo.wid,
      wfId: field.wf.wfId,
      serviceName: 'profile',
      updateFieldValues: JSON.parse(field.wf.updateFieldValues),
    }
    if (action === 'APPROVE') {
      // const index = this.actionList.indexOf(req.wfId)
      const index = this.actionList.findIndex((x: any) => x.wfId === req.wfId)
      if (index > -1) {
        this.actionList[index] = req
      } else {
        this.actionList.push(req)
      }
      // this.onApproveOrRejectClick(req)
    } else {
      this.comment = ''
      const dialogRef = this.dialog.open(this.rejectDialog, {
        width: '770px',
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.onApproveOrRejectClick(req)
          req.comment = this.comment
          field.comment = this.comment
          // const index = this.actionList.indexOf(req.wfId)
          const index = this.actionList.findIndex((x: any) => x.wfId === req.wfId)
          if (index > -1) {
            this.actionList[index] = req
          } else {
            this.actionList.push(req)
          }
        } else {
          dialogRef.close()
        }
      })
    }

    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
      },
      {
        id: field.wf.applicationId,
        type: TelemetryEvents.EnumIdtype.APPLICATION,
      }
    )

    // if (this.currentFilter === 'transfers' && appData !== undefined) {
    //   appData.needApprovalList.forEach((otherField: any) => {
    //     if (otherField.label !== field.label) {
    //       console.log('field', field)
    //       this.onClickHandleWorkflow(field, action)
    //     }
    //   })
    //   if (field.label === 'Group') {
    //     const designationValue = action === 'APPROVE' ? 'approvedesg' : 'rejectdesg'
    //     this.approveUserDataForm.controls.approveDesignation.setValue(designationValue)
    //   } else {
    //     const groupValue = action === 'APPROVE' ? 'approvegroup' : 'rejectgroup'
    //     this.approveUserDataForm.controls.approveGroup.setValue(groupValue)
    //   }
    // }
  }
  /* tslint:enable */
  // single aprrove or reject
  onApproveOrRejectClick(req: any) {
    this.approvalSvc.handleWorkflow(req).subscribe((res: any) => {
      if (res.result.data) {
        // this.openSnackbar('Request approved successfully')
      }
    })
  }

  onApprovalSubmit(panel: any, appData: any) {
    if (this.actionList.length > 0) {
      if (this.currentFilter === 'transfers') {
        this.onTransferSubmit(panel, appData)
      } else {
        const datalength = this.actionList.length
        this.actionList.forEach((req: any, index: any) => {
          if (req.action === 'APPROVE') {
            req.comment = ''
          }
          this.onApproveOrRejectClick(req)
          if (index === datalength - 1) {
            panel.close()
            this.comment = ''
            setTimeout(() => {
              this.openSnackbar('Request approved successfully')
              this.updateList.emit()
              // tslint:disable-next-line
            }, 100)
          }
          // tslint:disable-next-line
          // this.approvalData = this.approvalData.filter((wf: any) => { wf.userWorkflow.userInfo.wid !== req.userId })
          if (this.approvalData.length === 0) {
            this.disableButton.emit()
          }
        })
      }
    }
  }

  onTransferSubmit(panel: any, appData: any) {
    let orgReq = {}
    appData.userWorkflow.wfInfo.forEach((wf: any) => {
      const fields = JSON.parse(wf.updateFieldValues)
      if (fields.length > 0) {
        fields.forEach((field: any) => {
          const labelKey = Object.keys(field.toValue)[0]
          if (labelKey === 'name') {
            orgReq = {
              action: 'APPROVE',
              actorUserId: wf.actorUUID,
              applicationId: wf.applicationId,
              serviceName: wf.serviceName,
              state: 'SEND_FOR_APPROVAL',
              updateFieldValues: fields,
              userId: wf.userId,
              wfId: wf.wfId,
            }
          }
        })
      }
    })

    this.actionList.push(orgReq)
    const datalength = this.actionList.length
    this.actionList.forEach((req: any, index: any) => {
      if (req.action === 'APPROVE') {
        req.comment = ''
      }
      this.onApproveOrRejectClick(req)
      if (index === datalength - 1) {
        panel.close()
        this.comment = ''
        setTimeout(() => {
          this.openSnackbar('Request approved successfully')
          this.updateList.emit()
          // tslint:disable-next-line
        }, 100)
      }
      if (this.approvalData.length === 0) {
        this.disableButton.emit()
      }
    })

  }

  validateText(text: any) {
    const regexMatch = text.match(this.noHtmlCharacter)
    if (regexMatch) {
      this.htmlDetected = true
      this.snackBar.open('HTML or Js is not allowed')
    } else {
      this.htmlDetected = false
    }
  }

  updateRejection(field: any) {
    this.comment = field.comment
    const dialogRef = this.dialog.open(this.updaterejectDialog, {
      width: '770px',
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionList.forEach((req: any) => {
          if (req.wfId === field.wfId) {
            req.comment = this.comment
            field.comment = this.comment
            this.showeditText = false
          }
        })
      } else {
        dialogRef.close()
      }
    })
  }

  showedit() {
    this.showeditText = true
  }

  markStatus(status: any, user: any) {
    const reqbody = {
      request: {
        userId: user.userId,
        profileDetails: {
          profileStatus: status,
        },
      },
    }

    this.usersSvc.updateUserDetails(reqbody).subscribe(dres => {
      if (dres) {
        this.openSnackbar('User status updated Successfully')
        this.updateList.emit()
      }
    },
      // tslint:disable-next-line: align
      (err: { error: any }) => {
        this.openSnackbar(err.error.params.errmsg)
      })
  }

  confirmReassign(template: any, user: any) {
    const dialog = this.dialog.open(template, {
      width: '500px',
    })
    dialog.afterClosed().subscribe((v: any) => {
      if (v) {
        this.markStatus('NOT-VERIFIED', user)
      }
    })
  }

  confirmTransferRequest(template: any, data: any, event: any, panel: any) {
    data.enableToggle = true
    const dialog = this.dialog.open(template, {
      width: '500px',
    })
    dialog.afterClosed().subscribe((v: any) => {
      if (v) {
        let orgReq = {}
        data.userWorkflow.wfInfo.forEach((wf: any) => {
          const fields = JSON.parse(wf.updateFieldValues)
          if (fields.length > 0) {
            fields.forEach((field: any) => {
              const labelKey = Object.keys(field.toValue)[0]
              if (labelKey === 'name') {
                orgReq = {
                  action: 'REJECT',
                  actorUserId: wf.actorUUID,
                  applicationId: wf.applicationId,
                  serviceName: wf.serviceName,
                  state: 'SEND_FOR_APPROVAL',
                  updateFieldValues: fields,
                  userId: wf.userId,
                  wfId: wf.wfId,
                }
              }
            })
          }
        })
        this.approvalSvc.handleWorkflow(orgReq).subscribe((res: any) => {
          if (res) {
            this.openSnackbar('Request rejected successfully')
            panel.close()
            this.updateList.emit()
          }
        })

        // setTimeout(handleRRequest, 1000)
        // this.markStatus('NOT-MY-USER', data.user)
        data.enableToggle = false
      } else {
        event.source.checked = true
        data.enableToggle = true
      }
    })
  }

  confirmUserRequest(template: any, status: any, data: any, event: any): any {
    data.enableToggle = true
    this.currentUserStatus = status
    let showPopup = true
    if (status === 'NOT-MY-USER') {
      let checkPendingApprovals = false
      // tslint:disable
      for (let i = 0; i < this.pendingApprovals.length; i++) {
        if (this.pendingApprovals[i] && this.pendingApprovals[i]['userInfo']
          && this.pendingApprovals[i]['userInfo']['wid'] === data.userId
          && this.pendingApprovals[i]['wfInfo']
          && this.pendingApprovals[i]['wfInfo'].length
        ) {
          checkPendingApprovals = true
        }
      }
      // tslint:enable
      if (checkPendingApprovals) {
        this.snackBar.open('Please update the approval request of this user from the approvals tab to perform this action')
        event.source.checked = true
        return false
      }
      if (this.isMdoLeader) {
        showPopup = true
      } else if (this.isMdoAdmin && data.roles.includes('MDO_ADMIN')) {
        showPopup = false
        this.snackBar.open('Only MDO Leader Can Update Profile')
      } else {
        showPopup = true
      }
    }

    if (showPopup) {
      const dialog = this.dialog.open(template, {
        width: '500px',
      })
      dialog.afterClosed().subscribe((v: any) => {
        if (v) {
          this.markStatus(status, data)
          data.enableToggle = false
        } else {
          if (status === 'NOT-MY-USER') {
            event.source.checked = true
          } else {
            event.source.checked = false
          }
        }
      })
    }

  }

  confirmUpdate(template: any, updateUserDataForm: any, user: any, panel: any) {
    const dialog = this.dialog.open(template, {
      width: '500px',
    })
    dialog.afterClosed().subscribe((v: any) => {
      if (v) {
        this.onSubmit(updateUserDataForm, user, panel)
      } else {
        this.cancelSubmit(user)
      }
    })
  }

  confirmApproval(template: any, panel: any, appData: any) {
    const dialog = this.dialog.open(template, {
      width: '500px',
    })
    dialog.afterClosed().subscribe((v: any) => {
      if (v) {
        this.onApprovalSubmit(panel, appData)
      } else {
        panel.close()
      }
    })
  }

  onApprovalCancel(panel: any, appData: any) {
    panel.close()
    appData.needApprovalList.forEach((f: any) => {
      f.action = ''
    })
  }

  toggleMentor(template: any, event: any, user: any) {
    if (event.checked) {
      if (this.activeTab === 'mentor') {
        this.memberAlertMessage = 'Assign this user as a mentor?'
      } else {
        this.memberAlertMessage = 'Assign this user as a mentor? The user will be moved to the Assigned Mentors Tab'
      }

    } else {
      if (this.activeTab === 'verified') {
        this.memberAlertMessage = 'Remove this user from mentor role?'
      } else {
        this.memberAlertMessage = 'Remove this user from the mentor role? You can reverse this in the All Verified Users tab.'
      }

    }
    const dialog = this.dialog.open(template, {
      width: '600px',
    })
    dialog.afterClosed().subscribe((v: any) => {
      if (v) {
        this.saveMentorProfile(user, event)
      } else {
        if (this.activeTab === 'verified') {
          if (event.checked) {
            event.source.checked = false
          } else {
            event.source.checked = true
          }
        }
        if (this.activeTab === 'mentor') {
          if (event.checked) {
            event.source.checked = false
          } else {
            event.source.checked = true
          }
        }

      }
    })
  }

  saveMentorProfile(user: any, event: any) {
    const usrRoles = user.roles ? user.roles : []
    if (usrRoles.length > 0) {
      user.roles.map((role: any) => {
        if (role.role) {
          this.userRoles.add(role.role)
        }
      })
    }
    if (event.checked) {
      this.userRoles.add('MENTOR')
    } else {
      this.userRoles.delete('MENTOR')
    }
    const dreq = {
      request: {
        organisationId: user.rootOrgId,
        userId: user.userId,
        roles: Array.from(this.userRoles),
      },
    }
    this.usersSvc.addUserToDepartment(dreq).subscribe(res => {
      if (res) {
        if (this.activeTab === 'mentor') {
          this.usersSvc.mentorList$.next('mentor')
        } else {
          this.usersSvc.mentorList$.next('verified')
        }
        if (event.checked) {
          this.snackBar.open('User Assigned as Mentor Successfully')
        } else {
          this.snackBar.open('User Removed from Mentor Role Successfully')
        }

      } else {
        if (event.checked) {
          this.snackBar.open('Error While Assign User as a Mentor')
        } else {
          this.snackBar.open('Error While Removing User as a Mentor')
        }
      }
    })
  }

  getUserRoles(user: any) {
    // console.log('user--', user)
    const userRoles: any = []

    user.roles.map((role: any) => {
      userRoles.push(role.role)
    })

    if (userRoles.indexOf('MENTOR') > -1) {
      return true
    }
    return false
  }

  // checkForMDOAdmin(user: any) {
  //   if (this.isMdoLeader) {
  //     return true
  //   } else {
  //     console.log('user.roles', user)
  //   }

  // }
}
