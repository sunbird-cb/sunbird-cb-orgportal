import { Component, Input, OnChanges } from '@angular/core'
import { v4 as uuidv4 } from 'uuid'
import { MatSnackBar } from '@angular/material'
import { LoaderService } from '../../../../../../../../../../../src/app/services/loader.service'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { Notify } from '../../quiz/shared/notificationMessage'
import { NOTIFICATION_TIME } from '../../quiz/constants/quiz-constants'
import { CompetencyService } from '../../competency.service'
import { NotificationComponent } from '../../../../components/notification/notification.component'

@Component({
  selector: 'ws-auth-assessment-add-question',
  templateUrl: './auth-assessment-add-question.component.html',
  styleUrls: ['./auth-assessment-add-question.component.scss'],
})
export class AuthAssessmentAddQuestionComponent implements OnChanges {

  @Input() selectedData!: any

  contentData: any
  listOfSection: any = []
  isEditEnabled = false

  constructor(
    private loaderService: LoaderService,
    private snackBar: MatSnackBar,
    private configSvc: ConfigurationsService,
    private competencyAssessmentSrv: CompetencyService,
  ) { }

  async ngOnChanges() {
    const contentMeta = this.competencyAssessmentSrv.getAssessmentOriginalMeta(this.competencyAssessmentSrv.parentContent)
    this.isEditEnabled = (this.configSvc.userProfile && this.configSvc.userProfile.userId === contentMeta.createdBy) ? true : false
    this.isEditEnabled = true
    this.listOfSection = []
    if (this.selectedData && this.selectedData.identifier) {
      this.loaderService.changeLoad.next(true)
      const assessmentDataRes: any =
        await this.competencyAssessmentSrv.getAssessmentHierarchy(this.selectedData.identifier).toPromise().catch(_error => { })
      if (assessmentDataRes && assessmentDataRes.params && assessmentDataRes.params.status === 'successful') {
        this.loaderService.changeLoad.next(false)
        this.competencyAssessmentSrv.assessmentOriginalContent = {}
        this.competencyAssessmentSrv.setAssessmentOriginalMetaHierarchy(assessmentDataRes.result.questionSet)
      } else {
        this.loaderService.changeLoad.next(true)
        this.showMessage('fail')
      }
      this.contentData = this.competencyAssessmentSrv.getAssessmentOriginalMeta(this.selectedData.identifier)
      if (this.contentData && this.contentData.children && this.contentData.children.length > 0) {
        this.contentData.children.forEach((element: any) => {
          this.listOfSection.push(element.identifier)
        })
      }
    }
    if (this.listOfSection.length === 0) {
      this.listOfSection.push(uuidv4())
    }
  }

  showMessage(item: string) {
    switch (item) {
      case 'createParent':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.CREATE_CONTENT,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'fail':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.SAVE_FAIL,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
    }

  }

  addSectionContent() {
    this.listOfSection.push(uuidv4())
  }

  takeSectionSaveAction(item: any) {
    this.listOfSection[this.listOfSection.indexOf(Object.keys(item)[0])] = Object.values(item)[0]
  }

  takeDeleteAction(item: any) {
    this.listOfSection = this.listOfSection.filter((v: any) => v !== item)
  }
}
