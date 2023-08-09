import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NominateUsersDialogComponent } from './nominate-users-dialog.component';

describe('NominateUsersDialogComponent', () => {
  let component: NominateUsersDialogComponent;
  let fixture: ComponentFixture<NominateUsersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NominateUsersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NominateUsersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
