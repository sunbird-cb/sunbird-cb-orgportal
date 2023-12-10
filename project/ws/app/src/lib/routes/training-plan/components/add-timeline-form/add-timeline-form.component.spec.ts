import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AddTimelineFormComponent } from './add-timeline-form.component'

describe('AddTimelineFormComponent', () => {
  let component: AddTimelineFormComponent
  let fixture: ComponentFixture<AddTimelineFormComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddTimelineFormComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelineFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
