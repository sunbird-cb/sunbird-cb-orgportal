import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-assistant-message-card',
  templateUrl: './assistant-message-card.component.html',
  styleUrls: ['./assistant-message-card.component.scss'],
})

export class AssistantMessageCardComponent implements OnInit {
  @Input() type: 'activity' | 'role' | 'competency' = 'activity'
  @Input() count = 0
  @Input() message = ''

  constructor() { }

  ngOnInit() {
  }

}
