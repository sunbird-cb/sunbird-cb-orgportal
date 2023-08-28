import { Component, OnInit } from '@angular/core'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
// tslint:disable-next-line:import-name
import _ from 'lodash'
import { BlendedApporvalService } from '../../services/blended-approval.service'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
import { EventService } from '@sunbird-cb/utils'
import { NominateUsersDialogComponent } from '../nominate-users-dialog/nominate-users-dialog.component'

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
  clonedNewUsers: any = []
  clonedRejectedUsers: any = []
  clonedApprovedUsers: any = []

  constructor(private router: Router, private activeRouter: ActivatedRoute,
    // tslint:disable-next-line:align
    private bpService: BlendedApporvalService,
    private snackBar: MatSnackBar,
    private events: EventService,
    private dialogue: MatDialog) {
    const currentState = this.router.getCurrentNavigation()
    if (currentState && currentState.extras.state) {
      this.batchData = currentState.extras.state
    }
    if (this.activeRouter.parent && this.activeRouter.parent.snapshot.data.configService) {
      this.userProfile = this.activeRouter.parent.snapshot.data.configService.unMappedUser
    }
    this.programID = this.activeRouter.snapshot.params.id
    this.batchID = this.activeRouter.snapshot.params.batchid
    if (this.programID) {
      this.getBPDetails(this.programID)
    }
  }

  ngOnInit() { }

  filter(key: 'pending' | 'approved' | 'rejected' | 'sessions') {
    this.approvedUsers = []
    this.rejectedUsers = []
    this.newUsers = []
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
    this.raiseTelemetry(this.currentFilter, TelemetryEvents.EnumInteractSubTypes.TAB_CONTENT)
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
        this.clonedApprovedUsers = res
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
        this.clonedNewUsers = res.result.data
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
        this.clonedRejectedUsers = res.result.data
      }
    })
  }

  getSessionDetails() {
    this.sessionDetails = this.batchData.batchAttributes.sessionDetails
    // this.sessionDetails = [
    //   {
    //     title: 'Intro to Angular - Session 1',
    //     description: 'Angular is an open-source, JavaScript framework written in TypeScript. Google maintains it, and its primary purpose is to develop single-page applications. As a framework, Angular has clear advantages while also providing a standard structure for developers to work with. It enables users to create large applications in a maintainable manner. Frameworks in general boost web development efficiency and performance by providing a consistent structure so that developers don’t have to keep rebuilding code from scratch. Frameworks are time savers that offer developers a host of extra features that can be added to software without requiring extra effort.',
    //     type: 'Offline session',
    //     facilitator: 'Rangarajan',
    //     localtion: 'Yes',
    //     qrCode: 'Yes',
    //     duration: '4Hrs',
    //     date: '23 Aug 2023',
    //     time: '9:00 AM - 1:00 PM',
    //     feedbackUrl: 'https://surveymonkey.com/123456',
    //     joinLink: 'https://teams.microsoft.com/QWDDIKMV129',
    //   },
    //   {
    //     title: 'Intro to Angular - Session 2',
    //     description: 'Angular is a popular open-source web application framework developed by Google. It is written in TypeScript and is widely used for building dynamic and robust single-page applications (SPAs). Angular provides a set of tools and features that allow developers to create complex client-side applications with ease.',
    //     type: 'Online session',
    //     facilitator: 'Maximilian Schwarzmüller',
    //     localtion: 'No',
    //     qrCode: 'Yes',
    //     duration: '8Hrs',
    //     date: '31 Aug 2023',
    //     time: '9:00 AM - 5:00 PM',
    //     feedbackUrl: 'https://surveymonkey.com/67890',
    //     feedbackUrlHelpText: 'This survey won\'t take more than 2 minutes.',
    //     joinLink: 'https://teams.microsoft.com/ABCDPIKL123',
    //   },
    // ]
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

  removeUser(event: any) {
    console.log("event ", event)
    const actionType = event.action.toUpperCase()
    // const reqData = event.userData.wfInfo[0]
    const reqData = _.maxBy(event.userData.wfInfo, (el: any) => {
      return new Date(el.lastUpdatedOn).getTime()
    })
    const request = {
      state: 'APPROVED',
      action: actionType,
      wfId: reqData.wfId,
      applicationId: reqData.applicationId,
      userId: reqData.userId,
      actorUserId: reqData.actorUUID,
      serviceName: 'blendedprogram',
      rootOrgId: reqData.rootOrg,
      courseId: this.programID,
      deptName: reqData.deptName,
      comment: '',
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
  }

  raiseTelemetry(name: string, subtype: string) {
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: subtype,
        id: `${_.camelCase(name)}-tab`,
      },
      {},
    )
  }

  onNominateUsersClick(name: string) {
    this.raiseTelemetry(name, TelemetryEvents.EnumInteractSubTypes.NOMINATE_BTN)
    const dialogRef = this.dialogue.open(NominateUsersDialogComponent, {
      width: '950px',
      data: {
        orgId: this.userProfile.rootOrgId,
        courseId: this.programID,
        applicationId: this.batchData.batchId,
        learners: this.approvedUsers
      },
      disableClose: true,
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe((response: any) => {
      if (response && response === 'done') {
        this.getLearnersList()
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

  removeLearner(startDate: any) {
    const sDate: Date = new Date(startDate)
    const currentDate: Date = new Date('2023-08-11')
    return currentDate < sDate
  }

  filterNewUsers(searchText: string) {
    if (searchText.length > 0) {
      this.newUsers = this.newUsers.filter((result: any) => {
        if (result.userInfo) {
          return result.userInfo.first_name.toLowerCase().includes(searchText.toLowerCase())
        }
      })
    } else {
      this.newUsers = this.clonedNewUsers
    }
  }

  filterApprovedUsers(searchText: string) {
    if (searchText.length > 0) {
      this.approvedUsers = this.approvedUsers.filter((result: any) => {
        console.log(result)
        if (result.first_name) {
          return result.first_name.toLowerCase().includes(searchText.toLowerCase())
        }
      })
    } else {
      this.approvedUsers = this.clonedApprovedUsers
    }
  }

  filterRejectedUsers(searchText: string) {
    if (searchText.length > 0) {
      this.rejectedUsers = this.rejectedUsers.filter((result: any) => {
        if (result.userInfo) {
          return result.userInfo.first_name.toLowerCase().includes(searchText.toLowerCase())
        }
      })
    } else {
      this.rejectedUsers = this.clonedRejectedUsers
    }
  }

  onSearchLearners(searchText: string) {
    if (this.currentFilter === 'pending') {
      this.filterNewUsers(searchText)
    } else if (this.currentFilter === 'approved') {
      this.filterApprovedUsers(searchText)
    } else if (this.currentFilter === 'rejected') {
      this.filterRejectedUsers(searchText)
    }
  }

}
