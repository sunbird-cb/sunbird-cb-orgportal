import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NsContent } from '../../models/mandatory-course.models.'

@Component({
  selector: 'ws-app-mandatory-course-home',
  templateUrl: './mandatory-course.component.html',
  styleUrls: ['./mandatory-course.component.scss'],
})
export class MandatoryCourseComponent implements OnInit {
  currentCourseId!: string
  noDataConfig: NsContent.IEmptyDataDisplay = {
    image: '',
    heading: 'No course collections',
    description: 'Create an outstanding collection of courses by adding courses.',
    btnRequired: true,
    btnLink: 'choose-courses',
    btnText: 'Add Courses',
  }
  noBatchDataConfig: NsContent.IEmptyDataDisplay = {
    image: '',
    heading: "No batche's created yet",
    description: 'Create a batch to distribute courses.',
    btnRequired: true,
    btnLink: '',
    btnText: 'Create a batch',
  }
  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.currentCourseId = params['doId']
      this.noDataConfig.btnLink = `/app/mandatory-courses/${this.currentCourseId}/choose-courses`
    })
  }

}
