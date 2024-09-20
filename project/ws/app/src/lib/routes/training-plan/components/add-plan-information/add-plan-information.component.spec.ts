import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AddPlanInformationComponent } from './add-plan-information.component'

describe('AddPlanInformationComponent', () => {
  let component: AddPlanInformationComponent
  let fixture: ComponentFixture<AddPlanInformationComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPlanInformationComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlanInformationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
