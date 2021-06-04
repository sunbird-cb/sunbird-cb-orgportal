import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
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
          this.watStore.setOfficerGroup(formValue)
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()
  }

  createForm() {
    this.officerForm = this.formBuilder.group({
      officerName: this.formBuilder.control('', []),
      position: this.formBuilder.control('', []),
      positionDescription: this.formBuilder.control('', []),
      user: this.formBuilder.control('', []),
      positionObj: this.formBuilder.control('', []),
    })
  }

  public filterUsers(value: string) {
    // if (value && value.length > 3) {
    const filterValue = value.toLowerCase()

    // tslint:disable-next-line: deprecation
    // this.allocateSrvc.onSearchUser(filterValue).subscribe(res => {
    //   this.userslist = res.result.data
    // })
    this.filteredUserslist = this.allocateSrvc.onSearchUser(filterValue).pipe(
      map(res => res.result.data.filter((user: any) => {
        return user.userDetails.first_name.toLowerCase().indexOf(value.toLowerCase()) === 0
      }))
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
      // tslint:disable-next-line: prefer-template
      const fullName = _.get(event, 'option.value.userDetails.first_name') + ' ' + _.get(event, 'option.value.userDetails.last_name')
      frmctr1.patchValue(fullName || '')
      this.watStore.setOfficerGroup(this.officerForm.value)
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
      this.watStore.setOfficerGroup(this.officerForm.value)
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next()
  }

}
