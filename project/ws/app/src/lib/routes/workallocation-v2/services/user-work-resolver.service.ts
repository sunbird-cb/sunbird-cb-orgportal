import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'
import { of, Observable } from 'rxjs'
import { ActivatedRouteSnapshot } from '@angular/router'
import { UserWorkService } from './user-work.service'

@Injectable()
export class UserWorkResolverService {

  constructor(private userWorkService: UserWorkService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    // const workorder = route.params['workorder']
    const officerId = route.params['officerId']
    return this.userWorkService.fetchUserWorkAllocation(officerId).pipe(
      map((data: any) => {
        return { data: data.result && data.result.data, error: null }
      }),
      catchError((err: any) => {
        return of({ data: null, error: err })
      })
    )
  }
}
