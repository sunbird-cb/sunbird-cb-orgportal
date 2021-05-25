import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AssistantMessageCardComponent } from './assistant-message-card.component'

describe('AssistantMessageCardComponent', () => {
  let component: AssistantMessageCardComponent
  let fixture: ComponentFixture<AssistantMessageCardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssistantMessageCardComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantMessageCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
