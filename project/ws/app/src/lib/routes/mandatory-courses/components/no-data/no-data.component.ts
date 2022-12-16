import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Router } from '@angular/router'
import { NsMandatoryCourse } from '../../models/mandatory-course.models.'

@Component({
  selector: 'ws-app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent implements OnInit {
  @Input() data!: NsMandatoryCourse.IEmptyDataDisplay
  @Output() buttonClicked?: EventEmitter<any> = new EventEmitter()
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  btnClick() {
    if (this.data.btnLink !== 'none') {
      this.router.navigate([`${this.data.btnLink}`])
    }
    if (this.buttonClicked) {
      this.buttonClicked.emit({ buttonClicked: true, data: this.data })
    }
  }

}
