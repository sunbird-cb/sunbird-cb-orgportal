import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent implements OnInit {

  currentFilter = 'course-list'
  constructor() { }

  ngOnInit() {
  }


  filter(data: any) {
    console.log(data, 'data value---')
    if (data === 'course-list') {
      this.currentFilter = 'course-list'
    } else if (data === 'batch-list') {
      this.currentFilter = 'batch-list'
    }
  }

}
