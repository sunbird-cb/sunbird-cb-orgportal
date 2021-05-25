import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';

@Component({
  selector: 'ws-app-publish-popup',
  templateUrl: './publish-popup.component.html',
  styleUrls: ['./publish-popup.component.scss'],
})
export class PublishPopupComponent implements OnInit {
  uploadimg = true
  loading = false

  constructor(private router: Router) { }

  ngOnInit() {
  }

  uploadimgbtn() {
    this.uploadimg = false
    this.loading = true

  }

  next() {
    this.router.navigate([`/app/workallocation/published`])
  }

}
