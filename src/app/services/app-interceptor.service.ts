import { Injectable, LOCALE_ID, Inject } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { ConfigurationsService, AuthKeycloakService } from '@sunbird-cb/utils'
import { catchError } from 'rxjs/operators'
import { MatSnackBar } from '@angular/material'

@Injectable({
  providedIn: 'root',
})
export class AppInterceptorService implements HttpInterceptor {
  constructor(
    private configSvc: ConfigurationsService,
    private snackBar: MatSnackBar,
    private authSvc: AuthKeycloakService,
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
          // wid: (this.configSvc.userProfile && this.configSvc.userProfile.userId) || '',
          wid: '',
          hostPath: this.configSvc.hostPath,
        },
      })
      return next.handle(modifiedReq).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            const localUrl = location.origin
            // const pagePath = location.href || `${localUrl}/app/home/welcome`
            // const pageName = (location.href || '').replace(localUrl, '')
            switch (error.status) {
              case 0:
                if (localUrl.includes('localhost')) {
                  this.snackBar.open('Please login Again and Apply new TOKEN', undefined, { duration: 100 * 3 })
                }
                this.authSvc.force_logout()
                break
              case 200:
                if (!error.ok && error.url) {
                  window.location.href = error.url
                }
                break
              case 419:      // login
                if (localStorage.getItem('telemetrySessionId')) {
                  localStorage.removeItem('telemetrySessionId')
                }
                // if (localUrl.includes('localhost')) {
                //   // tslint:disable-next-line: prefer-template
                //   window.location.href = error.error.redirectUrl + `?q=${pagePath}`
                // } else {
                //   // tslint:disable-next-line: prefer-template
                //   window.location.href = error.error.redirectUrl + `?q=${pageName}`
                // }
                this.authSvc.force_logout()
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
