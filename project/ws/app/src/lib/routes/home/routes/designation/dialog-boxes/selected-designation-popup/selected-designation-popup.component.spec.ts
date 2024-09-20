import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SelectedDesignationPopupComponent } from './selected-designation-popup.component'

describe('SelectedDesignationPopupComponent', () => {
  let component: SelectedDesignationPopupComponent
  let fixture: ComponentFixture<SelectedDesignationPopupComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedDesignationPopupComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedDesignationPopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
