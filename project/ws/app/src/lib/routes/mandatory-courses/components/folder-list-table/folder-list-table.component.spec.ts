import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FolderListTableComponent } from './folder-list-table.component'

describe('FolderListTableComponent', () => {
  let component: FolderListTableComponent
  let fixture: ComponentFixture<FolderListTableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FolderListTableComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderListTableComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
