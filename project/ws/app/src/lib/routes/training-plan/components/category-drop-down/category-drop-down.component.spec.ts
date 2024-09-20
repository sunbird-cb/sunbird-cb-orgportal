import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CategoryDropDownComponent } from './category-drop-down.component'

describe('CategoryDropDownComponent', () => {
  let component: CategoryDropDownComponent
  let fixture: ComponentFixture<CategoryDropDownComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryDropDownComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryDropDownComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
