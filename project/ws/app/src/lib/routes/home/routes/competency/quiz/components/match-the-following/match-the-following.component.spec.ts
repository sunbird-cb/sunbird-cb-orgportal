import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MatchTheFollowingComponent } from './match-the-following.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('MatchTheFollowingComponent', () => {
  let component: MatchTheFollowingComponent
  let fixture: ComponentFixture<MatchTheFollowingComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [MatchTheFollowingComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchTheFollowingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
