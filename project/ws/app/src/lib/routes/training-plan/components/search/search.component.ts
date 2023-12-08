import { Component, Input, Inject, OnInit } from '@angular/core'
import { DOCUMENT } from '@angular/common'


@Component({
  selector: 'ws-app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() categoryData:any = [];
  filterVisibilityFlag = false
  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
  }

  openFilter() {
      this.filterVisibilityFlag = true
      if (this.document.getElementById('top-nav-bar')) {
        const ele: any = this.document.getElementById('top-nav-bar')
        ele.style.zIndex = '1'
      }

  }

  hideFilter(event: any) {
    this.filterVisibilityFlag = event
    if (this.document.getElementById('top-nav-bar')) {
      const ele: any = this.document.getElementById('top-nav-bar')
      ele.style.zIndex = '1000'
    }
  }

}
