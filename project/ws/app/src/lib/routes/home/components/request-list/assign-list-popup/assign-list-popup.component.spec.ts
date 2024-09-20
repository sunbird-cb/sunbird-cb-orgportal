import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AssignListPopupComponent } from './assign-list-popup.component'

describe('AssignListPopupComponent', () => {
  let component: AssignListPopupComponent
  let fixture: ComponentFixture<AssignListPopupComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssignListPopupComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignListPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
