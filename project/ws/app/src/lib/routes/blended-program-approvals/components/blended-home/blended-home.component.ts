import { Component, OnInit } from '@angular/core'
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router'
import { ILeftMenuWithoutLogo } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
/* tslint:disable */
import * as _ from 'lodash'
/* tslint:enable */

@Component({
  selector: 'ws-app-blended-home',
  templateUrl: './blended-home.component.html',
  styleUrls: ['./blended-home.component.scss'],
})
export class BlendedHomeComponent implements OnInit {
  currentRoute = 'blended-approvals'
  myRoles!: Set<string>
  widgetData!: NsWidgetResolver.IWidgetData<ILeftMenuWithoutLogo>
  // isLtMedium$ = this.valueSvc.isLtMedium$
  // mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  private defaultSideNavBarOpenedSubscription: any
  public screenSizeIsLtMedium = false
  sideNavBarOpened = true
  role: any

  constructor(private router: Router, private activeRoute: ActivatedRoute) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.bindUrl(event.urlAfterRedirects.replace('/app/blended-approvals/', ''))
        const fullProfile = _.get(this.activeRoute.snapshot, 'data.configService')
        const departmentName = fullProfile ? fullProfile.unMappedUser.channel : ''
        // if (this.activeRoute.snapshot.data.department.data) {
        if (fullProfile) {
          const leftData = this.activeRoute.snapshot.data.pageData.data.menus
          _.set(leftData, 'widgetData.logo', true)
          // _.set(leftData, 'widgetData.logoPath', _.get(this.activeRoute, 'snapshot.data.department.data.logo'))
          _.set(leftData, 'widgetData.name', departmentName)
          _.set(leftData, 'widgetData.userRoles', this.myRoles)
          this.widgetData = leftData
        } else {
          this.widgetData = this.activeRoute.snapshot.data.pageData.data.menus
        }
      }
    })
  }

  ngOnInit() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

  bindUrl(path: string) {
    if (path) {
      this.currentRoute = path
    }
  }
}
