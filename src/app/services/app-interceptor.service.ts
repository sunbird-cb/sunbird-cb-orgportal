import { Injectable, LOCALE_ID, Inject } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class AppInterceptorService implements HttpInterceptor {
  constructor(
    private configSvc: ConfigurationsService,
    @Inject(LOCALE_ID) private locale: string,
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lang = [this.locale.replace('en-US', 'en')]
    if (this.configSvc.userPreference) {
      (this.configSvc.userPreference.selectedLangGroup || '')
        .split(',')
        .map(u => u.trim())
        .filter(u => u.length)
        .forEach(locale => {
          if (!lang.includes(locale)) {
            lang.push(locale)
          }
        })
    }

    if (this.configSvc.activeOrg && this.configSvc.rootOrg) {
      const modifiedReq = req.clone({
        // url: req.url.indexOf('.json') >= 0 ? req.url : `https://igot-dev.in${req.url}`,
        setHeaders: {
          org: this.configSvc.activeOrg,
          rootOrg: this.configSvc.rootOrg,
          locale: lang.join(','),
          wid: (this.configSvc.userProfile && this.configSvc.userProfile.userId) || '',
          // wid: '',
          hostPath: this.configSvc.hostPath,
        },
      })
      return next.handle(modifiedReq).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            switch (error.status) {
              case 419:      // login
                const localUrl = location.origin
                const pageName = '/app/home/welcome'
                if (localUrl.includes('localhost')) {
                  // tslint:disable-next-line: prefer-template
                  window.location.href = error.error.redirectUrl + `?q=${localUrl}${pageName}`
                } else {
                  // tslint:disable-next-line: prefer-template
                  window.location.href = error.error.redirectUrl + `?q=${pageName}`
                }
                break
            }
          }
          return throwError('error')
        })
      )
    }
    return next.handle(req)
  }
}
