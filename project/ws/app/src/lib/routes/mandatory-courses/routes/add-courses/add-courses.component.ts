import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MandatoryCourseService } from '../../services/mandatory-course.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import * as _ from 'lodash'
import { FilterTagsComponent } from '../../components/filter-tags/filter-tags.component'
import { PageEvent } from '@angular/material'
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
  totalCount = 0
  pageSize = 50
  pageSizeOptions = [50, 40, 30, 20, 10]
  pageIndex = 0
  selectedItems: any = []
  @ViewChild('filterTags', { static: false }) filterTags!: FilterTagsComponent

  constructor(private mandatoryCourseSvc: MandatoryCourseService, private route: ActivatedRoute, private snackBar: MatSnackBar, private router: Router) { }

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
    this.searchResults = []
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
        limit: this.pageSize,
        offset: this.pageSize * this.pageIndex,
        fuzzy: true,
      },
    }

    this.mandatoryCourseSvc.fetchSearchData(queryparam).subscribe((response: any) => {
      // this.searchResults = response.result.content
      this.totalCount = response.result.count
      this.searchResults = response.result.content.map((course: any) => {
        if (this.isAlreadySelected(course)) {
          course.selected = true
          //  this.filterTags.onPageChange(true)
        } else {
          course.selected = false
        }
        course.selected = this.previousCourses.includes(course.identifier) ? true : false
        return course
      })
      if (this.allCoursesChecked()) {
        this.filterTags.onPageChange(true)
      } else {
        this.filterTags.onPageChange(false)
      }
    })
  }

  allCoursesChecked() {
    const checkedItems = this.searchResults.filter((res: any) => res.selected === true)
    return checkedItems.length === this.searchResults.length ? true : false
  }

  isAlreadySelected(item: any) {
    const isExist = this.selectedItems.filter((crs: any) => crs.identifier === item.identifier)
    return isExist.length > 0 ? true : false
  }
  updateSelectedCourses(csr: any) {
    if (!this.isAlreadySelected(csr) && csr.selected) {
      this.selectedItems.push(csr)
    }
    if (this.isAlreadySelected(csr) && !csr.selected) {
      this.selectedItems = this.selectedItems.filter((c: any) => csr.identifier !== c.identifier)
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.getSearchedData()
    this.filterTags.onPageChange(false)
  }
  onSelectedCourse(course: any) {
    course.selected = !course.selected
    this.updateSelectedCourses(course)
  }

  onSelectAllCourse(selectAll: boolean) {
    this.searchResults = this.searchResults.map((course: any) => {
      course.selected = selectAll ? true : false
      this.updateSelectedCourses(course)
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
      const data = this.mandatoryCourseSvc.getFolderInfo()
      this.snackBar.open(`${this.selectedCourses.length} courses added successfully`, 'Close', { verticalPosition: 'top' })
      this.router.navigate([`/app/mandatory-courses/${data.identifier}`])
    })
  }

}
