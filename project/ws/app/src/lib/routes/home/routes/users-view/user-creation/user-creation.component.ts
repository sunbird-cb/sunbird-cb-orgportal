import { Component, OnInit } from '@angular/core'
import { MatTabChangeEvent } from '@angular/material'

@Component({
  selector: 'ws-user-creation',
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.scss'],
})

export class UserCreationComponent implements OnInit {

  tabSelected = 'Bulk Creation'
  constructor() { }

  ngOnInit() {
  }

  handleTabChanged(event: MatTabChangeEvent) {
    this.tabSelected = event.tab.textLabel
  }

}
