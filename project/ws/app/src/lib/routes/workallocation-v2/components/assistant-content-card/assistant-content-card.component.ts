import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { PlayerDialogComponent } from '../player-dialog/player-dialog.component'

@Component({
  selector: 'ws-app-assistant-content-card',
  templateUrl: './assistant-content-card.component.html',
  styleUrls: ['./assistant-content-card.component.scss'],
})
export class AssistantContentCardComponent implements OnInit {
  @Input() content!: any
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog() {
    const dialogRef = this.dialog.open(PlayerDialogComponent, {
      restoreFocus: false,
      disableClose: false,
      data: this.content,
      // height: '70vh',
      width: '70%',
      maxHeight: '80vh',
      maxWidth: '80%',
    })
    dialogRef.afterClosed().subscribe((val: any) => {
      if (val) {
        // tslint:disable-next-line: no-console
        console.log({ val })
      }
    })
  }

}
