import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-status-widget',
  templateUrl: './status-widget.component.html',
  styleUrls: ['./status-widget.component.scss'],
})
export class StatusWidgetComponent implements OnInit {
  @Input() statusInfoList: any
  constructor() { }

  ngOnInit() {
  }

}
