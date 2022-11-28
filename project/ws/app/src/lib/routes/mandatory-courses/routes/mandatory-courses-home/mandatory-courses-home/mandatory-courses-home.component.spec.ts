import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryCoursesHomeComponent } from './mandatory-courses-home.component';

describe('MandatoryCoursesHomeComponent', () => {
  let component: MandatoryCoursesHomeComponent;
  let fixture: ComponentFixture<MandatoryCoursesHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryCoursesHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryCoursesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
