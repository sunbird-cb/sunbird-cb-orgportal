import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators'
import { AllocationService } from '../../services/allocation.service'
import { WatStoreService } from '../../services/wat.store.service'

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
    // tslint:disable-next-line: no-non-null-assertion
    this.filteredUserslist = this.officerForm.controls['officerName']!.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(user => user ? this.filterUsers(user) : [])
      )

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
    })
  }

  public filterUsers(value: string): Observable<any[]> {
    // if (value && value.length > 3) {
    const filterValue = value.toLowerCase()

    // tslint:disable-next-line: deprecation
    // this.allocateSrvc.onSearchUser(filterValue).subscribe(res => {
    //   this.userslist = res.result.data
    // })
    return this.allocateSrvc.onSearchUser(filterValue).pipe(
      map(res => res.result.data.filter((user: any) => {
        return user.userDetails.first_name.toLowerCase().indexOf(value.toLowerCase()) === 0
      }))
    )
    // } else {
    // this.userslist = []
    // }
  }

  officerClicked(user: any) {
    if (user) {
      // tslint:disable-next-line: no-non-null-assertion
      this.officerForm.get('user')!.setValue(user)
      this.watStore.setOfficerGroup(this.officerForm.value)
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next()
  }

}
