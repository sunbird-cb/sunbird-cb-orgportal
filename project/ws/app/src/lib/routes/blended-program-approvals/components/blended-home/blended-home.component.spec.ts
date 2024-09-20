import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BlendedHomeComponent } from './blended-home.component'

describe('BlendedHomeComponent', () => {
  let component: BlendedHomeComponent
  let fixture: ComponentFixture<BlendedHomeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlendedHomeComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlendedHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
