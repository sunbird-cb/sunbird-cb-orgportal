import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { AuthAssessmentAddQuestionComponent } from './auth-assessment-add-question.component'

describe('AuthAssessmentAddQuestionComponent', () => {
  let component: AuthAssessmentAddQuestionComponent
  let fixture: ComponentFixture<AuthAssessmentAddQuestionComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AuthAssessmentAddQuestionComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthAssessmentAddQuestionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
