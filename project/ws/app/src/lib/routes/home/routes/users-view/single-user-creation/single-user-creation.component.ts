import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { MomentDateAdapter } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MatCheckboxChange, MatChipInputEvent, MatSnackBar } from '@angular/material'
import { HttpErrorResponse } from '@angular/common/http'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
import { UsersService } from '../../../../users/services/users.service'
import { RolesService } from '../../../../users/services/roles.service'
import { ActivatedRoute } from '@angular/router'

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
}

// const EMAIL_PATTERN = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_]+)*@[a-zA-Z0-9]*.[a-zA-Z]{2,}$/
const EMAIL_PATTERN = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/
const MOBILE_PATTERN = /^[0]?[6789]\d{9}$/
const PIN_CODE_PATTERN = /^[1-9][0-9]{5}$/

@Component({
  selector: 'ws-single-user-creation',
  templateUrl: './single-user-creation.component.html',
  styleUrls: ['./single-user-creation.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SingleUserCreationComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren('rolesCheckbox') checkboxes!: QueryList<ElementRef>
  defaultRole = ['PUBLIC']
  private destroySubject$ = new Subject()
  separatorKeysCodes: number[] = [ENTER, COMMA]
  masterData: any = {}
  rolesArr: string[] = []
  fullProfile: any
  namePatern = `^[a-zA-Z\\s\\']{1,50}$`

  displayLoader = false
  // emailRegix = `^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`
  userCreationForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
    firstName: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(MOBILE_PATTERN), Validators.minLength(10)]),
    channel: new FormControl(''),
    designation: new FormControl('', [Validators.required]),
    group: new FormControl('', [Validators.required]),
    dob: new FormControl(''),
    domicileMedium: new FormControl(''),
    gender: new FormControl(''),
    pincode: new FormControl('', [Validators.pattern(PIN_CODE_PATTERN)]),
    category: new FormControl(''),
    tags: new FormControl([]),
    roles: new FormControl([], [Validators.required]),
  })
  today = new Date()

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private matSnackBar: MatSnackBar,
    private rolesService: RolesService,
    private activatedRouter: ActivatedRoute
  ) {

    this.fullProfile = _.get(this.activatedRouter.snapshot, 'data.configService')

    if (this.userCreationForm.get('designation')) {
      // tslint:disable-next-line
      this.userCreationForm.get('designation')!.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(res => {
          if (this.masterData && this.masterData.designation) {
            this.masterData.designation = this.masterData.designationBackup.filter((item: any) =>
              item.name.toLowerCase().includes(res && res.toLowerCase()))
          }
        })
    }

    if (this.userCreationForm.get('domicileMedium')) {
      // tslint:disable-next-line
      this.userCreationForm.get('domicileMedium')!.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(res => {
          if (this.masterData && this.masterData.language) {
            this.masterData.language = this.masterData.languageBackup.filter((item: any) =>
              item.name.toLowerCase().includes(res && res.toLowerCase()))
          }
        })
    }
  }

  ngOnInit() {
    this.getDesignation()
    this.getMasterLanguages()
    this.getGroups()
    this.getOrgRolesList()
  }

  ngAfterViewInit(): void {
    this.setDefaultValue()

  }

  setDefaultValue(): void {
    if (this.userCreationForm.get('roles')) {
      // tslint:disable-next-line
      this.userCreationForm.get('roles')!.patchValue(this.defaultRole)
    }
    this.userCreationForm.patchValue({
      channel: (this.fullProfile && this.fullProfile.unMappedUser.channel) || '',
    })
  }

  getDesignation(): void {
    this.usersService.getDesignations()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.masterData['designation'] = _res.responseData
        this.masterData['designationBackup'] = _res.responseData
        // tslint:disable-next-line
      }, (_err: HttpErrorResponse) => {
        if (!_err.ok) {
          this.matSnackBar.open('Unable to fetch designation details, please try again later!')
        }
      })
  }

  getMasterLanguages(): void {
    this.usersService.getMasterLanguages()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        this.masterData['language'] = res.languages
        this.masterData['languageBackup'] = res.languages
        // tslint:disable-next-line
      }, (_err: HttpErrorResponse) => {
        if (!_err.ok) {
          this.matSnackBar.open('Unable to fetch master language details, please try again later!')
        }
      })
  }

  getGroups(): void {
    this.usersService.getGroups()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        this.masterData['group'] = res.result.response.filter((ele: any) => ele !== 'Others')
        // tslint:disable-next-line
      }, (_err: HttpErrorResponse) => {
        if (!_err.ok) {
          this.matSnackBar.open('Unable to fetch group data, please try again later!')
        }
      })
  }

  getOrgRolesList(): void {
    this.rolesService.getAllRoles()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        if (res && res.result && res.result.response.value) {
          this.masterData['rolesList'] = JSON.parse(res.result.response.value)
          if (Array.isArray(this.masterData.rolesList.orgTypeList)) {
            const mdoArray = this.masterData.rolesList.orgTypeList.find((elem: any) => elem.name === 'MDO')
            this.masterData['mdoRoles'] = mdoArray.roles
          }
        }
        // tslint:disable-next-line
      }, (_err: HttpErrorResponse) => {
        if (!_err.ok) {
          this.matSnackBar.open('Unable to fetch roles list, please try again later!')
        }
      })
  }

  handleRolesCheck(event: MatCheckboxChange, role: string): void {
    if (event.checked) {
      this.rolesArr.push(role)
    } else {
      if (this.rolesArr.indexOf(role) > -1) {
        this.rolesArr.splice(this.rolesArr.indexOf(role), 1)
      }
    }
    // tslint:disable-next-line
    this.userCreationForm.get('roles')!.patchValue([...this.defaultRole, ...this.rolesArr])
  }

  handleAddTags(event: MatChipInputEvent): void {
    const value = event.value as string
    // tslint:disable-next-line
    if (!this.userCreationForm.get('tags')!.value) {
      // tslint:disable-next-line
      this.userCreationForm.get('tags')!.patchValue([])
    }

    if ((value && value.trim()) && this.userCreationForm.get('tags')) {
      // tslint:disable-next-line
      this.userCreationForm.get('tags')!.value.push(value)
    }

    if (event.input) {
      event.input.value = ''
    }
  }

  handleValidTags(event: any): any {
    const charCode = event.charCode
    // tslint:disable-next-line
    return ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8 || charCode == 32)
  }

  handleRemoveTag(tag: any): void {
    if (this.userCreationForm.get('roles')) {
      // tslint:disable-next-line
      const indexValue = this.userCreationForm.get('tags')!.value.indexOf(tag)
      if (indexValue > -1) {
        // tslint:disable-next-line
        this.userCreationForm.get('tags')!.value.splice(indexValue, 1)
      }
    }
  }

  handleFormClear(): void {
    this.userCreationForm.reset()
    this.checkboxes.forEach((elem: any) => {
      if (elem.value !== 'PUBLIC') {
        elem.checked = false
      }
    })
    // this.initForm()
    this.rolesArr = []
    this.setDefaultValue()
  }

  handleUserCreation(): void {
    this.displayLoader = true
    const dataToSubmit = { ...this.userCreationForm.value }
    if (dataToSubmit.dob) {
      // tslint:disable-next-line
      dataToSubmit.dob = `${new Date(dataToSubmit.dob).getDate()}-${new Date(dataToSubmit.dob).getMonth() + 1}-${new Date(dataToSubmit.dob).getFullYear()}`
    }

    if (!this.userCreationForm.value.channel) {
      this.matSnackBar.open('Channel info is empty! So unable to create user')
      return
    }

    const postData = {
      personalDetails: '',
    }
    postData.personalDetails = dataToSubmit

    this.usersService.createUser(postData)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.displayLoader = false
        this.matSnackBar.open('User created successfully!')
        this.handleFormClear()
        // tslint:disable-next-line
      }, (_err: HttpErrorResponse) => {
        if (!_err.ok) {
          this.displayLoader = false
          this.matSnackBar.open(_.get(_err, 'error.params.errmsg') || 'Unable to create user, please try again later!')
        }
      })
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe()
  }

}
