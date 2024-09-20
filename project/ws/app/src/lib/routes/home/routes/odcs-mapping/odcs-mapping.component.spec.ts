import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OdcsMappingComponent } from './odcs-mapping.component'

describe('OdcsMappingComponent', () => {
  let component: OdcsMappingComponent
  let fixture: ComponentFixture<OdcsMappingComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OdcsMappingComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(OdcsMappingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
