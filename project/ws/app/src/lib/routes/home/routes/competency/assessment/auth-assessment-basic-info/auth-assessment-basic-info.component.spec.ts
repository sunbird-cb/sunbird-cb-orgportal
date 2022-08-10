import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { AuthAssessmentBasicInfoComponent } from './auth-assessment-basic-info.component'

describe('AuthAssessmentBasicInfoComponent', () => {
  let component: AuthAssessmentBasicInfoComponent
  let fixture: ComponentFixture<AuthAssessmentBasicInfoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AuthAssessmentBasicInfoComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthAssessmentBasicInfoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
