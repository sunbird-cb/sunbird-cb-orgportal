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
  designationList:any[] = [];
  constructor(@Inject(DOCUMENT) private document: Document,
    private trainingPlanService: TrainingPlanService,
    private route: ActivatedRoute,
    private trainingPlanDataSharingService: TrainingPlanDataSharingService,
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
    this.trainingPlanDataSharingService.clearFilter.next(true);
    switch (this.from) {
      case 'content':
        event = !event ? 'Course' : event
        this.getContent(event)
        break
      case 'assignee':
        event = !event ? 'Designation' : event
        if (event === 'Designation') {
          this.getDesignations(event)
        } else if (event === 'Custom Users') {
          this.getCustomUsers(event)
        } else if (event === 'All Users') {
          this.getAllUsers(event)
        }
        break
    }
  }

  getContent(contentType: any, applyFilterObj?:any) {
    this.loadingService.changeLoaderState(true)
    if (contentType) {
      if (contentType === 'Moderated Course') {
        this.trainingPlanDataSharingService.moderatedCourseSelectStatus.next(true)
      }
      if(this.searchText) {        
          this.trainingPlanDataSharingService.clearFilter.next(true);
          applyFilterObj = {};
      }
      const filterObj = {
        "request": {
          "secureSettings": contentType === 'Moderated Course' ? true : false, // for moderated course
          "filters": {
            "primaryCategory": [contentType === 'Moderated Course' ? 'Course' : contentType],
            "organisation":  applyFilterObj && applyFilterObj['providers'] && applyFilterObj['providers'].length ? applyFilterObj['providers'] : [],
            "competencies_v5.competencyArea": applyFilterObj && applyFilterObj['competencyArea'] && applyFilterObj['competencyArea'].length ? applyFilterObj['competencyArea'] : [],
            "competencies_v5.competencyTheme": applyFilterObj && applyFilterObj['competencyTheme'] && applyFilterObj['competencyTheme'].length ? applyFilterObj['competencyTheme'] : [],
            "competencies_v5.competencySubTheme" : applyFilterObj && applyFilterObj['competencySubTheme'] && applyFilterObj['competencySubTheme'].length ? applyFilterObj['competencySubTheme'] : []
          },
          "offset": 0,
          "limit": 500,
          "query": (this.searchText) ? this.searchText : '',
          "sort_by": { "lastUpdatedOn": "desc" },
          "fields": ["name", "appIcon", "instructions", "description", "purpose", "mimeType",
            "gradeLevel", "identifier", "medium",  "resourceType",
            "primaryCategory", "contentType", "channel", "organisation", "trackable", "posterImage",
            "idealScreenSize", "learningMode", "creatorLogo", "duration", "programDuration", "version", "avgRating", "competencies_v5"]
        }
      }
      this.trainingPlanService.getAllContent(filterObj).subscribe((res: any) => {

        // if(this.trainingPlanDataSharingService.trainingPlanContentData &&
        //    this.trainingPlanDataSharingService.trainingPlanContentData['data'] &&
        //    this.trainingPlanDataSharingService.trainingPlanContentData['data']['content'] &&
        //    this.trainingPlanDataSharingService.trainingPlanContentData['data']['content'].length
        //   ) {
        //     res && res.content.map((sitem:any)=> {
        //       sitem
        //     })
        // }
        this.trainingPlanDataSharingService.trainingPlanContentData = { category: contentType, data: res }
        this.handleApiData.emit(true)
        this.loadingService.changeLoaderState(false)
      })
    }

  }

  getCustomUsers(event: any, applyFilterObj?:any) {
    this.loadingService.changeLoaderState(true)
    const rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    if(this.searchText) {      
        this.trainingPlanDataSharingService.clearFilter.next(true);
        applyFilterObj = {};
    }
    const filterObj = {
      request: {
        query: (this.searchText) ? this.searchText : '',
        filters: {
          rootOrgId,
          status: 1,
          "profileDetails.professionalDetails.designation": applyFilterObj && applyFilterObj.designation && applyFilterObj.designation.length ? applyFilterObj.designation : [],
          "profileDetails.professionalDetails.group": applyFilterObj && applyFilterObj.group && applyFilterObj.group.length ? applyFilterObj.group : [],
        },
        "fields": [
            "userId",
            "firstName",
            "rootOrgName",
            "profileDetails",
            "organisations"
        ],
        limit: 500,
        offset: 0,
      },
    }
    this.trainingPlanService.getCustomUsers(filterObj).subscribe((res: any) => {
      this.trainingPlanDataSharingService.trainingPlanAssigneeData = { category: event, data: res.content }
      this.handleApiData.emit(true)
      this.loadingService.changeLoaderState(false)
    }, (_error: any) => {
    })
  }

  getAllUsers(event: any) {
    this.trainingPlanDataSharingService.trainingPlanAssigneeData = { category: event, data: [] }
    this.handleApiData.emit(true)
  }

  getDesignations(event: any) {
    this.loadingService.changeLoaderState(true)
    this.trainingPlanService.getDesignations().subscribe((res: any) => {
      console.log('res', res)
      if(this.searchText) {
        let resArr = res.result.response.content.filter((ditem:any)=>{
          if(ditem.name.includes(this.searchText)) {
            return ditem;
          }
        })
        this.trainingPlanDataSharingService.trainingPlanAssigneeData = { category: event, data: resArr }
      } else {
        this.trainingPlanDataSharingService.trainingPlanAssigneeData = { category: event, data: res.result.response.content }
        this.designationList = res.result.response.content;
      }
      
      this.handleApiData.emit(true)
      this.loadingService.changeLoaderState(false)
    })
  }

  searchData() {
    switch (this.selectedDropDownValue) {
      case 'Course':
      case 'Standalone Assessment':
      case 'Blended program':
      case 'Curated program':
      case 'Moderated Course':
        this.getContent(this.selectedDropDownValue)
        break
      case 'Designation':
        this.getDesignations(this.selectedDropDownValue)
        break
      case 'Custom Users':
        this.getCustomUsers(this.selectedDropDownValue)
        break
      case 'All Users':
        this.getAllUsers(this.selectedDropDownValue)
        break
    }
  }

  getFilterData(event:any) {
    if(this.from == 'content') {
      this.getContent(this.selectedDropDownValue, event);
    } else {
      this.getCustomUsers(this.selectedDropDownValue, event);
    }
    
  }

}
