import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-standard-card',
  templateUrl: './standard-card.component.html',
  styleUrls: ['./standard-card.component.scss'],
})
export class StandardCardComponent implements OnInit {
  @Input() cardSize: any;
  @Input() checkboxVisibility:any = true;
  constructor() { }

  ngOnInit() {
  }

}
