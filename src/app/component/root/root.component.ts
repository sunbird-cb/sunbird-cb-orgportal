import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ApplicationRef,
} from '@angular/core'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router'
// import { interval, concat, timer } from 'rxjs'
import { BreadcrumbsOrgService } from '@sunbird-cb/collection'
import {
  // AuthKeycloakService,
  ConfigurationsService,
  TelemetryService,
  ValueService,
  WsEvents,
  LoggerService,
} from '@sunbird-cb/utils'
import { delay, first } from 'rxjs/operators'
import { MobileAppsService } from '../../services/mobile-apps.service'
import { RootService } from './root.service'
import { SwUpdate } from '@angular/service-worker'
import { environment } from '../../../environments/environment'
import { interval, concat, timer } from 'rxjs'
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component'
import { MatDialog } from '@angular/material'
// import { MatDialog } from '@angular/material'
// import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component'

@Component({
  selector: 'ws-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  providers: [SwUpdate],
})
export class RootComponent implements OnInit, AfterViewInit {
  @ViewChild('previewContainer', { read: ViewContainerRef, static: true })
  previewContainerViewRef: ViewContainerRef | null = null
  @ViewChild('appUpdateTitle', { static: true })
  appUpdateTitleRef: ElementRef | null = null
  @ViewChild('appUpdateBody', { static: true })
  appUpdateBodyRef: ElementRef | null = null

  isXSmall$ = this.valueSvc.isXSmall$
  routeChangeInProgress = false
  showNavbar = false
  currentUrl!: string
  isNavBarRequired = false
  isInIframe = false
  appStartRaised = false
  isSetupPage = false
  constructor(
    private router: Router,
    // public authSvc: AuthKeycloakService,
    private appRef: ApplicationRef,
    private logger: LoggerService,
    private swUpdate: SwUpdate,
    private dialog: MatDialog,
    public configSvc: ConfigurationsService,
    private valueSvc: ValueService,
    private telemetrySvc: TelemetryService,
    private mobileAppsSvc: MobileAppsService,
    private rootSvc: RootService,
    private btnBackSvc: BreadcrumbsOrgService,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.mobileAppsSvc.init()
  }

  ngOnInit() {
    try {
      this.isInIframe = window.self !== window.top
    } catch (_ex) {
      this.isInIframe = false
    }

    this.btnBackSvc.initialize()
    // Application start telemetry
    this.telemetrySvc.start('app', 'view', '')
    this.appStartRaised = true
    // if (this.authSvc.isAuthenticated) {
    //   this.telemetrySvc.start('app', 'view', '')
    //   this.appStartRaised = true

    // }
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/setup/')) {
          this.isSetupPage = true
        }
      }
      if (event instanceof NavigationStart) {
        if (event.url.includes('preview') || event.url.includes('embed')) {
          this.isNavBarRequired = false
        } else if (event.url.includes('author/') && this.isInIframe) {
          this.isNavBarRequired = false
        } else {
          this.isNavBarRequired = true
        }
        this.routeChangeInProgress = true
        this.changeDetector.detectChanges()
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.routeChangeInProgress = false
        this.currentUrl = event.url
        this.changeDetector.detectChanges()
      }

      if (event instanceof NavigationEnd) {
        this.telemetrySvc.impression()
        if (this.appStartRaised) {
          this.telemetrySvc.audit(WsEvents.WsAuditTypes.Created, 'Login', {})
          this.appStartRaised = false
        }
      }
    })
    this.rootSvc.showNavbarDisplay$.pipe(delay(500)).subscribe(display => {
      this.showNavbar = display
    })
  }

  ngAfterViewInit() {
    this.initAppUpdateCheck()
  }

  initAppUpdateCheck() {
    this.logger.log('LOGGING IN ROOT FOR PWA INIT CHECK')
    if (environment.production) {
      const appIsStable$ = this.appRef.isStable.pipe(
        first(isStable => isStable),
      )
      const everySixHours$ = interval(6 * 60 * 60 * 1000)
      const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$)
      everySixHoursOnceAppIsStable$.subscribe(() => this.swUpdate.checkForUpdate())
      if (this.swUpdate.isEnabled) {
        this.swUpdate.available.subscribe(() => {
          const dialogRef = this.dialog.open(DialogConfirmComponent, {
            data: {
              title: (this.appUpdateTitleRef && this.appUpdateTitleRef.nativeElement.value) || '',
              body: (this.appUpdateBodyRef && this.appUpdateBodyRef.nativeElement.value) || '',
            },
          })
          dialogRef.afterClosed().subscribe(
            (result: any) => {
              if (result) {
                this.swUpdate.activateUpdate().then(() => {
                  if ('caches' in window) {
                    caches.keys()
                      .then(keyList => {
                        timer(2000).subscribe(
                          _ => window.location.reload(),
                        )
                        return Promise.all(keyList.map(key => {
                          return caches.delete(key)
                        }))
                      })
                  }
                })
              }
            },
          )
        })
      }
    }
  }
}
