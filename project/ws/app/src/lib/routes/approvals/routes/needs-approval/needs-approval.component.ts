import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { NeedApprovalsService } from '../../services/need-approvals.service'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
// tslint:disable
import _ from 'lodash'
import { EventService } from '@sunbird-cb/utils'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
// tslint:enable
@Component({
  selector: 'ws-app-needs-approval',
  templateUrl: './needs-approval.component.html',
  styleUrls: ['./needs-approval.component.scss'],
})

export class NeedsApprovalComponent implements OnInit {
  @ViewChild('approveDialog', { static: false })
  approveDialog!: TemplateRef<any>
  @ViewChild('rejectDialog', { static: false })
  rejectDialog!: TemplateRef<any>
  userwfData!: any
  updatedFileds!: any
  needApprovalList: any[] = []
  userDetails: any
  changeLog!: any
  wfHistory: any[] = []
  profile!: NSProfileDataV2.IProfile
  profileData: any[] = []
  comment = ''
  listupdateFieldValues: any[] = []

  constructor(
    private needApprService: NeedApprovalsService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private events: EventService,
    public dialog: MatDialog, private matSnackBar: MatSnackBar) {
    this.activeRoute.data.subscribe((data: any) => {
      this.profileData = data.pageData.data.profileData
    })
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.userwfData = _.first(_.get(this.activeRoute.snapshot, 'data.workflowData.data.result.data'))
        if (_.get(this, 'userwfData.wfInfo')) {
          _.forEach(_.get(this, 'userwfData.wfInfo') || [], (wf: any) => {
            if (typeof wf.updateFieldValues === 'string') {
              const fields = JSON.parse(wf.updateFieldValues)
              if (fields.length > 0) {
                fields.forEach((field: any) => {
                  const labelKey = Object.keys(field.toValue)[0]
                  const feildNameObj = this.profileData.filter(userData => userData.key === labelKey)[0]

                  if (feildNameObj !== undefined) {
                    this.needApprovalList.push(
                      Object.assign({
                        wf,
                        feildName: labelKey,
                        label: feildNameObj ? feildNameObj.name : null,
                        value: field.toValue[labelKey],
                        fieldKey: field.fieldKey,
                        wfId: wf.wfId,
                      })
                    )
                  }
                })
              }
            }
          })
        }
      }
    })

  }

  ngOnInit() { }

  onClickHandleWorkflow(field: any, action: string) {
    if (action === 'APPROVE') {
      const dialogRef = this.dialog.open(this.approveDialog, {
        width: '770px',
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.onApproveOrRejectClick(req)
        } else {
          dialogRef.close()
        }
      })
    } else {
      const dialogRef = this.dialog.open(this.rejectDialog, {
        width: '770px',
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.onApproveOrRejectClick(req)
        } else {
          dialogRef.close()
        }
      })
    }
    const req = {
      action,
      state: 'SEND_FOR_APPROVAL',
      userId: field.wf.userId,
      applicationId: field.wf.applicationId,
      actorUserId: this.userwfData.userInfo.wid,
      wfId: field.wf.wfId,
      serviceName: 'profile',
      updateFieldValues: JSON.parse(field.wf.updateFieldValues),
    }
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
      },
      {
        id: field.wf.applicationId,
        type: TelemetryEvents.EnumIdtype.APPLICATION,

      }
    )
  }

  onApproveOrRejectClick(req: any) {
    req.comment = this.comment
    this.needApprService.handleWorkflow(req).subscribe(res => {
      if (res.result.data) {
        if (res.result.data.status === 'REJECTED') {
          this.openSnackBar('Request Rejected Successfully')
        }
        else {
          this.openSnackBar('Request Approved')
        }
        this.comment = ''
        this.needApprovalList = this.needApprovalList.filter(wf => wf.wfId !== res.result.data.wfIds[0])
      }
    })
  }

  private openSnackBar(message: string) {
    this.matSnackBar.open(message)
  }

  onClickAllHandleWorkflow(approvalList: any[], action: string) {
    let user1Id = ''
    let application1Id = ''

    if (approvalList && approvalList.length > 0) {
      approvalList.forEach(approvalItem => {
        user1Id = approvalItem.wf.userId
        application1Id = approvalItem.wf.applicationId
      })
    }

    if (action === 'APPROVE') {
      const dialogRef = this.dialog.open(this.approveDialog, {
        width: '770px',
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const req: any = {
            action,
            state: 'SEND_FOR_APPROVAL',
            userId: user1Id,
            actorUserId: this.userwfData.userInfo.wid,
            serviceName: 'profile',
          }

          if (approvalList.length > 0) {
            approvalList.forEach((approvalAttribute: any) => {
              this.listupdateFieldValues = JSON.parse(approvalAttribute.wf.updateFieldValues)
              req['applicationId'] = approvalAttribute.wf.applicationId
              req['wfId'] = approvalAttribute.wf.wfId
              req['updateFieldValues'] = this.listupdateFieldValues
              this.onApproveOrRejectClick(req)
            })
          }

        } else {
          dialogRef.close()
        }
      })
    } else {
      const dialogRef = this.dialog.open(this.rejectDialog, {
        width: '770px',
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const req: any = {
            action,
            state: 'SEND_FOR_APPROVAL',
            userId: user1Id,
            actorUserId: this.userwfData.userInfo.wid,
            serviceName: 'profile',
          }

          if (approvalList.length > 0) {
            approvalList.forEach((approvalAttribute: any) => {
              this.listupdateFieldValues = JSON.parse(approvalAttribute.wf.updateFieldValues)
              req['applicationId'] = approvalAttribute.wf.applicationId
              req['wfId'] = approvalAttribute.wf.wfId
              req['updateFieldValues'] = this.listupdateFieldValues
              this.onApproveOrRejectClick(req)
            })
          }
        } else {
          dialogRef.close()
        }
      })
    }

    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
      },
      {
        id: application1Id,
        type: TelemetryEvents.EnumIdtype.APPLICATION,

      }
    )

  }

}
