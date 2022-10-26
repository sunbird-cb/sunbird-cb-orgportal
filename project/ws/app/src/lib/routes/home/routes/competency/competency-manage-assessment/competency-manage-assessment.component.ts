import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService, ValueService, WidgetContentService } from '@sunbird-cb/utils'
import { v4 as uuidv4 } from 'uuid'
/* tslint:disable */
import _ from 'lodash'
import { map } from 'rxjs/operators'
import { LoaderService } from '../../../../../../../../../../src/app/services/loader.service'
import { CompetencyInfo } from '../../../models/competency.model'
import { CompetencyService } from '../competency.service'
/* tslint:enable */

@Component({
  selector: 'ws-competency-manage-assessment',
  templateUrl: './competency-manage-assessment.component.html',
  styleUrls: ['./competency-manage-assessment.component.scss'],
  providers: [LoaderService],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class CompetencyManageAssessmentComponent implements OnInit, OnDestroy {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef

  parentType = 'Competency Assessment'
  selectedNodeIdentifier = ''
  assessmentCategory = 'Competency Assessment'

  sideNavBarOpened = true
  private defaultSideNavBarOpenedSubscription: any
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  tabsData: CompetencyInfo.ICompetencyTab[] | undefined
  showBasicInfo = 'start'

  constructor(
    private route: ActivatedRoute,
    private valueSvc: ValueService,
    private configSvc: ConfigurationsService,
    private widgetContentSvc: WidgetContentService,
    private competencyAssessmentSrv: CompetencyService
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

  async showBasicInfoDiv(type: string) {
    switch (type) {
      case 'newAssessment':
        this.showBasicInfo = 'basicInfoDiv'
        break
      case 'editAssessment':
        this.selectedNodeIdentifier = 'do_1136329571243704321241'
        const getAssessmentDataRes = await this.competencyAssessmentSrv.readAssessmentQuestionSet(this.selectedNodeIdentifier).toPromise().catch(_error => { })
        if (getAssessmentDataRes && getAssessmentDataRes.params && getAssessmentDataRes.params.status.toLowerCase() === 'successful') {
          this.competencyAssessmentSrv.setAssessmentOriginalMetaHierarchy(getAssessmentDataRes.result.questionset)
          this.competencyAssessmentSrv.parentContent = getAssessmentDataRes.result.questionset.identifier
        }
        this.showBasicInfo = 'basicInfoDiv'
        break
    }

  }

  takeActionOnClose(item: any) {
    this.showBasicInfo = item
  }
}
