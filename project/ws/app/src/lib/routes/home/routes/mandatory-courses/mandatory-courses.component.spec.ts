import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MandatoryCoursesComponent } from './mandatory-courses.component'

describe('MandatoryCoursesComponent', () => {
  let component: MandatoryCoursesComponent
  let fixture: ComponentFixture<MandatoryCoursesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MandatoryCoursesComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryCoursesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
