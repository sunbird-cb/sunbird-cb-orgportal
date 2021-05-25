import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AssistantContentCardComponent } from './assistant-content-card.component'

describe('AssistantContentCardComponent', () => {
  let component: AssistantContentCardComponent
  let fixture: ComponentFixture<AssistantContentCardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssistantContentCardComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantContentCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
