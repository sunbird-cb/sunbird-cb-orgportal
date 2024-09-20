import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core'
// import { ActivatedRoute } from '@angular/router'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
import { LoaderService } from '../../../../../../../../../src/app/services/loader.service'
import { UsersService } from '../../../users/services/users.service'
import { MatDialog } from '@angular/material'
@Component({
  selector: 'ws-app-searchuser',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() from: any = ''
  @Input() isApprovals: any
  @Input() showApproveALL: any
  @Input() showBulkUpdate: any
  @Input() disableApproveALL: any
  @Input() currentFilter: any
  @Input() filterFacetsData: any
  @Input() forMentor: any = false
  @Output() handleApiData = new EventEmitter()
  @Output() handleapproveAll = new EventEmitter()
  searchText = ''
  filterVisibilityFlag = false
  clearFilter = false
  designationList: any[] = []
  pageIndex = 0
  pageSize = 20
  isContentLive = false
  filtersList: any
  sortOrder = ''
  constructor(
    // private route: ActivatedRoute,
    private dialog: MatDialog,
    private usersSvc: UsersService,
    private loadingService: LoaderService
  ) { }

  ngOnInit() {
    // this.usersSvc.handleContentPageChange.subscribe((pageData: any) => {
    //   if (pageData) {
    //     this.pageIndex = pageData.pageIndex
    //     this.pageSize = pageData.pageSize
    //     // this.getContent()
    //   }
    // })
  }

  openFilter() {
    this.filterVisibilityFlag = true
    this.usersSvc.filterToggle.next({ from: this.from, status: true, data: this.filterFacetsData })
    // if (this.document.getElementById('top-nav-bar')) {
    //   const ele: any = this.document.getElementById('top-nav-bar')
    //   ele.style.zIndex = '1'
    // }
  }

  hideFilter(event: any) {
    switch (event.filter) {
      case 'applyFilter':
        this.applyFilters(event)
        break
      case 'clearFilter':
        this.applyFilters(event)
        break
      case 'closeFilter':
        break
    }

    this.filterVisibilityFlag = false
    this.usersSvc.filterToggle.next({ from: '', status: false, data: this.filterFacetsData })
    // if (this.document.getElementById('top-nav-bar')) {
    //   const ele: any = this.document.getElementById('top-nav-bar')
    //   ele.style.zIndex = '1000'
    // }
  }

  getContent(applyFilterObj?: any) {
    this.loadingService.changeLoaderState(true)
    if (applyFilterObj && Object.keys(applyFilterObj).length) {
      this.searchText = ''
    }
    if (this.searchText) {
      // this.tpdsSvc.clearFilter.next({ from: 'content', status: true })
      /* tslint:disable */
      applyFilterObj = {}
      /* tslint:enable */
    }
    const filterObj = {
      request: {
        filters: {},
        offset: this.pageIndex,
        limit: this.pageSize,
        query: (this.searchText) ? this.searchText : '',
        sort_by: { lastUpdatedOn: 'desc' },
        fields: [],
      },
    }
    this.usersSvc.getAllUsers(filterObj).subscribe((res: any) => {
      if (res) {
        this.handleApiData.emit(true)
        this.loadingService.changeLoaderState(false)
      }
    })
  }

  searchData(event: any) {
    this.searchText = event.target.value
    this.emitSearchRequest()
  }

  sortData(sortOrder: string) {
    this.sortOrder = sortOrder
    this.emitSearchRequest()
  }

  emitSearchRequest() {
    const filterKeys = {
      searchText: this.searchText,
      filters: this.filtersList,
      sortOrder: this.sortOrder,
    }
    this.handleApiData.emit(filterKeys)
  }

  applyFilters(event: any) {
    this.filtersList = event.filtersList
    this.emitSearchRequest()
  }

  resetPageIndex() {
    this.pageIndex = 0
    this.pageSize = 20
  }

  approveAll() {
    this.handleapproveAll.emit()
  }

  confirmApproval(template: any) {
    const dialog = this.dialog.open(template, {
      width: '500px',
    })
    dialog.afterClosed().subscribe((v: any) => {
      if (v) {
        this.handleapproveAll.emit()
      }
    })
  }

  sort() { }
}
