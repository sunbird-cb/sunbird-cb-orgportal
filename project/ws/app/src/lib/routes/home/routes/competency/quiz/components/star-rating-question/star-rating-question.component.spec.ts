import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { StarRatingQuestionComponent } from './star-rating-question.component'

describe('StarRatingQuestionComponent', () => {
  let component: StarRatingQuestionComponent
  let fixture: ComponentFixture<StarRatingQuestionComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StarRatingQuestionComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StarRatingQuestionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
