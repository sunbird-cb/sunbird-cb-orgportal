import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { QuestionEditorComponent } from './question-editor.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('QuestionEditorComponent', () => {
  let component: QuestionEditorComponent
  let fixture: ComponentFixture<QuestionEditorComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [QuestionEditorComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionEditorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
