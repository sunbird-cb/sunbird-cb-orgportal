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
  selectAll = false
  competeniesList: string[] = ['Service oriented', 'Vigilance', 'History & Archaeology', 'Recruitment/Placement', 'Budget preparation for Ministry/ Department', 'Scenario Planning and Analysis']
  selectedCompetency = []
  filtersList: any = []
  searchTerm: any
  previousCourses: any

  constructor(private mandatoryCourseSvc: MandatoryCourseService, private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.bdtitles = this.mandatoryCourseSvc.getBreadCrumbList()
    this.getSearchedData('')
    this.updateBreadcrumb()
    this.mandatoryCourseSvc.getCompetencies().subscribe((res: any) => {
      this.competeniesList = res.responseData
    })
    this.previousCourses = this.mandatoryCourseSvc.getFolderInfo().children.map((course: any) => course.identifier)
  }

  getSearchedData(search: string) {
    const queryparam = {
      request: {
        filters: {
          contentType: ['Course'],
          primaryCategory: ['Course'],
          mimeType: [],
          source: [],
          mediaType: [],
          status: ['Live'],
          ['competencies_v3.name']: [],
          topics: [],
        },
        query: search,
        sort_by: { lastUpdatedOn: 'desc' },
        fields: [],
        facets: ['primaryCategory', 'mimeType', 'source', 'competencies_v3.name', 'topics'],
        limit: 100,
        offset: 0,
        fuzzy: true,
      }
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

  onSelectAll() {
    this.selectAll = !this.selectAll
    this.searchResults = this.searchResults.map((course: any) => {
      course.selected = this.selectAll ? true : false
      return course
    })
  }

  removeFilter(item: any) {
    switch (item.type) {
      case 'query': this.searchTerm = ''
        this.getSearchedData('')
        break
      default: break
    }
    this.filtersList = this.filtersList.filter((list: any) => list.name !== item.name)
    this.selectedCompetency = this.selectedCompetency.filter((fil: any) => fil !== item.name)
  }

  onChange(value: any, selectedType: string) {
    switch (selectedType) {
      case 'filter': if (this.selectedCompetency.length > 0) {
        this.selectedCompetency.forEach(competency => {
          if (!this.filtersList.map((fil: any) => fil.name).includes(competency)) {
            this.filtersList.push({ name: competency, type: selectedType })
          }
        })

      }
        break
      case 'query':
        if (!value) {
          this.filtersList = this.filtersList.filter((val: any) => val.type !== selectedType)
          this.getSearchedData(value)
          return
        }
        if (this.filtersList.length > 0) {
          this.filtersList.forEach((val: any) => {
            if (this.filtersList.map((fil: any) => fil.type).includes(selectedType)) {
              val.name = value
            } else {
              this.filtersList.push({ name: value, type: selectedType })
            }
          })
        } else {
          this.filtersList.push({ name: value, type: selectedType })
        }

        this.getSearchedData(value)
        break
      case 'selectAll': this.filtersList.length = 0

    }
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
      this.snackBar.open('Saved Successfully', 'Close', { verticalPosition: 'top' })
    })
  }


}
