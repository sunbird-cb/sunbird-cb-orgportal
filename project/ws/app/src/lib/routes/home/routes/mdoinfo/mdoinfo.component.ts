import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core'
import { ValueService, ConfigurationsService, WidgetContentService } from '@sunbird-cb/utils'
import { map } from 'rxjs/operators'
import { ActivatedRoute, Router, Event, NavigationEnd  } from '@angular/router'
import { MDOinfo } from '../../models/mdoinfo.model'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */

@Component({
  selector: 'ws-app-mdoinfo',
  templateUrl: './mdoinfo.component.html',
  styleUrls: ['./mdoinfo.component.scss'],
})
export class MdoinfoComponent implements OnInit, OnDestroy {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  sticky = false
  elementPosition: any
  sideNavBarOpened = true
  panelOpenState = false
  unread = 0
  currentRoute = 'leadership'
  wfHistory: any[] = []
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  tabs: any
  tabsData: MDOinfo.IProfileTab[] | undefined
  private defaultSideNavBarOpenedSubscription: any
  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private valueSvc: ValueService,
    private configSvc: ConfigurationsService,
    private widgetContentSvc: WidgetContentService) {
      this.router.events.subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.bindUrl(event.urlAfterRedirects.replace('/app/home/mdoinfo/', '/app/home/mdoinfo/leadership'))
        }
      })

  }

  ngOnInit() {
    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    this.getMDOInfoConfig()
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

  getMDOInfoConfig() {
    const url = `${this.configSvc.sitePath}/feature/mdoinfo.json`
    this.widgetContentSvc.fetchConfig(url).subscribe(
      config => {
        this.tabsData = config.tabs
      },
      _err => { })
  }

  bindUrl(path: string) {
    if (path) {
      this.currentRoute = path
    }
  }
}
