import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NsContent } from '../../models/mandatory-course.models.'
import { MatDialog } from '@angular/material'
import { AddBatchDialougeComponent } from '../../components/add-batch-dialouge/add-batch-dialouge.component'

@Component({
  selector: 'ws-app-mandatory-course-home',
  templateUrl: './mandatory-course.component.html',
  styleUrls: ['./mandatory-course.component.scss'],
})
export class MandatoryCourseComponent implements OnInit {
  currentCourseId!: string
  currentFilter = 'course-list'
  content: NsContent.IContent | null = null
  bdtitles = [{ title: 'Folders', url: '' }, { title: 'folder name', url: 'none' }]
  noDataConfig: NsContent.IEmptyDataDisplay = {
    image: 'assets/images/banners/no_data.svg',
    heading: 'No course collections',
    description: 'Create an outstanding collection of courses by adding courses.',
    btnRequired: true,
    btnLink: 'choose-courses',
    btnText: 'Add Courses',
  }
  noBatchDataConfig: NsContent.IEmptyDataDisplay = {
    image: 'assets/images/banners/no_data.svg',
    heading: `No batche's created yet`,
    description: 'Create a batch to distribute courses.',
    btnRequired: true,
    btnLink: 'none',
    btnText: 'Create a batch',
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.currentCourseId = params['doId']
      this.noDataConfig.btnLink = `/app/mandatory-courses/${this.currentCourseId}/choose-courses`
    })
  }

  filter(data: any) {
    console.log(data, 'data value---')
    if (data === 'course-list') {
      this.currentFilter = 'course-list'
    } else if (data === 'batch-list') {
      this.currentFilter = 'batch-list'
    }
  }

  openCreateBatchDialog() {
    console.log('popup btn clicked')
    this.dialog.open(AddBatchDialougeComponent, {
      width: 'auto',

      // panelClass: 'custom-dialog-container',
    })
  }

}
