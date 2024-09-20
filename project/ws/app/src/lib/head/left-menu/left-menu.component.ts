import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
// import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
// import { ILeftMenu, IMenu } from './left-menu-v1.model'
// import { defaultImg } from './img.json'
@Component({
  selector: 'ws-widget-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit, OnDestroy {
  @Input() widgetData!: any
  mdoname: any
  logo: any
  menulist: any = []
  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }
  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.mdoname = this.widgetData ? this.widgetData.widgetData.name : ''
    this.logo = this.widgetData ? this.widgetData.widgetData.logoPath : '../assets/icons/govtlogo.jpg'
    this.menulist = this.widgetData ? this.widgetData.widgetData.menusList : []
  }
  public isLinkActive(url?: string, index?: number): boolean {
    let returnVal = false
    if (url && index) {
      returnVal = (this.activatedRoute.snapshot.fragment === url)
    } else if (index === 0) {
      returnVal = true
    } else {
      returnVal = false
    }
    return returnVal
  }
  public isLinkActive2(url?: string): boolean {
    let returnval = false
    if (url) {
      const st = this.router.url.split('?')
      if (st && st[0] && st[0] === (url)) {
        returnval = true
      }
    }
    return returnval
  }
  getLink(tab: any) {
    if (tab && tab.customRouting && this.activatedRoute.snapshot && this.activatedRoute.snapshot.firstChild && tab.paramaterName) {
      return (tab.routerLink.replace('<param>', this.activatedRoute.snapshot.firstChild.params[tab.paramaterName]))
    }
    return
  }

  isAllowed(tab: any): boolean {
    let returnValue = false
    if (tab.requiredRoles && tab.requiredRoles.length > 0) {
      (tab.requiredRoles).forEach((v: any) => {
        if ((this.widgetData.userRoles || new Set()).has(v)) {
          returnValue = true
        }
      })
    } else {
      returnValue = true
    }
    return returnValue
  }
}
