import { Injectable, SkipSelf } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { IResolveResponse, ConfigurationsService } from '@sunbird-cb/utils'
import { UsersService } from '../../users/services/users.service'
// tslint:disable-next-line
import _ from 'lodash';

@Injectable()
export class UsersListResolve
  implements
  Resolve<Observable<IResolveResponse<any>> | IResolveResponse<any>> {
  constructor(private usersService: UsersService, @SkipSelf() private configSvc: ConfigurationsService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<any>> {
    const filterObj = {
      request: {
        query: '',
        filters: {
          rootOrgId: _.get(this.configSvc.unMappedUser, 'rootOrg.id'),
        },
      },
    }
    return this.usersService.getAllUsers(filterObj).pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
