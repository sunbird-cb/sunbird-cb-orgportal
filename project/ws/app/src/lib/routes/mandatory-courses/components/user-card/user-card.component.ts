import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'ws-app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  @Input() user: any
  @Output() selected = new EventEmitter()
  constructor() { }

  ngOnInit() {

  }

  onSelect(user: any) {
    this.selected.emit(user)
  }

}
