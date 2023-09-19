import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import moment from 'moment'
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
      { displayName: 'Blended Program name', key: 'name' },
      { displayName: 'Batches', key: 'batchesCount' },
      // { displayName: 'Learners', key: 'learners', isList: true },
      { displayName: 'New requests (Across batches)', key: 'newrequests', isList: true },
    ],
    needCheckBox: false,
    needHash: false,
    sortColumn: 'fullname',
    sortState: 'asc',
    needUserMenus: false,
  }
  userProfile: any
  bIDs: any[] = []

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private bpService: BlendedService) { }

  ngOnInit() {
    if (this.activeRouter.parent && this.activeRouter.parent.snapshot.data.configService) {
      this.userProfile = this.activeRouter.parent.snapshot.data.configService.unMappedUser
      // console.log('this.userProfile', this.userProfile)
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
          createdFor: [this.userProfile.rootOrgId],
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
          val.batchesCount = 0
          val.newrequests = 0
          if (val.batches) {
            // val.batchesCount = val.batches.length
            const today = moment(new Date())
            const allowedBatchList: any[] = []
            const bIds: any[] = []
            val.batches.forEach((b: any) => {
              const allowedBatch = today.isSameOrBefore(moment(b.endDate || new Date()), 'day')
              if (allowedBatch) {
                allowedBatchList.push(b)
              }
            })
            val.batchesCount = allowedBatchList.length

            allowedBatchList.forEach((ab: any) => {
              bIds.push(ab.batchId)
              if (bIds.length === allowedBatchList.length) {
                const request = {
                  serviceName: 'blendedprogram',
                  applicationStatus: 'SEND_FOR_MDO_APPROVAL',
                  applicationIds: bIds,
                  limit: 100,
                  offset: 0,
                  deptName: this.userProfile.channel,
                }
                this.bpService.getRequests(request).subscribe((resnew: any) => {
                  if (resnew) {
                    val.newrequests = resnew.result.data.length
                  }
                })
              } else {
                val.newrequests = 0
              }
            })
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
