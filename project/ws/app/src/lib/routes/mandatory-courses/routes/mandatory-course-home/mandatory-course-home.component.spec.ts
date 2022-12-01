import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryCourseHomeComponent } from './mandatory-course-home.component';

describe('MandatoryCourseHomeComponent', () => {
  let component: MandatoryCourseHomeComponent;
  let fixture: ComponentFixture<MandatoryCourseHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryCourseHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryCourseHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
