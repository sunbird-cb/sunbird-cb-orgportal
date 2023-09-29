import { Component, OnInit } from '@angular/core'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
// tslint:disable-next-line:import-name
import _ from 'lodash'
import { BlendedApporvalService } from '../../services/blended-approval.service'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
import { EventService } from '@sunbird-cb/utils'
import { NominateUsersDialogComponent } from '../nominate-users-dialog/nominate-users-dialog.component'
import moment from 'moment'
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
  approvalStatus: any = []
  linkData: any
  userProfile: any
  sessionDetails: any = []
  clonedNewUsers: any = []
  clonedRejectedUsers: any = []
  clonedApprovedUsers: any = []
  learnerCount = 0
  clonedApprovalStatusUsers: any = []

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

  filter(key: 'pending' | 'approved' | 'rejected' | 'sessions' | 'approvalStatus') {
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
      case 'approvalStatus':
        this.currentFilter = 'approvalStatus'
        this.getApprovalStatusList()
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
          approvalType: this.programData.wfApprovalType,
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
        this.learnerCount = res.length
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

    this.bpService.getLearners(this.batchData.batchId).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.learnerCount = res.length
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

  getApprovalStatusList() {
    const request = {
      serviceName: ['blendedprogram'],
      applicationStatus: ['SEND_FOR_PC_APPROVAL', 'SEND_FOR_MDO_APPROVAL', 'REJECTED', 'REMOVED'],
      applicationIds: [this.batchData.batchId],
      limit: 100,
      offset: 0,
      deptName: [this.userProfile.channel],
    }
    this.bpService.getSerchRequests(request).subscribe((res: any) => {
      if (res) {
        this.approvalStatus = res.result.data
        this.clonedApprovalStatusUsers = res.result.data
        this.getActionType()
      }
    })
  }

  getSessionDetails() {
    this.sessionDetails = this.batchData.batchAttributes.sessionDetails_v2
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
      comment: event.comment,
      updateFieldValues: [
        {
          toValue: {
            name: event.userData.userInfo.first_name,
          },
        },
      ],
    }
    this.bpService.updateBlendedRequests(request).subscribe((res: any) => {
      // tslint:disable-next-line:no-console
      console.log('res', res)
      if (event.action === 'Approve') {
        this.newUsers = []
        if (this.programData.wfApprovalType) {
          this.openSnackbar(this.requestMesages())
        }
        this.getNewRequestsList()
      } else {
        this.getLearnersList()
        this.openSnackbar('Request is rejected successfully!')
        this.filter('rejected')
      }
    })
  }

  requestMesages() {
    if (this.programData.wfApprovalType === 'oneStepMDOApproval') {
      return 'Request is approved successfully'
    }
    return 'Request is approved successfully! Further needs to be approved by program coordinator.'

  }

  removeUser(event: any) {
    const actionType = event.action.toUpperCase()
    const request = {
      rootOrgId: this.userProfile.rootOrgId,
      userId: event.userData.user_id,
      actorUserId: this.userProfile.userId,
      state: 'APPROVED',
      action: actionType,
      applicationId: this.batchID,
      serviceName: 'blendedprogram',
      courseId: this.programID,
      deptName: event.userData.department,
      comment: event.comment,
      updateFieldValues: [{
        toValue: { name: event.userData.first_name },
      }],
    }
    this.bpService.removeLearner(request).subscribe((res: any) => {
      this.openSnackbar('Learner is removed successfully!')
      this.filter('approved')
      // tslint:disable-next-line:no-console
      console.log(res)
      this.getLearnersList()
    }, (err: { error: any }) => {
      // tslint:disable-next-line:no-console
      console.log('request', err)
      this.openSnackbar('Something went wrong. Please try after sometime.')
    })
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
        learners: this.approvedUsers,
        wfApprovalType: this.programData.wfApprovalType,
      },
      disableClose: true,
      autoFocus: false,
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
    return moment(moment().format('YYYY-MM-DD')).isBefore(moment(startDate))
  }

  allowToNominate() {
    return moment(moment().format('YYYY-MM-DD')).isSameOrBefore(moment(this.batchData.enrollmentEndDate))
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

  filterApprovalStatusUsers(searchText: string) {
    if (searchText.length > 0) {
      this.approvalStatus = this.approvalStatus.filter((result: any) => {
        if (result.userInfo) {
          return result.userInfo.first_name.toLowerCase().includes(searchText.toLowerCase())
        }
      })
    } else {
      this.approvalStatus = this.clonedApprovalStatusUsers
    }
  }

  onSearchLearners(searchText: string) {
    if (this.currentFilter === 'pending') {
      this.filterNewUsers(searchText)
    } else if (this.currentFilter === 'approved') {
      this.filterApprovedUsers(searchText)
    } else if (this.currentFilter === 'rejected') {
      this.filterRejectedUsers(searchText)
    } else if (this.currentFilter === 'approvalStatus') {
      this.filterApprovalStatusUsers(searchText)
    }
  }

  showLearners() {
    if (this.batchData && this.batchData.batchAttributes && this.batchData.batchAttributes.currentBatchSize) {
      return `${this.learnerCount}/${this.batchData.batchAttributes.currentBatchSize}`
    }
    return this.learnerCount
  }

  getActionType() {
    if (this.approvalStatus && this.approvalStatus.length > 0) {
      this.approvalStatus.forEach((element: any) => {
        if (element && element.wfInfo.length > 0) {
          element.wfInfo = _.sortBy(element.wfInfo, ['lastUpdatedOn'])
          let lastModify = (element.wfInfo[element.wfInfo.length - 1].modificationHistory) ?
            JSON.parse(element.wfInfo[element.wfInfo.length - 1].modificationHistory) : []
          if (element.wfInfo[element.wfInfo.length - 1].currentStatus === 'REJECTED' && lastModify.length > 0) {
            lastModify = lastModify.filter((v: any) => v.action === 'REJECT')
            element['approvalAction'] = (lastModify[lastModify.length - 1].role === 'MDO_ADMIN') ? 'rejectedByMdo' :
              (lastModify[lastModify.length - 1].role === 'PROGRAM_COORDINATOR') ? 'rejectedByPc' : ''
          } else if (element.wfInfo[element.wfInfo.length - 1].currentStatus === 'SEND_FOR_MDO_APPROVAL') {
            element['approvalAction'] = 'pendingForMdo'
          } else if (element.wfInfo[element.wfInfo.length - 1].currentStatus === 'SEND_FOR_PC_APPROVAL') {
            element['approvalAction'] = 'pendingForPc'
          } else if (element.wfInfo[element.wfInfo.length - 1].currentStatus === 'REMOVED' && lastModify.length > 0) {
            lastModify = lastModify.filter((v: any) => v.action === 'REMOVE')
            element['approvalAction'] = (lastModify[lastModify.length - 1].role === 'MDO_ADMIN') ? 'removeByMdo' :
              (lastModify[lastModify.length - 1].role === 'PROGRAM_COORDINATOR') ? 'removeByPc' : ''
          }
        }
      })
    }
  }
}
