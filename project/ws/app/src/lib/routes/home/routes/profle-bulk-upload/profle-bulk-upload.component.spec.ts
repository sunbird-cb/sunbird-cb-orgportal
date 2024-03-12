import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfleBulkUploadComponent } from './profle-bulk-upload.component';

describe('ProfleBulkUploadComponent', () => {
  let component: ProfleBulkUploadComponent;
  let fixture: ComponentFixture<ProfleBulkUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfleBulkUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfleBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
