import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MandatoryCourseService } from '../../services/mandatory-course.service'

@Component({
  selector: 'ws-app-filter-tags',
  templateUrl: './filter-tags.component.html',
  styleUrls: ['./filter-tags.component.scss'],
})
export class FilterTagsComponent implements OnInit {
  filtersList: any = []
  @Input() filterConfig: any
  @Output() removeFilterItem = new EventEmitter()
  @Output() searchFilterData = new EventEmitter()
  @Output() onselectAll = new EventEmitter()
  @Input() selectAll = false
  competeniesList: string[] = []
  selectedCompetency = []
  positions = []
  constructor(private mandatoryCourseSvc: MandatoryCourseService, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.filterConfig.filterUsage === 'members') {
      this.competeniesList = this.route.snapshot.data.pageData.data
    } else {
      this.mandatoryCourseSvc.getCompetencies().subscribe((res: any) => {
        this.competeniesList = res.responseData
      })
    }
  }

  // removeFilter(item: any) {
  //   this.removeFilterItem.emit(item)
  // }

  onSelectAll() {
    this.selectAll = !this.selectAll
    this.onselectAll.emit(this.selectAll)
  }
  onPageChange(status: boolean) {
    this.selectAll = status
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
          this.searchFilterData.emit(this.filtersList)
          return
        }
        const isExist = this.filtersList.map((fil: any) => fil.type).includes(selectedType)
        if (!isExist) {
          this.filtersList.push({ name: value, type: selectedType })
          this.getSearchedData()
          return
        }
        this.filtersList.forEach((val: any) => {
          if (val.type === selectedType) {
            val.name = value
            return
          }
          this.filtersList.push({ name: value, type: selectedType })
        })
        this.getSearchedData()
        break
    }
  }

  removeFilter(item: any) {
    this.filtersList = this.filtersList.filter((list: any) => list.name !== item.name)
    this.selectedCompetency = this.selectedCompetency.filter((fil: any) => fil !== item.name)
    this.getSearchedData()
  }
  getSearchedData() {
    this.searchFilterData.emit(this.filtersList)
  }
}
