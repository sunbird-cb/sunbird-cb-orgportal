import { TestBed } from '@angular/core/testing'

import { MandatoryCourseService } from './mandatory-course.service'

describe('MandatoryCourseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: MandatoryCourseService = TestBed.get(MandatoryCourseService)
    expect(service).toBeTruthy()
  })
})
