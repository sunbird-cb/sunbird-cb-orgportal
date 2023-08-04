import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
// tslint:disable-next-line:import-name
import _ from 'lodash'
import { BlendedApporvalService } from '../../services/blended-approval.service'

@Component({
  selector: 'ws-app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.scss'],
})
export class BatchDetailsComponent implements OnInit {
  currentFilter = 'pending'
  approvedUsers: any = []
  programData: any
  programID: any
  batchID: any
  batchData: any
  breadcrumbs: any
  newUsers: any = []
  rejectedUsers: any = []
  linkData: any
  userProfile: any
  sessionDetails: any = []

  constructor(private router: Router, private activeRouter: ActivatedRoute,
    // tslint:disable-next-line:align
    private bpService: BlendedApporvalService, private snackBar: MatSnackBar) {
    const currentState = this.router.getCurrentNavigation()
    if (currentState && currentState.extras.state) {
      this.batchData = currentState.extras.state
    }
    if (this.activeRouter.parent && this.activeRouter.parent.snapshot.data.configService) {
      this.userProfile = this.activeRouter.parent.snapshot.data.configService.unMappedUser
      // console.log('this.userProfile', this.userProfile)
    }
    this.programID = this.activeRouter.snapshot.params.id
    this.batchID = this.activeRouter.snapshot.params.batchid
    if (this.programID) {
      this.getBPDetails(this.programID)
    }
  }

  ngOnInit() { }

  filter(key: 'pending' | 'approved' | 'rejected' | 'sessions') {
    switch (key) {
      case 'pending':
        this.currentFilter = 'pending'
        this.getNewRequestsList()
        break
      case 'approved':
        this.currentFilter = 'approved'
        this.getLearnersList()
        break
      case 'rejected':
        this.currentFilter = 'rejected'
        this.getRejectedList()
        break
      case 'sessions':
        this.currentFilter = 'sessions'
        this.getSessionDetails()
        break
      default:
        break
    }
  }

  getBPDetails(programID: any) {
    this.bpService.getBlendedProgramsDetails(programID).subscribe((res: any) => {
      this.programData = res.result.content
      if (!this.batchData) {
        this.programData.batches.forEach((b: any) => {
          if (b.batchId === this.batchID) {
            this.batchData = b
          }
        })
      }
      if (this.programData && this.batchData) {
        this.breadcrumbs = {
          titles: [{ title: 'Blended programs', url: '/app/home/blended-approvals' },
          { title: this.programData.name, url: `/app/blended-approvals/${this.programData.identifier}/batches` },
          { title: this.batchData.name, url: 'none' }],
        }
        this.linkData = {
          programName: this.programData.name,
          programID: this.programData.identifier,
          batchName: this.batchData.name,
          batchID: this.batchID,
        }
        this.getNewRequestsList()
      }
    })
  }

  getLearnersList() {
    this.bpService.getLearners(this.batchData.batchId).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.approvedUsers = res
      }
    })
  }

  getNewRequestsList() {
    const request = {
      serviceName: 'blendedprogram',
      applicationStatus: 'SEND_FOR_MDO_APPROVAL',
      applicationIds: [this.batchData.batchId],
      limit: 100,
      offset: 0,
      deptName: this.userProfile.channel,
    }
    this.bpService.getRequests(request).subscribe((res: any) => {
      if (res) {
        this.newUsers = res.result.data
      }
    })
  }

  getRejectedList() {
    const request = {
      serviceName: 'blendedprogram',
      applicationStatus: 'REJECTED',
      applicationIds: [this.batchData.batchId],
      limit: 100,
      offset: 0,
      deptName: this.userProfile.channel,
    }
    this.bpService.getRequests(request).subscribe((res: any) => {
      if (res) {
        this.rejectedUsers = res.result.data
      }
    })
  }

  getSessionDetails() {
    this.sessionDetails = [
      {
        title: "Intro to AI - Session 1",
        description: "Angular is an open-source, JavaScript framework written in TypeScript. Google maintains it, and its primary purpose is to develop single-page applications. As a framework, Angular has clear advantages while also providing a standard structure for developers to work with. It enables users to create large applications in a maintainable manner. Frameworks in general boost web development efficiency and performance by providing a consistent structure so that developers don’t have to keep rebuilding code from scratch. Frameworks are time savers that offer developers a host of extra features that can be added to software without requiring extra effort.",
        type: "Offline session",
        facilitator: "Rangarajan",
        localtion: "Yes",
        qrCode: "Yes"
      },
      {
        title: "Intro to Angular - Session 3",
        description: 'Angular is a popular open-source web application framework developed by Google. It is written in TypeScript and is widely used for building dynamic and robust single-page applications (SPAs). Angular provides a set of tools and features that allow developers to create complex client-side applications with ease.',
        type: "Online session",
        facilitator: "Venkat Kandagaddala",
        localtion: "No",
        qrCode: "Yes"
      }
    ]
  }

  onSubmit(event: any) {
    const actionType = event.action.toUpperCase()
    // const reqData = event.userData.wfInfo[0]
    const reqData = _.maxBy(event.userData.wfInfo, (el: any) => {
      return new Date(el.lastUpdatedOn).getTime()
    })
    const request = {
      state: 'SEND_FOR_MDO_APPROVAL',
      action: actionType,
      wfId: reqData.wfId,
      applicationId: reqData.applicationId,
      userId: reqData.userId,
      actorUserId: reqData.actorUUID,
      serviceName: 'blendedprogram',
      rootOrgId: reqData.rootOrg,
      courseId: this.programID,
      deptName: reqData.deptName,
      updateFieldValues: [
        {
          toValue: {
            name: event.userData.userInfo.first_name,
          },
        },
      ],
    }
    // tslint:disable-next-line:no-console
    console.log('request', request)
    this.bpService.updateBlendedRequests(request).subscribe((res: any) => {
      // tslint:disable-next-line:no-console
      console.log('res', res)
      if (event.action === 'Approve') {
        this.newUsers = []
        this.openSnackbar('Request is approved successfully! Further needs to be approved by program coordinator.')
        this.getNewRequestsList()
      } else {
        this.openSnackbar('Request is rejected successfully!')
        this.filter('rejected')
      }
    })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  // loadUsersView(user: any) {
  //   this.router.navigate([`/app/blended-approvals/user-profile/${user.userId}`], { state: user })
  //   // Logic to load the users-view component or navigate to its route
  //   // You can use Angular's Router or any other mechanism to load the component
  // }

}
