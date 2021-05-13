import { Component, OnInit } from "@angular/core"


@Component({
  selector: 'ws-app-create-workallocation',
  templateUrl: './create-workallocation.component.html',
  styleUrls: ['./create-workallocation.component.scss'],
})
export class CreateWorkallocationComponent implements OnInit {
  selectedTab = 'officer'
  canPublish = false
  constructor() {

  }

  ngOnInit() {

  }
  filterComp(filterType: string) {
    this.selectedTab = filterType
  }
}
