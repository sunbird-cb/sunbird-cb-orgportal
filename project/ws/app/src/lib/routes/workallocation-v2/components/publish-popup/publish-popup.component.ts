import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialogRef } from '@angular/material'

@Component({
  selector: 'ws-app-publish-popup',
  templateUrl: './publish-popup.component.html',
  styleUrls: ['./publish-popup.component.scss'],
})
export class PublishPopupComponent implements OnInit {
  config = 1

  constructor(private router: Router, public dialogRef: MatDialogRef<PublishPopupComponent>) { }

  ngOnInit() {
  }

  next() {
    this.config = this.config + 1
    if (this.config === 6) {
      this.config = 1
      this.dialogRef.close()
      this.router.navigate([`/app/workallocation/published`])
    }
  }

}
