import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'ws-app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  @Input() user: any
  @Input() isSelectable: boolean = true
  @Output() selected = new EventEmitter()
  profileColor!: string
  private randomcolors = [
    '#7E4C8D',
    '#3670B2',
    '#4E9E87'
  ]
  constructor() { }

  ngOnInit() {
    const randomIndex = Math.floor(Math.random() * Math.floor(this.randomcolors.length))
    this.profileColor = this.randomcolors[randomIndex]
  }

  onSelect(user: any) {
    if (!this.isSelectable) return
    this.selected.emit(user)
  }

}
