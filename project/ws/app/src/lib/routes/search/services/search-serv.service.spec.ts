import { TestBed } from '@angular/core/testing'

import { SearchServService } from './search-serv.service'

describe('SearchServService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: SearchServService = TestBed.inject(SearchServService)
    expect(service).toBeTruthy()
  })
})
