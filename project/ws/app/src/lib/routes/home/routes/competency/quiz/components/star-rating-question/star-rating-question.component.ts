import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'ws-auth-star-rating-question',
  templateUrl: './star-rating-question.component.html',
  styleUrls: ['./star-rating-question.component.scss'],
})
export class StarRatingQuestionComponent implements OnInit {
  @Output() value = new EventEmitter<any>()
  @Input() submitPressed!: boolean
  @Input() currentId = ''
  @Input() showHint!: boolean
  ratingScale = [1, 2, 3, 4, 5]
  greyed = true
  constructor() { }

  ngOnInit() {
  }

}
