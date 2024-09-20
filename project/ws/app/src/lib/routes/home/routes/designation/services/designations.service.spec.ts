import { TestBed } from '@angular/core/testing'

import { DesignationsService } from './designations.service'

describe('DesignationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: DesignationsService = TestBed.get(DesignationsService)
    expect(service).toBeTruthy()
  })
})
