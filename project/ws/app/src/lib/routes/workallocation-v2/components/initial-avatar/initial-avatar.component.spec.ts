import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InitialAvatarComponent } from './initial-avatar.component'

describe('InitialAvatarComponent', () => {
  let component: InitialAvatarComponent
  let fixture: ComponentFixture<InitialAvatarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InitialAvatarComponent,
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialAvatarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
