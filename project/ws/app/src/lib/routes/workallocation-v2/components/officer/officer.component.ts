import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
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
  OfficerNameControl = new FormControl()
  positionControl = new FormControl()
  positionDescriptionControl = new FormControl()
  reportingToControl = new FormControl()
  reportingOfficerControl = new FormControl()

  constructor(private allocateSrvc: AllocationService) {
    this.userCtrl.valueChanges
      .pipe(
        startWith(''),
        map(user => user ? this.filterUsers(user) : this.userslist.slice())
      )
  }

  ngOnInit() {
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

  OfficerClicked(user: any) {
    if (user) {
      if (user.userDetails && user.userDetails.position) {
        this.positionControl.setValue(user.userDetails.position)
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
    const firstLast = name.match(/(\b\S)?/g)!.join("").match(/(^\S|\S$)?/g)
    return firstLast!.join("").toUpperCase()
  }

}
