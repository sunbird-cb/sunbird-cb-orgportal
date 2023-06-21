import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
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

  constructor(private router: Router, private activeRouter: ActivatedRoute, private bpService: BlendedApporvalService) {
    const currentState = this.router.getCurrentNavigation()
    this.programID = this.activeRouter.snapshot.params.id
    if (currentState && currentState.extras.state) {
      this.programData = currentState.extras.state
      if (this.programData && this.programData.name) {
        this.breadcrumbs = {
          titles: [{ title: 'Blended programs', url: '/app/home/blended-approvals' },
          { title: this.programData.name, url: 'none' }],
        }
        this.programData.batches.forEach((b: any) => {
          b.newrequestsCount = this.getNewRequestsList(b.batchId)
        })
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

        this.programData.batches.forEach((b: any) => {
          b.newrequestsCount = this.getNewRequestsList(b.batchId)
        })
      }
    })
  }

  getNewRequestsList(bId: any) {
    const request = {
      serviceName: 'blendedprogram',
      applicationStatus: 'SEND_FOR_MDO_APPROVAL',
      applicationIds: [bId],
      limit: 100,
      offset: 0,
      deptName: this.programData.organisation[0],
    }
    this.bpService.getRequests(request).subscribe((res: any) => {
      if (res) {
        return res.result.data.length
      }
    })
  }

}
