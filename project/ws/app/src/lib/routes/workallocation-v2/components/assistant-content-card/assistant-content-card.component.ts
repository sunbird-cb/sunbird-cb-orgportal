import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-assistant-content-card',
  templateUrl: './assistant-content-card.component.html',
  styleUrls: ['./assistant-content-card.component.scss'],
})
export class AssistantContentCardComponent implements OnInit {
  @Input() content!: any
  constructor() { }

  ngOnInit() {
  }

}
