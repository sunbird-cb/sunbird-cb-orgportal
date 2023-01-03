import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'ws-app-filter-tags',
  templateUrl: './filter-tags.component.html',
  styleUrls: ['./filter-tags.component.scss']
})
export class FilterTagsComponent implements OnInit {
  @Input() filtersList: any
  @Output() removeFilterItem = new EventEmitter()
  constructor() { }

  ngOnInit() { }

  removeFilter(item: any) {
    this.removeFilterItem.emit(item)
  }
}
