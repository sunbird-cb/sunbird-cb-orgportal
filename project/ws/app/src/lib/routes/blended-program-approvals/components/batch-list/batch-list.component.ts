import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import moment from 'moment'
import { BlendedApporvalService } from '../../services/blended-approval.service'

@Component({
  selector: 'ws-app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss'],
})
export class BatchListComponent implements OnInit {
  programData: any
  programID: any
  breadcrumbs: any
  userProfile: any
  batchesList: any = []
  arcBatchList: any = []


  constructor(private router: Router, private activeRouter: ActivatedRoute, private bpService: BlendedApporvalService) {
    const currentState = this.router.getCurrentNavigation()
    this.programID = this.activeRouter.snapshot.params.id
    if (this.activeRouter.parent && this.activeRouter.parent.snapshot.data.configService) {
      this.userProfile = this.activeRouter.parent.snapshot.data.configService.unMappedUser
    }
    if (currentState && currentState.extras.state) {
      this.programData = currentState.extras.state
      if (this.programData && this.programData.name) {
        this.breadcrumbs = {
          titles: [{ title: 'Blended programs', url: '/app/home/blended-approvals' },
          { title: this.programData.name, url: 'none' }],
        }
        if (this.programData.batches) {
          const today = moment(new Date())
          this.programData.batches.forEach((b: any) => {
            // b.newrequestsCount = this.getNewRequestsList(b.batchId)
            const allowedBatch = today.isSameOrBefore(moment(b.endDate || new Date()), 'day')
            const archivedBatch = today.isAfter(moment(b.endDate || new Date()), 'day')
            if (allowedBatch) {
              this.batchesList.push(b)
            } else if (archivedBatch) {
              this.arcBatchList.push(b)
            }
            const request = {
              serviceName: 'blendedprogram',
              applicationStatus: 'SEND_FOR_MDO_APPROVAL',
              applicationIds: [b.batchId],
              limit: 100,
              offset: 0,
              deptName: this.userProfile.channel,
            }
            // b.newrequestsCount = Math.floor(Math.random() * (100 - 0 + 0)) + 0
            b.learnersCount = 0
            this.bpService.getRequests(request).subscribe((resnew: any) => {
              if (resnew && resnew.result && resnew.result.data && resnew.result.data.length > 0) {
                b.newrequestsCount = resnew.result.data.length
              }
            })
            this.bpService.getLearners(b.batchId, this.userProfile.channel).subscribe((r: any) => {
              if (r && r.length > 0) {
                b.learnersCount = r.length
              }
            })
          })
        }
      }
    } else if (this.programID) {
      this.getBPDetails(this.programID)
    }
  }

  ngOnInit() { }

  viewDetails(batch: any) {
    this.router.navigate([`/app/blended-approvals/${this.programID}/batches/${batch.batchId}`], { state: batch })
  }

  getBPDetails(programID: any) {
    this.bpService.getBlendedProgramsDetails(programID).subscribe((res: any) => {
      this.programData = res.result.content
      if (this.programData && this.programData.name) {
        this.breadcrumbs = {
          titles: [{ title: 'Blended programs', url: '/app/home/blended-approvals' },
          { title: this.programData.name, url: 'none' }],
        }

        if (this.programData.batches) {
          const today = moment(new Date())
          this.programData.batches.forEach((b: any) => {
            const allowedBatch = today.isSameOrBefore(moment(b.endDate || new Date()), 'day')
            const archivedBatch = today.isAfter(moment(b.endDate || new Date()), 'day')
            // b.newrequestsCount = this.getNewRequestsList(b.batchId)
            if (allowedBatch) {
              this.batchesList.push(b)
            } else if (archivedBatch) {
              this.arcBatchList.push(b)
            }
            const request = {
              serviceName: 'blendedprogram',
              applicationStatus: 'SEND_FOR_MDO_APPROVAL',
              applicationIds: [b.batchId],
              limit: 100,
              offset: 0,
              deptName: this.userProfile.channel,
            }
            b.learnersCount = 0
            // b.newrequestsCount = Math.floor(Math.random() * (100 - 0 + 0)) + 0
            this.bpService.getRequests(request).subscribe((resnew: any) => {
              if (resnew && resnew.result && resnew.result.data && resnew.result.data.length > 0) {
                b.newrequestsCount = resnew.result.data.length
              }
            })
            this.bpService.getLearners(b.batchId, this.userProfile.channel).subscribe((r: any) => {
              if (r && r.length > 0) {
                b.learnersCount = r.length
              }
            })
          })
        }
      }
    })
  }

}
