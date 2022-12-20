import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMetaDataComponent } from './add-meta-data.component';

describe('AddMetaDataComponent', () => {
  let component: AddMetaDataComponent;
  let fixture: ComponentFixture<AddMetaDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMetaDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMetaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
