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
    const contentData = this.route.snapshot.data['contentData'];    
    if (contentData) {
      const category = contentData.assignmentType
      this.from = 'all';
      console.log('contentData-->', contentData);
      const arr = [];      
      this.tab = this.selectedTab = 'content';
          
        if (category === 'CustomUser') {
          let assignmentDataArr:any = [];

          
          contentData && contentData.userDetails && contentData.userDetails.map((item:any)=>{
            let obj:any = {
              "firstName": "",
              "userId": "",
              "profileDetails": {"professionalDetails": [{designation: ""}]
            }};
            obj.firstName = item.firstName;
            obj.profileDetails.professionalDetails[0]['designation']= item.designation;
            obj.userId = item.userId;
            assignmentDataArr.push(obj);
          })
          console.log('assignmentDataArr',assignmentDataArr)
          // const assigneeData = contentData.userDetails;
          this.assigneeData = { category, data: assignmentDataArr }
        }
        if (category === 'Designation') {
          let assignmentDataArr:any = [];
           contentData.assignmentTypeInfo.map((item: any) => {
            assignmentDataArr.push({name:item})
          })
          this.assigneeData = { category, data: assignmentDataArr }
        }
      

      if (contentData &&
        contentData.contentList) {
          this.contentList = contentData.contentList;
        console.log(this.contentList, contentData.contentList);
      }
      if(category.toLowerCase() !== 'alluser') {
        arr.push({
          name: contentData.contentType,
          tab: 'content',
          selected: (this.tab === 'content' ? true : false),
          count: this.contentList.length
        })
        arr.push({
          name: contentData.assignmentType,
          tab: 'assignee',
          selected: (this.tab === 'assignee' ? true : false),
          count: this.assigneeData.data ? this.assigneeData.data.length : 0
        })
        this.allContentChips = arr
      } else {
        arr.push({
          name: contentData.contentType,
          tab: 'content',
          selected: (this.tab === 'content' ? true : false),
          count: this.contentList.length
        })
        this.allContentChips = arr
      }
    } else  if (this.from === 'content') {
      if (this.trainingPlanDataSharingService.trainingPlanContentData &&
        this.trainingPlanDataSharingService.trainingPlanContentData.data) {
        this.contentList = this.trainingPlanDataSharingService.trainingPlanContentData.data.content.filter((item: any) => {
          return item.selected
        })
      }
    } else if (this.from === 'assignee') {
      if(this.trainingPlanDataSharingService.trainingPlanAssigneeData) {
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
  }

  goBack() {
    this.router.navigateByUrl('/app/training-plan/create-plan')
  }

}
