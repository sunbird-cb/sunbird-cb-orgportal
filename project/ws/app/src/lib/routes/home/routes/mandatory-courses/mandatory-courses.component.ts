import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { AddFolderPopupComponent } from '../../../mandatory-courses/components/add-folder-popup/add-folder-popup.component'





@Component({
  selector: 'ws-app-mandatory-courses',
  templateUrl: './mandatory-courses.component.html',
  styleUrls: ['./mandatory-courses.component.scss']
})
export class MandatoryCoursesComponent implements OnInit {
  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }


  openCreateFolderDialog() {
    console.log("popup btn clicked")
    this.dialog.open(AddFolderPopupComponent, {
      // height: '400px',
      width: '400px',

      // panelClass: 'custom-dialog-container',
    })
  }

}
