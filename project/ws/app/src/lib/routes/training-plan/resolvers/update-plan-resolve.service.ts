import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import { Observable } from 'rxjs'
import { TrainingPlanService } from '../services/traininig-plan.service'
import { map, retry } from 'rxjs/operators'
@Injectable()
export class UpdatePlanResolveService
  implements
  Resolve<Observable<any>> {
  constructor(
    private tpSvc: TrainingPlanService,
  ) { }
  resolve(
    _route: ActivatedRouteSnapshot
  ): Observable<any> {
    return this.tpSvc.readPlan(_route.paramMap.get('planId')).pipe(map((_res: any) => {
      return _res.result.content
    }),                                                            retry(1))
  }
}
