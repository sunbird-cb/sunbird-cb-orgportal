import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ValueService } from '@sunbird-cb/utils'
import { Notify } from '../../notificationMessage'
import { NotificationComponent } from '../../../../../../../notification/components/notification/notification.component'
import { NOTIFICATION_TIME } from '../../../constants/quiz-constants'
import { CompetencyService } from '../../../../competency.service'
import { ISearchContent } from '../../../interface/search'
import { ErrorParserComponent } from '../error-parser/error-parser.component'
import { NotificationService } from '../../../../../../../notification-v2/services/notification.service'

@Component({
  selector: 'ws-auth-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  API_ENDPOINT = {
    deleteApi: 'apis/proxies/v8/v1/content/retire',
  }
  commentsForm!: FormGroup
  contentMeta!: ISearchContent
  isSubmitPressed = false
  onAction = false
  children = 0
  isNew = 'No'
  isMobile = false
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    // private accessService: AccessControlService,
    @Inject(MAT_DIALOG_DATA) public data: ISearchContent,
    private valueSvc: ValueService,
    private notificationSvc: NotificationService,
    private competencyAssessmentSer: CompetencyService
  ) {
    dialogRef.disableClose = true
  }

  ngOnInit() {
    this.valueSvc.isXSmall$.subscribe(isMobile => (this.isMobile = isMobile))
    this.contentMeta = this.data
    this.children = this.contentMeta.children ? this.contentMeta.children.length : 0
    this.isNew = !(
      this.contentMeta.identifier.includes('.img') || this.contentMeta.status === 'Live'
    )
      ? 'Yes'
      : 'No'
    this.commentsForm = this.formBuilder.group({
      comments: ['', [Validators.required]],
      action: ['', [Validators.required]],
    })
  }

  submitData() {
    if (this.commentsForm.valid && this.commentsForm.value.action) {
      this.deleteContent()
    } else {
      this.isSubmitPressed = true
    }
  }

  deleteContent() {
    this.onAction = true
    const tempContentIds: string[] = []
    tempContentIds.push(this.contentMeta.identifier)
    const requestBody = {
      request: {
        contentIds: tempContentIds,
      },
    }
    const tempOptions = {
      body: requestBody,
    }
    const observable = this.competencyAssessmentSer.deleteContent(tempOptions)
      // this.accessService.getCategory(this.contentMeta) === 'Knowledge Board'
      //   ? this.apiService.delete(
      //     `${CONTENT_DELETE}/${this.contentMeta.identifier}/kb${this.accessService.orgRootOrgAsQuery}`,
      //   )
      //   : this.apiService.post(`${CONTENT_DELETE}${this.accessService.orgRootOrgAsQuery}`, {
      //     identifier: this.contentMeta.identifier,
      //     author: this.accessService.userId,
      //     isAdmin: this.accessService.hasRole(['editor', 'admin']),
      //     actorName: this.accessService.userName,
      //     action: 'deleted',
      //     comment: this.commentsForm.value.comments,
      //   })
      .subscribe(
        () => {
          this.dialogRef.close(true)
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.SUCCESS,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
        },
        error => {
          this.onAction = false
          if (error.status === 409) {
            this.dialog.open(ErrorParserComponent, {
              width: this.isMobile ? '90vw' : '600px',
              height: 'auto',
              data: {
                errorFromBackendData: error.error,
              },
            })
          }
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.CONTENT_FAIL,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
        },
      )
  }
}
