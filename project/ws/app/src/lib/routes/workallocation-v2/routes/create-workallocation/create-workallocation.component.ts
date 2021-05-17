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
  filterComp($element: any, filterType: string) {
    this.selectedTab = filterType
    $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })

  }
  get currentProgress(): number {
    return 70
  }
  get getsubPath(): string {
    return `./#${this.selectedTab}`
  }
}
