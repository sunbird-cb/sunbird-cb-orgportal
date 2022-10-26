import { TestBed } from '@angular/core/testing'
import { QuizResolverService } from './resolver.service'
import { AccessControlService } from '../../../../../../../modules/shared/services/access-control.service'
import { ApiService } from '../../../../../../../modules/shared/services/api.service'
import { Router } from '@angular/router'
import { HttpBackend } from '@angular/common/http'

describe('QuizResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [AccessControlService, ApiService, Router, HttpBackend],
  }))

  it('should be created', () => {
    const service: QuizResolverService = TestBed.get(QuizResolverService)
    expect(service).toBeTruthy()
  })
})
