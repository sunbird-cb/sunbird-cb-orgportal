import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  @Input() user: any
  constructor() { }

  ngOnInit() {

  }

}
