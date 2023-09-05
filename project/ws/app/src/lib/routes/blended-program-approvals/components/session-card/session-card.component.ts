import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-session-card',
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.scss'],
})
export class SessionCardComponent implements OnInit {

  @Input() session!: any
  @Input() batch!: any

  constructor() { }

  ngOnInit() {
  }

}
