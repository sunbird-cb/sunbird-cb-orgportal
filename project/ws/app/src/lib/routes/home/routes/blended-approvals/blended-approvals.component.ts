import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { BlendedService } from '../../services/blended.service'

@Component({
  selector: 'ws-app-blended-approvals',
  templateUrl: './blended-approvals.component.html',
  styleUrls: ['./blended-approvals.component.scss'],
})
export class BlendedApprovalsComponent implements OnInit {
  data: any[] = []
  currentFilter = 'toapprove'
  discussionList!: any
  discussProfileData!: any
  departName = ''
  tabledata: ITableData = {
    actions: [],
    columns: [
      { displayName: 'Program name', key: 'name' },
      { displayName: 'Batches', key: 'batchesCount' },
      { displayName: 'Learners', key: 'learners', isList: true },
      { displayName: 'New requests (Across batches)', key: 'newrequests', isList: true },
    ],
    needCheckBox: false,
    needHash: false,
    sortColumn: 'fullname',
    sortState: 'asc',
    needUserMenus: false,
  }
  configSvc: any

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private bpService: BlendedService) { }

  ngOnInit() {
    if (this.activeRouter.parent && this.activeRouter.parent.snapshot.data.configService) {
      this.configSvc = this.activeRouter.parent.snapshot.data.configService
    }
    this.getBlendedPreogramsList()
  }

  getBlendedPreogramsList() {
    const req = {
      locale: ['en'],
      query: '',
      request: {
        query: '',
        filters: {
          status: ['Live'],
          primaryCategory: ['Blended Program'],
        },
        sort_by: { lastUpdatedOn: 'desc' },
        facets: ['primaryCategory', 'mimeType'],
        limit: 1000,
        offset: 0,
      },
    }
    this.bpService.getBlendedPrograms(req).subscribe((res: any) => {
      if (res && res.result.content) {
        const resultList = res.result.content
        resultList.forEach((val: any) => {
          if (val.batches) {
            val.batchesCount = val.batches.length
            val.learners = 0
            val.newrequests = 0
          } else {
            val.batchesCount = 0
            val.learners = 0
            val.newrequests = 0
          }
        })
        this.data = resultList
      }
    })
  }

  viewDetails(event: any) {
    const id = event.identifier
    this.router.navigate([`/app/blended-approvals/${id}/batches`], { state: event })
  }

  get getTableData() {
    return this.data
  }

}
