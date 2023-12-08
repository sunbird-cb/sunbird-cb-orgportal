import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {
  categoryData:any[] = []
  constructor() { }

  ngOnInit() {
    this.categoryData = [
      {
       'id':1,
       'name':'Course',
       'value':'Course'
      },
      {
        'id':2,
        'name':'Program',
        'value':'Program'
      },
      {
        'id':3,
        'name':'Blended program',
        'value':'Blended program'
      },
      {
        'id':4,
        'name':'Curated program',
        'value':'Curated program'
      },
      {
        'id':5,
        'name':'Moderated Course',
        'value':'Moderated Course'
      }
    ]
  }

}
