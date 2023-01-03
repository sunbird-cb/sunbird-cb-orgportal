import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MandatoryCourseService } from '../../services/mandatory-course.service'

@Component({
  selector: 'ws-app-add-courses',
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.scss']
})
export class AddCoursesComponent implements OnInit {
  bdtitles: any = []
  searchResults: any = []
  selectedCourses: any = []
  selectAll: boolean = false
  competeniesList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato']
  selectedCompetency = []
  filtersList: any = []
  constructor(private mandatoryCourseSvc: MandatoryCourseService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.bdtitles = this.mandatoryCourseSvc.getBreadCrumbList()
    this.getSearchedData('')
    this.updateBreadcrumb()
    this.mandatoryCourseSvc.getCompetencies().subscribe((res: any) => {
      this.competeniesList = res.responseData
    })
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
          'competencies_v3.name': [],
          topics: [],
        },
        query: search,
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
        course.selected = false
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
    this.filtersList = this.filtersList.filter((list: any) => list.name !== item.name)
    console.log(this.filtersList)
    this.selectedCompetency = this.selectedCompetency.filter((fil: any) => fil != item.name)
  }

  onChange(value: any, selectedType: string) {
    switch (selectedType) {
      case 'filter': if (this.selectedCompetency.length > 0) {
        this.selectedCompetency.forEach((competency) => {
          if (!this.filtersList.map((fil: any) => fil.name).includes(competency)) {
            this.filtersList.push({ name: competency, type: selectedType })
          }
        })

      }
        break
      case 'query':
        if (this.filtersList.length > 0) {
          this.filtersList.forEach((fil: any) => {
            if (this.filtersList.map((fil: any) => fil.type).includes(selectedType)) {
              fil.name = value
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
    // console.log(this.route.snapshot.params.doId)
    this.bdtitles = [{ title: 'Folders', url: '/app/home/mandatory-courses' }]
    this.mandatoryCourseSvc.getEditContent(this.route.snapshot.params.doId).subscribe((data: any) => {
      this.bdtitles.push({ title: data.result.content.name, url: `/app/mandatory-courses/${data.result.content.identifier}` })
      this.bdtitles.push({ title: this.route.snapshot.data.label, url: 'none' })
    })
  }


  saveSelectedCourses() {
    this.selectedCourses = this.searchResults.filter((course: any) => course.selected).map((course: any) => course.identifier)
    console.log(this.selectedCourses)
    this.mandatoryCourseSvc.getfolderData().subscribe((folder: any) => {
      console.log(folder)
    })
    const requestParams = {
      request: {
        data: {
          nodesModified: {
            [this.route.snapshot.params.doId]: {
              isNew: false,
              root: true
            }
          },
          hierarchy: {
            [this.route.snapshot.params.doId]: {
              root: true,
              children: [
                ...this.selectedCourses
              ]
            }
          }
        }
      }
    }
    this.mandatoryCourseSvc.updateHierarchy(requestParams).subscribe((res: any) => {
      console.log(res)
    })
  }
}
