import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { QuizQusetionsComponent } from './quiz-questions.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper'
import { QuizResolverService } from '../../../services/resolver.service'

describe('QuizQusetionsComponent', () => {
  let component: QuizQusetionsComponent
  let fixture: ComponentFixture<QuizQusetionsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuizQusetionsComponent],
      imports: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [QuizResolverService, {
        provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false },
      }],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizQusetionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
