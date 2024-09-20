import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SingleAssignPopupComponent } from './single-assign-popup.component'

describe('SingleAssignPopupComponent', () => {
  let component: SingleAssignPopupComponent
  let fixture: ComponentFixture<SingleAssignPopupComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SingleAssignPopupComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleAssignPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
