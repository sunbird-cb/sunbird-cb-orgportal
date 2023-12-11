import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-app-create-timeline',
  templateUrl: './create-timeline.component.html',
  styleUrls: ['./create-timeline.component.scss'],
})
export class CreateTimelineComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  showAll() {
    this.router.navigate(['app', 'training-plan', 'preview-plan'])
  }

}
