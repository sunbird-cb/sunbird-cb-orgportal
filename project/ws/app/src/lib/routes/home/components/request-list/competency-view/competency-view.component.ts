import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'ws-app-competency-view',
  templateUrl: './competency-view.component.html',
  styleUrls: ['./competency-view.component.scss'],
})
export class CompetencyViewComponent implements OnInit {

  levelSelected: any
  constructor(
    public dialogRef: MatDialogRef<CompetencyViewComponent>,
    private sanitized: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public dData: any
  ) { }
  ngOnInit() {
    if (this.dData && this.dData.children && this.dData.children.length > 0) {
      if (this.dData.selectedLevelId) {
        this.levelSelected = this.dData.children.filter((v: any) => v.id === this.dData.selectedLevelId)[0]
      } else {
        this.levelSelected = this.dData.children[0]
      }
      this.dData.children.forEach((element: any) => {
        element['formatedText'] = this.formate(element.description)
      })
    }
  }
  add() {
    this.dialogRef.close({
      id: this.dData.id,
      action: 'ADD',
      childId: (this.levelSelected && Object.keys(this.levelSelected).length > 0) ? this.levelSelected.id : '',
    })
  }
  remove() {
    this.dialogRef.close({
      id: this.dData.id || this.dData,
      action: 'DELETE',
    })
  }

  formate(text: string): SafeHtml {
    let newText = '<ul class="pl-6">'
    if (text) {
      const splitTest = text.split('•')
      for (let index = 0; index < text.split('•').length; index += 1) {
        const text1 = splitTest[index]
        if (text1 && text1.trim()) {
          newText += `<li>${text1.trim()}</li>`
        }
      }
    }
    newText += `</ul>`
    return this.sanitized.bypassSecurityTrustHtml(newText)
  }

}
