import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfleApprovalBulkUploadComponent } from './profle-approval-bulk-upload.component'

describe('ProfleApprovalBulkUploadComponent', () => {
  let component: ProfleApprovalBulkUploadComponent
  let fixture: ComponentFixture<ProfleApprovalBulkUploadComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfleApprovalBulkUploadComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfleApprovalBulkUploadComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
