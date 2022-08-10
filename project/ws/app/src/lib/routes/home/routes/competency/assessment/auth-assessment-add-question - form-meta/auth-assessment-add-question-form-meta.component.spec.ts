import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { AuthAssessmentAddQuestionFormMetaComponent } from './auth-assessment-add-question-form-meta.component'

describe('AuthAssessmentAddQuestionFormMetaComponent', () => {
  let component: AuthAssessmentAddQuestionFormMetaComponent
  let fixture: ComponentFixture<AuthAssessmentAddQuestionFormMetaComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AuthAssessmentAddQuestionFormMetaComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthAssessmentAddQuestionFormMetaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
