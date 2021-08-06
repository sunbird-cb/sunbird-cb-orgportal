import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators'
import { AllocationService } from '../../services/allocation.service'
import { WatStoreService } from '../../services/wat.store.service'
// tslint:disable
import _ from 'lodash'
// tslint:enable

@Component({
  selector: 'ws-app-officer',
  templateUrl: './officer.component.html',
  styleUrls: ['./officer.component.scss'],
})
export class OfficerComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>()
  private unsubscribe1 = new Subject<void>()
  @Input() editData!: any
  userslist!: any[]
  userCtrl = new FormControl()
  filteredUserslist!: Observable<any[]>
  filteredPositionlist!: Observable<any[]>

  officerForm!: FormGroup

  constructor(
    private allocateSrvc: AllocationService,
    private formBuilder: FormBuilder,
    private watStore: WatStoreService,
  ) {
  }

  ngOnInit() {
    this.officerForm = new FormGroup({})
    this.createForm()
    this.officerForm.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(async formValue => {
          const obj = this.officerForm.value
          const txtPosition = _.get(obj, 'position')
          const objPosition = _.get(obj, 'positionObj.name')
          if (txtPosition !== objPosition) {
            const positionDesc = this.officerForm.controls['positionDescription'].value
            this.officerForm.controls['positionObj'].patchValue({
              name: txtPosition,
              description: positionDesc,
              id: '',
            })
          } else {
            this.watStore.setOfficerGroup(formValue, false, true)
          }
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()
  }

  createForm() {
    this.officerForm = this.formBuilder.group({
      officerName: this.formBuilder.control(_.get(this.editData, 'usr.officerName') || '', [Validators.required]),
      position: this.formBuilder.control(_.get(this.editData, 'position.userPosition') || '', [Validators.required]),
      positionDescription: this.formBuilder.control(_.get(this.editData, 'position.positionDescription') || '', []),
      user: this.formBuilder.control(_.get(this.editData, 'usr') || {}, []),
      positionObj: this.formBuilder.control(_.get(this.editData, 'position') || {}, []),
    })
    if (this.editData && _.get(this.editData, 'usr.officerName')) {
      this.watStore.setOfficerGroup(this.officerForm.value, false, false)
    }
    this.officerForm.controls['officerName'].valueChanges
      .pipe(debounceTime(100),
        // pairwise()
        switchMap(async (val: any) => {
          // tslint:disable
          const usrObj = this.officerForm.get('user')!.value
          let usrName = ''
          if (_.get(usrObj, 'firstName')) {
            usrName = `${_.get(usrObj, 'firstName')} ${_.get(usrObj, 'lastName')}`
          } else {
            usrName = `${_.get(usrObj, 'officerName')}`
          }
          if ((val || '').trim() !== (usrName || '').trim()) {
            this.officerForm.get('user')!.patchValue({})
            // tslint:enable
          }
        }), takeUntil(this.unsubscribe1)).subscribe()
  }

  public filterUsers(value: string) {
    // if (value && value.length > 3) {
    const filterValue = value.toLowerCase()

    // tslint:disable-next-line: deprecation
    // this.allocateSrvc.onSearchUser(filterValue).subscribe(res => {
    //   this.userslist = res.result.data
    // })
    this.filteredUserslist = this.allocateSrvc.onSearchUser(filterValue).pipe(
      map(res => res.result.response.content.filter((user: any) => {
        return user.firstName.toLowerCase().indexOf(value.toLowerCase()) === 0
      }))
      // map(res => res.result.data.filter((user: any) => {
      //   return user.userDetails.first_name.toLowerCase().indexOf(value.toLowerCase()) === 0
      // }))
    )
    // } else {
    // this.userslist = []
    // }
  }

  public filterPositions(value: string) {
    // if (value && value.length > 3) {
    const filterValue = value && value.toLowerCase()

    // tslint:disable-next-line: deprecation
    // this.allocateSrvc.onSearchUser(filterValue).subscribe(res => {
    //   this.userslist = res.result.data
    // })
    const req = {
      searches: [
        {
          type: 'POSITION',
          field: 'name',
          keyword: value,
        },
        {
          type: 'POSITION',
          field: 'status',
          keyword: 'VERIFIED',
        },
      ],
    }
    this.filteredPositionlist = this.allocateSrvc.onSearchPosition(req).pipe(
      map(res => res.responseData.filter((pos: any) => {
        return pos.name.toLowerCase().indexOf(filterValue) === 0
      }))
    )
  }

  officerClicked(event: any) {
    if (event) {
      const frmctr = this.officerForm.get('user') as FormControl
      frmctr.patchValue(_.get(event, 'option.value') || '')

      const frmctr1 = this.officerForm.get('officerName') as FormControl
      // const fullName = _.get(event, 'option.value.userDetails.first_name') + ' ' + _.get(event, 'option.value.userDetails.last_name')
      // tslint:disable-next-line: prefer-template
      const fullName = _.get(event, 'option.value.firstName') + ' ' + _.get(event, 'option.value.lastName')
      frmctr1.patchValue(fullName || '')
      this.watStore.setOfficerGroup(this.officerForm.value, false, true)
    }
  }

  postionClicked(event: any) {
    if (event) {
      const frmctr = this.officerForm.get('position') as FormControl
      frmctr.patchValue(_.get(event, 'option.value.name') || '')
      const frmctr1 = this.officerForm.get('positionDescription') as FormControl
      frmctr1.patchValue(_.get(event, 'option.value.description') || '')
      // tslint:disable-next-line: no-non-null-assertion
      this.officerForm.get('positionObj')!.setValue(_.get(event, 'option.value'))
      this.watStore.setOfficerGroup(this.officerForm.value, false, true)
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe1.next()
  }

}
