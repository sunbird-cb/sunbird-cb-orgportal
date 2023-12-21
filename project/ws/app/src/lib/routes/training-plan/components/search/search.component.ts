import { Component, EventEmitter, Input, Inject, Output, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DOCUMENT } from '@angular/common'
import { TrainingPlanService } from './../../services/traininig-plan.service'
import { TrainingPlanDataSharingService } from './../../services/training-plan-data-share.service'
/* tslint:disable */
import _ from 'lodash'
import { LoaderService } from '../../../../../../../../../src/app/services/loader.service'
@Component({
  selector: 'ws-app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() categoryData: any = []
  @Input() from: any = '';
  @Output() handleApiData = new EventEmitter();
  searchText = ''
  filterVisibilityFlag = false
  clearFilter = false;
  selectedDropDownValue: any
  constructor(@Inject(DOCUMENT) private document: Document,
    private trainingPlanService: TrainingPlanService,
    private route: ActivatedRoute,
    private tpdsSvc: TrainingPlanDataSharingService,
    private loadingService: LoaderService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  openFilter() {
    this.filterVisibilityFlag = true
    if (this.document.getElementById('top-nav-bar')) {
      const ele: any = this.document.getElementById('top-nav-bar')
      ele.style.zIndex = '1'
    }

  }

  hideFilter(event: any) {
    this.filterVisibilityFlag = event
    if (this.document.getElementById('top-nav-bar')) {
      const ele: any = this.document.getElementById('top-nav-bar')
      ele.style.zIndex = '1000'
    }
  }

  handleCategorySelection(event: any) {
    this.selectedDropDownValue = event
    this.tpdsSvc.clearFilter.next(true)
    switch (this.from) {
      case 'content':
        event = !event ? 'Course' : event
        this.getContent(event)
        break
      case 'assignee':
        event = !event ? 'Designation' : event
        if (event === 'Designation') {
          this.getDesignations(event)
        } else if (event === 'CustomUser') {
          this.getCustomUsers(event)
        } else if (event === 'AllUser') {
          this.getAllUsers(event)
        }
        break
    }
  }

  getContent(contentType: any, applyFilterObj?: any) {
    this.loadingService.changeLoaderState(true)
    if (contentType) {
      if (contentType === 'Moderated Course') {
        this.tpdsSvc.moderatedCourseSelectStatus.next(true)
      }
      const filterObj = {
        "request": {
          "secureSettings": contentType === 'Moderated Course' ? true : false, // for moderated course
          "filters": {
            "primaryCategory": [contentType === 'Moderated Course' ? 'Course' : contentType],
            "organisation": applyFilterObj && applyFilterObj['providers'].length ? applyFilterObj['providers'] : [],
            "competencies_v5.competencyArea": applyFilterObj && applyFilterObj['competencyArea'].length ? applyFilterObj['competencyArea'] : [],
            "competencies_v5.competencyTheme": applyFilterObj && applyFilterObj['competencyTheme'].length ? applyFilterObj['competencyTheme'] : [],
            "competencies_v5.competencySubTheme": applyFilterObj && applyFilterObj['competencySubTheme'].length ? applyFilterObj['competencySubTheme'] : []
          },
          "offset": 0,
          "limit": 20,
          "query": (this.searchText) ? this.searchText : '',
          "sort_by": { "lastUpdatedOn": "desc" },
          "fields": ["name", "appIcon", "instructions", "description", "purpose", "mimeType",
            "gradeLevel", "identifier", "medium", "pkgVersion", "board", "subject", "resourceType",
            "primaryCategory", "contentType", "channel", "organisation", "trackable", "license", "posterImage",
            "idealScreenSize", "learningMode", "creatorLogo", "duration", "programDuration", "version", "avgRating", "competencies_v5"]
        }, "query": ""
      }
      this.trainingPlanService.getAllContent(filterObj).subscribe((res: any) => {
        if (this.tpdsSvc.trainingPlanContentData.data && this.tpdsSvc.trainingPlanContentData.data.content) {
          this.tpdsSvc.trainingPlanContentData = {
            category: contentType,
            data: { content: _.uniqBy(_.concat(this.tpdsSvc.trainingPlanContentData.data.content, res.content), 'identifier') }
          }
        } else {
          this.tpdsSvc.trainingPlanContentData = { category: contentType, data: res }
        }
        this.handleApiData.emit(true)
        this.loadingService.changeLoaderState(false)
      })
    }

  }

  getCustomUsers(event: any) {
    this.loadingService.changeLoaderState(true)
    const rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    const filterObj = {
      request: {
        query: (this.searchText) ? this.searchText : '',
        filters: {
          rootOrgId,
          status: 1,
        },
        limit: 100,
        offset: 0,
      },
    }
    this.trainingPlanService.getCustomUsers(filterObj).subscribe((res: any) => {
      this.tpdsSvc.trainingPlanAssigneeData = { category: event, data: res.content }
      this.handleApiData.emit(true)
      this.loadingService.changeLoaderState(false)
    }, (_error: any) => {
    })
  }

  getAllUsers(event: any) {
    this.tpdsSvc.trainingPlanAssigneeData = { category: event, data: [] }
    this.handleApiData.emit(true)
  }

  getDesignations(event: any) {
    this.loadingService.changeLoaderState(true)
    this.trainingPlanService.getDesignations().subscribe((res: any) => {
      console.log('res', res)
      this.tpdsSvc.trainingPlanAssigneeData = { category: event, data: res.result.response.content }
      this.handleApiData.emit(true)
      this.loadingService.changeLoaderState(false)
    })
  }

  searchData() {
    switch (this.selectedDropDownValue) {
      case 'Course':
      case 'Program':
      case 'Blended program':
      case 'Curated program':
      case 'Moderated Course':
        this.getContent(this.selectedDropDownValue)
        break
      case 'Designation':
        this.getDesignations(this.selectedDropDownValue)
        break
      case 'CustomUser':
        this.getCustomUsers(this.selectedDropDownValue)
        break
      case 'AllUser':
        this.getAllUsers(this.selectedDropDownValue)
        break
    }
  }

  getFilterData(event: any) {
    this.getContent(this.selectedDropDownValue, event)
  }

}
