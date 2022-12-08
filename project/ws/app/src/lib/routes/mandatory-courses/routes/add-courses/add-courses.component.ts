import { Component, OnInit } from '@angular/core'
import { MandatoryCourseService } from '../../services/mandatory-course.service'

@Component({
  selector: 'ws-app-add-courses',
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.scss'],
})
export class AddCoursesComponent implements OnInit {
  bdtitles = [
    { title: 'Folders', url: '/app/home/mandatory-courses' },
    { title: 'Folder name', url: '/app/mandatory-courses/132' },
    { title: 'Choose courses', url: 'none' },
  ]
  searchResults: any = []
  constructor(private mandatoryCourseSvc: MandatoryCourseService) { }

  ngOnInit() {
    this.getSearchedData()
  }

  getSearchedData() {
    const queryparam = {
      request: {
        filters: {
          contentType: [],
          primaryCategory: [],
          mimeType: [],
          source: [],
          mediaType: [],
          status: ['Live'],
          'competencies_v3.name': [],
          topics: [],
        },
        query: '',
        sort_by: { lastUpdatedOn: 'desc' },
        fields: [],
        facets: ['primaryCategory', 'mimeType', 'source', 'competencies_v3.name', 'topics'],
        limit: 100,
        offset: 0,
        fuzzy: true,
      },
    }
    this.mandatoryCourseSvc.fetchSearchData(queryparam).subscribe((response: any) => {
      this.searchResults = response.result.content
    })
  }

}
