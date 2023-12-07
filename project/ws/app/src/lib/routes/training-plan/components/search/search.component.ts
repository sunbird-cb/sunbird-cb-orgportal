import { Component, Inject, OnInit } from '@angular/core'
import {MatDialog} from '@angular/material';
import { DOCUMENT } from '@angular/common';
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation.box.component';

@Component({
  selector: 'ws-app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  filterVisibilityFlag = false;
  constructor(public dialog: MatDialog, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
  }

  openFilter() {
      this.filterVisibilityFlag = true;
      if(this.document.getElementById('top-nav-bar')) {
        this.document.getElementById('top-nav-bar')!.style.zIndex = "1";
      }
    
  }

  hideFilter(event:any) {
    this.filterVisibilityFlag = event;
    if(this.document.getElementById('top-nav-bar')) {
      this.document.getElementById('top-nav-bar')!.style.zIndex = "1000";
    }
  }

  showDialogBox() {
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      data: {
        'type':'progress',
        'icon':'close',
        'title':'You are attempting to change the selected user type?',
        'subTitle':"By selecting all users, you've selected all the users from your Department of fisheries.If you want to select custom users or by designation, use the above option",
        'primaryAction':'I understand, change user type',
        'secondaryAction':'Cancel'
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      // console.log('The dialog was closed');
    });
  }

}
