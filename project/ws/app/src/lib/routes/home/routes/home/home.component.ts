import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, HostListener, ViewChild } from '@angular/core'
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router'
import { ConfigurationsService, EventService, ValueService } from '@sunbird-cb/utils'
// import { LeftMenuService } from "@sunbird-cb/collection/lib/left-menu/left-menu.service"
import { map } from 'rxjs/operators'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
/* tslint:disable */
import _ from 'lodash'
import { ILeftMenu, LeftMenuService } from '@sunbird-cb/collection'

import { Subscription } from 'rxjs'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
/* tslint:enable */

@Component({
  selector: 'ws-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  /* tslint:disable */
  host: { class: 'margin-top-l' },
  providers: [LeftMenuService]
  /* tslint:enable */
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  sideNavBarOpened = true
  panelOpenState = false
  titles = [{ title: 'NETWORK', url: '/app/network-v2', icon: 'group' }]
  widgetData!: NsWidgetResolver.IWidgetData<ILeftMenu>
  unread = 0
  myRoles!: Set<string>
  currentRoute = 'home'
  banner!: NsWidgetResolver.IWidgetData<any>
  private bannerSubscription: any
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  userRouteName = ''
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  elementPosition: any
  sticky = false
  private defaultSideNavBarOpenedSubscription: any
  department: any = {}
  departmentName = ''
  subscription: Subscription

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
    private valueSvc: ValueService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private configService: ConfigurationsService,
    private leftMenuService: LeftMenuService,
    private events: EventService,
  ) {
    this.subscription = this.leftMenuService.onMessage().subscribe(message => {
      if (message) {
        this.raiseTelemetry(message.text.name)
      } else {
        // clear messages when empty message received
      }
    })

    if (_.get(this.activeRoute, 'snapshot.data.configService.userRoles')) {
      this.myRoles = _.get(this.activeRoute, 'snapshot.data.configService.userRoles')
    }

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.bindUrl(event.urlAfterRedirects.replace('/app/home/', ''))
        // this.widgetData = this.activeRoute.snapshot.data &&
        //   this.activeRoute.snapshot.data.pageData.data.menus || []

        // if (_.get(this.activeRoute.snapshot, 'data.department.data')) {
        const fullProfile = _.get(this.activeRoute.snapshot, 'data.configService')
        this.department = fullProfile.unMappedUser.rootOrgId
        this.departmentName = fullProfile ? fullProfile.unMappedUser.rootOrg.orgName : ''
        if (fullProfile) {
          const leftData = this.activeRoute.snapshot.data.pageData.data.menus
          _.set(leftData, 'widgetData.logo', true)
          // _.set(leftData, 'widgetData.logoPath', _.get(this.activeRoute, 'snapshot.data.department.data.logo'))
          _.set(leftData, 'widgetData.name', this.departmentName)
          _.set(leftData, 'widgetData.userRoles', this.myRoles)
          this.widgetData = leftData
          // this.widgetData['menuClick'] = (tabName: any) => {
          // }
        } else {
          this.widgetData = _.get(this.activeRoute, 'snapshot.data.pageData.data.menus')
        }

        // this.department = _.get(this.activeRoute, 'snapshot.data.department.data')
        // this.departmentName = this.department ? this.department.deptName : ''
        if (this.configService.userProfile && this.configService.userProfile.departmentName) {
          this.configService.userProfile.departmentName = this.departmentName || 'Not Available'
        }
      }
    })

  }
  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
  }

  raiseTelemetry(name: string) {
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.SIDE_NAV,
        id: `${_.camelCase(name)}-menu`,
      },
      {},
    )
  }
  ngAfterViewInit() {
    // this.elementPosition = this.menuElement.nativeElement.offsetTop
  }
  bindUrl(path: string) {
    if (path) {
      this.currentRoute = path
    }
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe()
    }
  }

}
