import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss'],
})
export class BatchListComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  viewDetails() {
    this.router.navigate(['/app/blended-approvals/1/batches/1'])
  }

}
