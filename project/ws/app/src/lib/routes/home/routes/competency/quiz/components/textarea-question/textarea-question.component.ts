import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'ws-auth-textarea-question',
  templateUrl: './textarea-question.component.html',
  styleUrls: ['./textarea-question.component.scss'],
})
export class TextareaQuestionComponent implements OnInit {
  @Output() value = new EventEmitter<any>()
  @Input() submitPressed!: boolean
  @Input() currentId = ''
  @Input() showHint!: boolean
  isDisabled = true
  constructor() { }

  ngOnInit() {
  }

}
