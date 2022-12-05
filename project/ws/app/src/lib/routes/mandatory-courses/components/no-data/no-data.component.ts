import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NsContent } from '../../models/mandatory-course.models.'

@Component({
  selector: 'ws-app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent implements OnInit {
  @Input() data!: NsContent.IEmptyDataDisplay

  currentFilter = 'course-list'
  constructor(
    private router: Router
  ) { }

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

  btnClick() {
    this.router.navigate([`${this.data.btnLink}`])
  }

}
