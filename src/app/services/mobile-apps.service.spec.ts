import { TestBed } from '@angular/core/testing'

import { MobileAppsService } from './mobile-apps.service'

describe('MobileAppsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: MobileAppsService = TestBed.inject(MobileAppsService)
    expect(service).toBeTruthy()
  })
})
