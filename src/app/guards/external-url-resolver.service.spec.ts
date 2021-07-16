import { TestBed } from '@angular/core/testing'

import { ExternalUrlResolverService } from './external-url-resolver.service'

describe('ExternalUrlResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: ExternalUrlResolverService = TestBed.inject(ExternalUrlResolverService)
    expect(service).toBeTruthy()
  })
})
