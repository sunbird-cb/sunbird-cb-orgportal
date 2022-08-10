import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { AuthAssessmentHomeComponent } from './auth-assessment-home.component'

describe('AuthAssessmentHomeComponent', () => {
  let component: AuthAssessmentHomeComponent
  let fixture: ComponentFixture<AuthAssessmentHomeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AuthAssessmentHomeComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthAssessmentHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
