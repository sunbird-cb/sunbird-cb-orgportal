import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() showBreadcrumbAction = true
  constructor() { }

  ngOnInit() {
  }

}
