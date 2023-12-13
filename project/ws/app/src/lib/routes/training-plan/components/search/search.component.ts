import { Component, EventEmitter, Input, Inject, Output, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DOCUMENT } from '@angular/common'
import { TrainingPlanService } from './../../services/traininig-plan.service'
import { TrainingPlanDataSharingService } from './../../services/training-plan-data-share.service'
/* tslint:disable */
import _ from 'lodash'
@Component({
  selector: 'ws-app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() categoryData: any = []
  @Input() from: any = '';
  @Output() handleApiData = new EventEmitter();
  filterVisibilityFlag = false
  constructor(@Inject(DOCUMENT) private document: Document,
    private trainingPlanService: TrainingPlanService,
    private route: ActivatedRoute,
    private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
    // this.handleCategorySelection('');
  }

  ngOnChanges() {
    // this.handleCategorySelection('');
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
    console.log('event--', event, this.from)
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
          this.getAllUsers(event)
        }

        break
    }
  }

  getContent(contentType: any) {
    if (contentType) {
      const filterObj = {
        "request": {
          "filters": {
            "primaryCategory": ["Course"],
            "contentType": [contentType],
            "identifier": [
              "do_1139104696922521601317",
              "do_1135500940397936641158",
              "do_1139026887251066881137",
              "do_11374977269157888011298",
              "do_113545216626319360174",
              "do_1136643005068328961197",
              "do_113694464635666432153",
              "do_113882971081441280172",
              "do_113882887752704000151",
              "do_1138813223247462401116",
              "do_113703698843983872134",
              "do_1137468666262241281756",
              "do_1139084314725498881268",
              "do_113720205181059072151",
              "do_113896199910367232144",
              "do_11364656119311564815"
            ]
          },
          "offset": 0,
          "limit": 20,
          "query": "",
          "sort_by": { "lastUpdatedOn": "desc" },
          "fields": ["name", "appIcon", "instructions", "description", "purpose", "mimeType", 
          "gradeLevel", "identifier", "medium", "pkgVersion", "board", "subject", "resourceType", 
          "primaryCategory", "contentType", "channel", "organisation", "trackable", "license", "posterImage", 
          "idealScreenSize", "learningMode", "creatorLogo", "duration", "version", "avgRating", "competencies_v5"]
        }, "query": ""
      }
      this.trainingPlanService.getAllContent(filterObj).subscribe((res: any) => {
        console.log('res-->', res)

        // if(this.trainingPlanDataSharingService.trainingPlanContentData &&
        //    this.trainingPlanDataSharingService.trainingPlanContentData['data'] &&
        //    this.trainingPlanDataSharingService.trainingPlanContentData['data']['content'] &&
        //    this.trainingPlanDataSharingService.trainingPlanContentData['data']['content'].length
        //   ) {
        //     console.log('this.trainingPlanDataSharingService.trainingPlanContentData',this.trainingPlanDataSharingService.trainingPlanContentData);
        //     res && res.content.map((sitem:any)=> {
        //       sitem
        //     })
        // }

        this.trainingPlanDataSharingService.trainingPlanContentData = { category: contentType, data: res }
        this.handleApiData.emit(true)
      })
    }

  }

  getAllUsers(event: any) {
    console.log('event', event)
    const rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    const filterObj = {
      request: {
        query: '',
        filters: {
          rootOrgId,
          status: 1,
        },
        limit: 100,
        offset: 0,
      },
    }
    this.trainingPlanService.getAllUsers(filterObj).subscribe((res: any) => {
      console.log('res-->', res)
      this.trainingPlanDataSharingService.trainingPlanAssigneeData = { category: event, data: res }
      this.handleApiData.emit(true)
    })
  }

  getDesignations(event: any) {
    this.trainingPlanService.getDesignations().subscribe((res: any) => {
      console.log('res-->', res)
      this.trainingPlanDataSharingService.trainingPlanAssigneeData = { category: event, data: res.responseData }
      this.handleApiData.emit(true)
    })
  }



}
