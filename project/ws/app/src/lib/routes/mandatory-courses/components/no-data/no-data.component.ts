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

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  btnClick() {
    this.router.navigate([`${this.data.btnLink}`])
  }

}
