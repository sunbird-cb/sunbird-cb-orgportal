import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { EditorService, LoaderService } from '../../../../../../../../../public-api'
import { EditorContentService } from '../../../../../services/editor-content.service'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { MatSnackBar } from '@angular/material'
import { ConfigurationsService } from '@ws-widget/utils'
import { CollectionStoreService } from '../../services/store.service'
import { NsContent } from '../../../../../../../../../../../../../library/ws-widget/collection/src/public-api'

@Component({
  selector: 'ws-auth-assessment-basic-info',
  templateUrl: './auth-assessment-basic-info.component.html',
  styleUrls: ['./auth-assessment-basic-info.component.scss'],
})
export class AuthAssessmentBasicInfoComponent implements OnChanges {

  @Output() nextTab = new EventEmitter<any>()
  @Output() assessmentData = new EventEmitter<any>()
  @Input() selectedData!: any

  hours = 0
  minutes = 0
  seconds = 0

  // showTimer = new FormControl(false);

  radioButtonData = [
    {
      id: 'AssessmentLevel',
      name: 'Overall score cutoff',
      description: 'With this selection the scores are calculated based on the overall correct answers.',
    },
    {
      id: 'SectionLevel',
      name: 'Sectional score cutoff',
      description: 'With this selection the scores are calculated based on the each section you create.',
    },
  ]

  contentForm!: FormGroup
  submittedData = false
  contentCreated = false
  metaData!: any
  isEditEnabled = false

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private contentService: EditorContentService,
    private snackBar: MatSnackBar,
    private collectionstoreService: CollectionStoreService,
    private editorService: EditorService,
    private configSvc: ConfigurationsService,
  ) { }

  ngOnChanges() {
    const contentMeta = this.contentService.getOriginalMeta(this.contentService.parentContent)
    this.isEditEnabled = (this.configSvc.userProfile && this.configSvc.userProfile.userId === contentMeta.createdBy) ? true : false
    this.createForm()
    if (this.selectedData && this.selectedData.identifier) {
      this.metaData = this.contentService.getOriginalMeta(this.selectedData.identifier)
      this.selectedData.primaryCategory = this.metaData.primaryCategory
      this.assignData()
      this.contentCreated = true
    }
  }

  createForm() {
    this.contentForm = this.formBuilder.group({
      name: ['', Validators.required],
      purpose: ['', Validators.required],
      description: ['', Validators.required],
      scoreCutoffType: ['AssessmentLevel', Validators.required],
      expectedDuration: [0],
      showTimer: [false],
      totalQuestions: 0,
      maxQuestions: 0,
    })
  }

  get cf() {
    return this.contentForm.controls
  }

  submitToSave() {
    if (!this.contentForm.invalid) {
      this.submittedData = true
      this.loaderService.changeLoad.next(true)
      const item = {
        type:
          (NsContent.EPrimaryCategory.FINALASSESSMENT === this.selectedData.primaryCategory) ? 'finalAssessment' : 'practiceQuestionSet',
        name: this.contentForm.controls['name'].value,
        purpose: this.contentForm.controls['purpose'].value,
        description: this.contentForm.controls['description'].value,
        scoreCutoffType: this.contentForm.controls['scoreCutoffType'].value,
        expectedDuration: this.contentForm.controls['expectedDuration'].value,
        showTimer: (this.contentForm.controls['showTimer'].value) ? 'Yes' : 'No',
        maxQuestions: 0,
        totalQuestions: 0,
      }
      this.assessmentData.emit(item)
    }
  }

  async assignData() {
    this.contentForm.setValue({
      name: (this.metaData.name) ? this.metaData.name : '',
      purpose: (this.metaData.purpose) ? this.metaData.purpose : '',
      description: (this.metaData.description) ? this.metaData.description : '',
      scoreCutoffType: (this.metaData.scoreCutoffType) ? this.metaData.scoreCutoffType : '',
      expectedDuration: (this.metaData.expectedDuration) ? this.metaData.expectedDuration : '',
      showTimer: (this.metaData.showTimer && this.metaData.showTimer.toLowerCase() === 'yes') ? true : false,
      totalQuestions: (this.metaData.totalQuestions) ? this.metaData.totalQuestions : 0,
      maxQuestions: (this.metaData.maxQuestions) ? this.metaData.maxQuestions : 0,
    })
    this.setDuration(this.metaData.expectedDuration)
  }

  nextTabNaV() {
    const item = {
      isParentCreated: this.contentCreated,
      action: 'next',
    }
    this.nextTab.emit(item)
  }

  async updateContent() {
    let flag = 0
    const editiedMeta = <any>{}
    const nodesModify: any = {}
    Object.keys(this.contentForm.value).forEach((element: any) => {
      if (this.contentForm.controls[element].value !== this.metaData[element]) {
        if (element === 'showTimer') {
          editiedMeta[element as keyof any] = (this.contentForm.controls[element].value) ? 'Yes' : 'No'
        } else {
          editiedMeta[element as keyof any] = this.contentForm.controls[element].value
        }
      } else {
        flag += 1
      }
    })
    if (flag === Object.keys(this.contentForm.value).length) {
      this.showTosterMessage('upToDate')
    } else if (flag > 0) {
      this.loaderService.changeLoad.next(true)
      nodesModify[this.selectedData.identifier] = {
        isNew: false,
        root: true,
        metadata: editiedMeta,
      }
      const requestPayload = {
        request: {
          data: {
            nodesModified: nodesModify,
            hierarchy: this.collectionstoreService.getAssessmentTreeHierarchy(this.selectedData.identifier),
          },
        },
      }
      const updateResData = await this.editorService.updateAssessmentHierarchy(requestPayload).toPromise().catch(_error => { })
      if (updateResData && updateResData.params && updateResData.params.status === 'successful') {
        const readContentRes = await this.editorService.readcontentV3(this.contentService.parentContent).toPromise().catch(_error => { })
        if (readContentRes && readContentRes.identifier) {
          this.contentService.resetOriginalMetaWithHierarchy(readContentRes)
          const assessmentHierarchy =
            await this.editorService.getAssessmentHierarchy(this.selectedData.identifier).toPromise().catch(_error => { })
          if (assessmentHierarchy && assessmentHierarchy.params && assessmentHierarchy.params.status === 'successful') {
            this.contentService.assessmentOriginalContent = {}
            this.contentService.setAssessmentOriginalMetaHierarchy(assessmentHierarchy.result.questionSet)
          }
        }
        this.loaderService.changeLoad.next(false)
        this.showTosterMessage('success')
      } else {
        this.loaderService.changeLoad.next(false)
        this.showTosterMessage('fail')
      }
    }
  }

  showTosterMessage(type: string) {
    switch (type) {
      case 'success':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.SAVE_SUCCESS,
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
      case 'upToDate':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.UP_TO_DATE,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
    }
  }

  checkTimerAction() {
    if (!this.contentForm.controls['showTimer'].value) {
      this.contentForm.controls['expectedDuration'].setValue(0)
      this.setDuration(0)
    }
    this.contentForm.controls['showTimer'].setValue(!this.contentForm.controls['showTimer'].value)
  }

  timeToSeconds() {
    let total = 0
    total += this.seconds ? (this.seconds < 60 ? this.seconds : 59) : 0
    total += this.minutes ? (this.minutes < 60 ? this.minutes : 59) * 60 : 0
    total += this.hours ? this.hours * 60 * 60 : 0
    this.contentForm.controls.expectedDuration.setValue(total)
  }

  setDuration(seconds: any) {
    const minutes = seconds > 59 ? Math.floor(seconds / 60) : 0
    const second = seconds % 60
    this.hours = minutes ? (minutes > 59 ? Math.floor(minutes / 60) : 0) : 0
    this.minutes = minutes ? minutes % 60 : 0
    this.seconds = second || 0
  }

}
