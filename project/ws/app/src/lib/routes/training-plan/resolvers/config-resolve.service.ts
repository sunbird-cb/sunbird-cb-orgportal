import { Injectable, SkipSelf } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable, of } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils'
@Injectable()
export class ConfigResolveService
  implements
  Resolve<Observable<any>> {
  constructor(
    @SkipSelf() private confService: ConfigurationsService,
  ) { }
  resolve(
  ): Observable<any> {

    return of({ ...this.confService })
  }
}
