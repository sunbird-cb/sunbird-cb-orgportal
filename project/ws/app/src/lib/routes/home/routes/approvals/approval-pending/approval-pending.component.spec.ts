import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ApprovalPendingComponent } from './approval-pending.component'

describe('ApprovalPendingComponent', () => {
  let component: ApprovalPendingComponent
  let fixture: ComponentFixture<ApprovalPendingComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalPendingComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalPendingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
