import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-app-blended-approvals',
  templateUrl: './blended-approvals.component.html',
  styleUrls: ['./blended-approvals.component.scss'],
})
export class BlendedApprovalsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  viewDetails() {
    this.router.navigate(['/app/blended-approvals/1/batches'])
  }

}
