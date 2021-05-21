import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { AllocationService } from '../../services/allocation.service'

@Component({
  selector: 'ws-app-officer',
  templateUrl: './officer.component.html',
  styleUrls: ['./officer.component.scss'],
})
export class OfficerComponent implements OnInit {
  userslist!: any[]
  userCtrl = new FormControl()
  filteredUserslist!: Observable<any[]>

  officerForm!: FormGroup

  constructor(
    private allocateSrvc: AllocationService,
    private formBuilder: FormBuilder
  ) {
    this.userCtrl.valueChanges
      .pipe(
        startWith(''),
        map(user => user ? this.filterUsers(user) : this.userslist.slice())
      )
  }

  ngOnInit() {
    this.officerForm = new FormGroup({})
    this.createForm()
  }

  createForm() {
    this.officerForm = this.formBuilder.group({
      officerName: this.formBuilder.control('', []),
      position: this.formBuilder.control('', []),
      positionDescription: this.formBuilder.control('', []),
    })
  }

  public async filterUsers(value: string) {
    // if (value && value.length > 3) {
    const filterValue = value.toLowerCase()
    // tslint:disable-next-line: deprecation
    this.allocateSrvc.onSearchUser(filterValue).subscribe(res => {
      this.userslist = res.result.data
    })
    // } else {
    // this.userslist = []
    // }
  }

  officerClicked(user: any) {
    if (user) {
      if (user.userDetails && user.userDetails.position) {
        if (this.officerForm && this.officerForm.get('position')) {
          // tslint:disable-next-line: no-non-null-assertion
          this.officerForm.get('position')!.setValue(user.userDetails.position)
        }
      }
    }
  }

  getInitials(name: string) {
    if (!name) {
      return ''
    }
    // This will fetch only all initials ex: Christy B Fernandes => CBF
    // return name.match(/(\b\S)?/g).join("").toUpperCase()

    // This will fetch only all initials ex: Christy B Fernandes => CBF OR Christy => CH
    // return name.match(/(^\S\S?|\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()

    // This will fetch only first and last initials ex: Christy B Fernandes => CF
    // tslint:disable-next-line: no-non-null-assertion
    const firstLast = name.match(/(\b\S)?/g)!.join('').match(/(^\S|\S$)?/g)
    // tslint:disable-next-line: no-non-null-assertion
    return firstLast!.join('').toUpperCase()
  }

}
