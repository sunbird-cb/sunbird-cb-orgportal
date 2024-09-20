import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'

@Component({
  selector: 'ws-app-selected-designation-popup',
  templateUrl: './selected-designation-popup.component.html',
  styleUrls: ['./selected-designation-popup.component.scss'],
})
export class SelectedDesignationPopupComponent implements OnInit {

  selectedDesignationsList: any[] = []
  removedDesignationsList: any[] = []

  constructor(
    public dialogRef: MatDialogRef<SelectedDesignationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) {
    this.selectedDesignationsList = this.dialogData
  }

  ngOnInit() {
  }

  removeSelectedDesignation(index: number) {
    this.removedDesignationsList.push(this.selectedDesignationsList[index])
    this.selectedDesignationsList.splice(index, 1)
  }

  updateList() {
    this.dialogRef.close(this.removedDesignationsList)
  }

}
