import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'ws-app-reports-video',
  templateUrl: './reports-video.component.html',
  styleUrls: ['./reports-video.component.scss']
})
export class ReportsVideoComponent implements OnInit {
  videoLink = ''

  constructor(
    public dialogRef: MatDialogRef<ReportsVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private domSanitizer: DomSanitizer
  ) {
    this.videoLink = this.dialogData.videoLink
  }

  ngOnInit() {
  }

  get getVideoLink() {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.videoLink)
  }

}
