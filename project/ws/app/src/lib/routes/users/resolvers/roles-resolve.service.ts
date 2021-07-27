import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { IResolveResponse } from '@sunbird-cb/utils'
import { RolesService } from '../services/roles.service'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */

@Injectable()
export class RolesResolver
  implements
  Resolve<Observable<IResolveResponse<any>> | IResolveResponse<any>> {
  constructor(private rolesService: RolesService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<any>> {
    return this.rolesService.getAllRoles().pipe(
      map(data => ({ data: JSON.parse(_.get(data, 'result.response.value') || '{}'), error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
