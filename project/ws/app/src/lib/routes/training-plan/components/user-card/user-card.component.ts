import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  @Input() checkboxVisibility = true;
  @Input() assigneeData:any[] = [];
  constructor() { }

  ngOnInit() {
  }

}
