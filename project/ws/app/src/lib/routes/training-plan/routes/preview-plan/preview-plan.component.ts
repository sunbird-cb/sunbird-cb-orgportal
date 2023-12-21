import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
@Component({
  selector: 'ws-app-preview-plan',
  templateUrl: './preview-plan.component.html',
  styleUrls: ['./preview-plan.component.scss'],
})
export class PreviewPlanComponent implements OnInit {
  contentList: any = []
  assigneeData: any = []
  from: any = ''
  tab: any = ''
  allContentChips: any = []
  selectedTab = ''
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
    this.from = this.route.snapshot.queryParams['from']
    this.tab = this.selectedTab = this.route.snapshot.queryParams['tab']
    const contentData = this.route.snapshot.data['contentData']
    if (contentData) {
      this.from = 'all';
      console.log('contentData-->', contentData);
      const arr = []
      arr.push({
        name: contentData.contentType,
        tab: 'content',
        selected: (this.tab === 'content' ? true : false),
      })
      this.allContentChips = arr
      arr.push({
        name: contentData.assignmentType,
        tab: 'assignee',
        selected: (this.tab === 'assignee' ? true : false),
      })
      this.allContentChips = arr
      if (contentData.assignmentTypeInfo) {
        const category = contentData.assignmentType
        if (category === 'custom') {
          const assigneeData = contentData.assignmentTypeInfo.filter((item: any) => {
            return item.selected
          })
          this.assigneeData = { category, data: assigneeData }
        }
        if (category === 'Designation') {
          const assigneeData = contentData.assignmentTypeInfo.filter((item: any) => {
            return item.selected
          })
          this.assigneeData = { category, data: assigneeData }
        }
      }

      if (contentData &&
        contentData.contentList) {
          this.contentList = contentData.contentList;
        console.log(this.contentList, contentData.contentList);
      }
    } else  if (this.from === 'content') {
      if (this.trainingPlanDataSharingService.trainingPlanContentData &&
        this.trainingPlanDataSharingService.trainingPlanContentData.data) {
        this.contentData = this.trainingPlanDataSharingService.trainingPlanContentData.data.content.filter((item: any) => {
          return item.selected
        })
      }
    } else if (this.from === 'assignee') {
      const category = this.trainingPlanDataSharingService.trainingPlanAssigneeData.category
      if (category === 'Designation') {
        const assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.filter((item: any) => {
          return item.selected
        })
        this.assigneeData = { category, data: assigneeData }
      } else if (category === 'CustomUser') {
        const assigneeData = this.trainingPlanDataSharingService.trainingPlanAssigneeData.data.filter((item: any) => {
          return item.selected
        })
        this.assigneeData = { category, data: assigneeData }
      }

    }
  }

  goBack() {
    this.router.navigateByUrl('/app/training-plan/create-plan')
  }

}
