import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OfficerComponent } from './officer.component'

describe('OfficerComponent', () => {
  let component: OfficerComponent
  let fixture: ComponentFixture<OfficerComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfficerComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
