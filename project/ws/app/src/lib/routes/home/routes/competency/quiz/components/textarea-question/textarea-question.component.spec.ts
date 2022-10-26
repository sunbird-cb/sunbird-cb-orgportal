import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TextareaQuestionComponent } from './textarea-question.component'

describe('TextareaQuestionComponent', () => {
  let component: TextareaQuestionComponent
  let fixture: ComponentFixture<TextareaQuestionComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextareaQuestionComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaQuestionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
