import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DeleteDialogComponent } from './delete-dialog.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent
  let fixture: ComponentFixture<DeleteDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteDialogComponent],
      imports: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
