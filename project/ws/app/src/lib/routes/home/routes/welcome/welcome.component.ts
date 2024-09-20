
import { DOCUMENT } from '@angular/common'
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
/* tslint:disable */
import _ from 'lodash'
import { environment } from '../../../../../../../../../src/environments/environment'
import { ProfileV2Service } from '../../services/home.servive'
import { dashboardEmptyData } from '../../../../../../../../../src/mdo-assets/data/data'
/* tslint:enable */
import { Router } from '@angular/router'
import { EventService } from '@sunbird-cb/utils'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
@Component({
  selector: 'ws-app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss', './bootstrap-rain.scss'],
  /* tslint:disable-next-line */
  encapsulation: ViewEncapsulation.None,
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})

export class WelcomeComponent implements OnInit, AfterViewInit, OnDestroy {
  // sliderData1!: any
  getDashboardForKM =
    '/apis/proxies/v8/dashboard/analytics/getDashboardConfig/Karmayogi'
  getDashboardForProfile =
    '/apis/proxies/v8/dashboard/analytics/getDashboardsForProfile/Karmayogi?realm=mdo'
  getChartV2 =
    '/apis/proxies/v8/dashboard/analytics/getChartV2/Karmayogi'

  resolutionFilter = 'week'
  compFilter = 'table'
  showCBPLink = false
  showKarmayogiLink = false
  deptName: any

  selectedDashboardId = ''

  currentDashboard: any = []
  dashboardEmpty = dashboardEmptyData

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private homeResolver: ProfileV2Service,
    private router: Router,
    private events: EventService) {
  }
  filterR(type: string) {
    this.resolutionFilter = type
  }
  filterComp(type: string) {
    this.compFilter = type
  }
  ngOnDestroy() {

  }
  ngOnInit() {
    this.getUserDetails()
    // this.fetchRoles()
    this.selectDashbord()
  }

  selectDashbord() {
    if (this.selectedDashboardId === '') {
      this.currentDashboard = []
      this.currentDashboard.push(this.dashboardEmpty)
    }
  }

  getUserDetails() {
    this.homeResolver.getUserDetails().subscribe((res: any) => {
      if (res.roles && res.roles.length > 0) {
        Object.keys(res.roles).forEach((key: any) => {
          const objVal = res.roles[key]
          if (objVal === 'CONTENT_CREATOR' || objVal === 'EDITOR' || objVal === 'PUBLISHER' || objVal === 'REVIEWER') {
            this.showCBPLink = true
          }
          if (objVal === 'Member') {
            this.showKarmayogiLink = true
          }
        })
      }
    })
  }
  // fetchRoles() {
  // const rolesAndAccessData: any[] = []
  // this.homeResolver.getMyDepartment().subscribe((roles: any) => {
  //   this.deptName = roles.deptName
  //   if (this.deptName) {
  // this.sliderData1 = {
  //   widgetType: 'slider',
  //   widgetSubType: 'sliderOrgBanners',
  //   style: {
  //     'border-radius': '8px',
  //   },
  //   widgetData: [
  //     {
  //       banners: {
  //         l: 'assets/images/banners/home/home_banner_l.jpg',
  //         m: 'assets/images/banners/home/home_banner_m.jpg',
  //         s: 'assets/images/banners/home/home_banner_m.jpg',
  //         xl: 'assets/images/banners/home/home_banner_xl.jpg',
  //         xs: 'assets/images/banners/home/home_banner_xl.jpg',
  //         xxl: 'assets/images/banners/home/home_banner_xl.jpg',
  //       },
  //       title: this.deptName,
  //       logo: 'assets/icons/govtlogo.jpg',
  //     },
  //   ],
  // }
  //   }
  //   roles.rolesInfo.forEach((role: { roleName: string }) => {
  //     rolesAndAccessData.push({
  //       role: role.roleName,
  //       count: roles.noOfUsers,
  //     })
  //   })
  // })
  // }

  openky() {
    this.openNewWindow()
  }
  openNewWindow(): void {
    const link = this.document.createElement('a')
    link.target = '_blank'
    link.href = environment.karmYogiPath
    link.click()
    link.remove()
  }
  openCBP() {
    this.openNewWindowCBP()
  }
  openNewWindowCBP(): void {
    const link = this.document.createElement('a')
    link.target = '_blank'
    link.href = environment.cbpPath
    link.click()
    link.remove()
  }
  ngAfterViewInit() {
  }

  viewmdoinfo(tab: any) {
    if (tab === 'leadership') {
      this.router.navigate(['/app/home/mdoinfo/leadership'])
    } else if (tab === 'staff') {
      this.router.navigate(['/app/home/mdoinfo/staff'])
    } else if (tab === 'budget') {
      this.router.navigate(['/app/home/mdoinfo/budget'])
    }
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
        id: tab,
      },
      {}
    )
  }

  dashboardClick() {
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
      },
      {}
    )
  }

  getDashboardId(value: string) {
    if (value && value !== null) {
      this.selectedDashboardId = value
    } else {
      this.currentDashboard = []
      this.currentDashboard.push(this.dashboardEmpty)
    }
  }
}
