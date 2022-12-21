import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AddBatchDialougeComponent } from './add-batch-dialouge.component'

describe('AddBatchDialougeComponent', () => {
  let component: AddBatchDialougeComponent
  let fixture: ComponentFixture<AddBatchDialougeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddBatchDialougeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBatchDialougeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
