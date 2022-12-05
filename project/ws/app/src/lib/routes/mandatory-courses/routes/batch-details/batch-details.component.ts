import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NsContent } from '../../models/mandatory-course.models.'

@Component({
  selector: 'ws-app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.scss'],
})
export class BatchDetailsComponent implements OnInit {
  currentCourseId!: string
  currentBatchId!: string
  noDataConfig: NsContent.IEmptyDataDisplay = {
    image: '',
    heading: 'No members added',
    description: 'Add members to assign course',
    btnRequired: true,
    btnLink: 'choose-members',
    btnText: 'Add members',
  }
  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.currentCourseId = params['doId']
      this.currentBatchId = params['batchId']
      this.noDataConfig.btnLink = `/app/mandatory-courses/${this.currentCourseId}/batch-details/${this.currentCourseId}/choose-members`
    })
  }

}
