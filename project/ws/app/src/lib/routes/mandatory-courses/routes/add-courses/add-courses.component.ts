import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MandatoryCourseService } from '../../services/mandatory-course.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import * as _ from 'lodash'
@Component({
  selector: 'ws-app-add-courses',
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.scss'],
})
export class AddCoursesComponent implements OnInit {
  bdtitles: any = []
  searchResults: any = []
  selectedCourses: any = []
  filtersList: any = []
  searchTerm: any
  previousCourses: any
  selectedCompetency: any = []
  query = ''
  courseConfig = {
    filterUsage: 'courses',
    noOfSelectionText: 'competencies selected',
    filterListText: 'Search Competencies',
    selectPlaceHolder: 'Select Competency',
    inputPlaceHolder: 'Search Course',
  }
  constructor(private mandatoryCourseSvc: MandatoryCourseService, private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.bdtitles = this.mandatoryCourseSvc.getBreadCrumbList()
    this.getSearchedData()
    this.updateBreadcrumb()
    this.previousCourses = this.mandatoryCourseSvc.getFolderInfo().children.map((course: any) => course.identifier)
  }

  searchData(filterList: any) {
    this.selectedCompetency.length = 0
    this.query = ''
    filterList.forEach((fil: any) => {
      if (fil.type === 'query') {
        this.query = fil.name
      } else {
        this.selectedCompetency.push(fil.name)
      }
    })
    this.getSearchedData()
  }

  getSearchedData() {
    const queryparam = {
      request: {
        filters: {
          contentType: ['Course'],
          primaryCategory: ['Course'],
          mimeType: [],
          source: [],
          mediaType: [],
          status: ['Live'],
          ['competencies_v3.name']: this.selectedCompetency,
          topics: [],
        },
        query: this.query,
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
      this.searchResults = this.searchResults.map((course: any) => {
        course.selected = this.previousCourses.includes(course.identifier) ? true : false
        return course
      })
    })
  }

  onSelectedCourse(course: any) {
    course.selected = !course.selected
  }

  onSelectAllCourse(selectAll: boolean) {
    this.searchResults = this.searchResults.map((course: any) => {
      course.selected = selectAll ? true : false
      return course
    })
  }

  updateBreadcrumb() {
    const data = this.mandatoryCourseSvc.getFolderInfo()
    this.bdtitles = [{ title: 'Folders', url: '/app/home/mandatory-courses' }]
    this.bdtitles.push({ title: data.name, url: `/app/mandatory-courses/${data.identifier}` })
    this.bdtitles.push({ title: this.route.snapshot.data.label, url: 'none' })
  }

  saveSelectedCourses() {
    this.selectedCourses = this.searchResults.filter((course: any) => course.selected).map((course: any) => course.identifier)
    if (!this.selectedCourses.length) {
      this.snackBar.open('Please select course', 'Close', { verticalPosition: 'bottom' })
      return
    }
    const requestParams = {
      request: {
        data: {
          nodesModified: {
            [this.route.snapshot.params.doId]: {
              isNew: false,
              root: true,
            },
          },
          hierarchy: {
            [this.route.snapshot.params.doId]: {
              root: true,
              children: [
                ...this.selectedCourses,
              ],
            },
          },
        },
      },
    }
    this.mandatoryCourseSvc.updateHierarchy(requestParams).subscribe(() => {
      this.snackBar.open(`${this.selectedCourses.length} courses added successfully`, 'Close', { verticalPosition: 'top' })
    })
  }

}
