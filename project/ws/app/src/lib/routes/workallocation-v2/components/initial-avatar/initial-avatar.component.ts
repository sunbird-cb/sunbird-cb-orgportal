import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-initial-avatar',
  templateUrl: './initial-avatar.component.html',
  styleUrls: ['./initial-avatar.component.scss'],
})
export class InitialAvatarComponent implements OnInit {
  @Input() name!: string

  constructor() { }

  ngOnInit() {
  }

  getInitials() {
    if (!this.name) {
      return ''
    }
    // This will fetch only all initials ex: Christy B Fernandes => CBF
    // return name.match(/(\b\S)?/g).join("").toUpperCase()

    // This will fetch only all initials ex: Christy B Fernandes => CBF OR Christy => CH
    // return name.match(/(^\S\S?|\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()

    // This will fetch only first and last initials ex: Christy B Fernandes => CF
    // tslint:disable-next-line: no-non-null-assertion
    const firstLast = this.name.match(/(\b\S)?/g)!.join('').match(/(^\S|\S$)?/g)
    // tslint:disable-next-line: no-non-null-assertion
    return firstLast!.join('').toUpperCase()
  }

}
