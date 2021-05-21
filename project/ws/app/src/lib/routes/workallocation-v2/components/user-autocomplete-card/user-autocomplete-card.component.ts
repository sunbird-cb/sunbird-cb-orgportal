import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'ws-app-user-autocomplete-card',
  templateUrl: './user-autocomplete-card.component.html',
  styleUrls: ['./user-autocomplete-card.component.scss'],
})
export class UserAutocompleteCardComponent implements OnInit {
  @Input() user: any
  @Output() userClick = new EventEmitter<any>()

  constructor() { }

  ngOnInit() {
  }

  userClickHandler(user: any) {
    this.userClick.emit(user)
  }

}
