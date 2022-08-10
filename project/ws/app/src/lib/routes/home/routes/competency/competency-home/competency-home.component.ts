import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService, ValueService, WidgetContentService } from '@sunbird-cb/utils'
/* tslint:disable */
import _ from 'lodash'
import { map } from 'rxjs/operators'
import { LoaderService } from '../../../../../../../../../../src/app/services/loader.service'
import { CompetencyInfo } from '../../../models/competency.model'
/* tslint:enable */

@Component({
  selector: 'ws-competency-home',
  templateUrl: './competency-home.component.html',
  styleUrls: ['./competency-home.component.scss'],
  providers: [LoaderService],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class CompetencyHomeComponent implements OnInit, OnDestroy {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  sideNavBarOpened = true
  private defaultSideNavBarOpenedSubscription: any
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  tabsData: CompetencyInfo.ICompetencyTab[] | undefined

  constructor(
    private route: ActivatedRoute,
    private valueSvc: ValueService,
    private configSvc: ConfigurationsService,
    private widgetContentSvc: WidgetContentService
  ) {
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }
  ngOnInit() {
    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    this.getMDOInfoConfig()
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
  }

  getMDOInfoConfig() {
    const url = `${this.configSvc.sitePath}/feature/competency-assessment.json`
    this.widgetContentSvc.fetchConfig(url).subscribe(
      config => {
        this.tabsData = config.tabs
      },
      _err => { })
  }

}
