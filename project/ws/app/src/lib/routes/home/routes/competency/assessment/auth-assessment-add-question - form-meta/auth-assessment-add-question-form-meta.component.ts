import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { MatDialog, MatSnackBar } from '@angular/material'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { EditorContentService } from '../../../../../services/editor-content.service'
import { QuizStoreService } from '../../../quiz/services/store.service'
import { CollectionStoreService } from '../../services/store.service'
import { EditorService } from '../../../../../services/editor.service'
import { LoaderService } from '../../../../../../../../../public-api'
import { ConfigurationsService } from '@ws-widget/utils'
import { v4 as uuidv4 } from 'uuid'
import { AuthInitService } from '../../../../../../../../services/init.service'
import { toLower, toUpper } from 'lodash'
import { ConfirmDialogComponent } from '../../../../../../../../modules/shared/components/confirm-dialog/confirm-dialog.component'
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'ws-auth-assessment-add-question-form-meta',
  templateUrl: './auth-assessment-add-question-form-meta.component.html',
  styleUrls: ['./auth-assessment-add-question-form-meta.component.scss'],
})
export class AuthAssessmentAddQuestionFormMetaComponent implements OnChanges {

  @Input() selectedData!: any
  @Input() sectionData!: any
  @Output() deleteSectionNode = new EventEmitter<any>()
  @Output() savedSectionId = new EventEmitter<any>()

  questionContentForm!: FormGroup
  questionType = ''
  contentData: any
  assessmentData!: any
  selectedQuestionNode!: string
  questionList: any = []
  questionText!: string
  answerOptions: any = []
  isEditEnabled = false
  fitbCount = 0

  constructor(
    private formBuilder: FormBuilder,
    private contentService: EditorContentService,
    private snackBar: MatSnackBar,
    private quizStoreSvc: QuizStoreService,
    private collectionstoreService: CollectionStoreService,
    private editorService: EditorService,
    private loaderService: LoaderService,
    private authInitService: AuthInitService,
    private dialog: MatDialog,
    private configSvc: ConfigurationsService,
  ) { }

  async ngOnChanges() {
    const contentMeta = this.contentService.getOriginalMeta(this.contentService.parentContent)
    this.isEditEnabled = (this.configSvc.userProfile && this.configSvc.userProfile.userId === contentMeta.createdBy) ? true : false
    this.createForm()
    if (this.selectedData && this.selectedData.identifier) {
      this.contentData = this.contentService.getAssessmentOriginalMeta(this.selectedData.identifier)
      if (this.contentData) {
        if (this.contentData.scoreCutoffType === 'AssessmentLevel') {
          this.questionContentForm.controls['name'].setValue('Default Section')
        }
        if (this.contentData.children && this.contentData.children.length > 0) {
          this.assignData()
        }
      }
    }
  }

  createForm() {
    this.questionContentForm = this.formBuilder.group({
      name: [''],
      totalQuestions: [0, Validators.required],
      maxQuestions: [0, Validators.required],
      minimumPassPercentage: [0, Validators.required],
      additionalInstructions: ['', Validators.required],
      mimeType: ['application/vnd.sunbird.questionset'],
      primaryCategory: [this.selectedData.primaryCategory],
    })

    this.questionContentForm.valueChanges.pipe(debounceTime(700)).subscribe(() => {
      if (this.questionContentForm.controls['totalQuestions'].value < this.questionContentForm.controls['maxQuestions'].value) {
        this.questionContentForm.controls['maxQuestions'].setValue('')
        this.showTosterMessage('wrongCombo')
      }
    })
  }

  async assignData() {
    this.assessmentData = this.contentService.getAssessmentOriginalMeta(this.sectionData)
    if (this.assessmentData) {
      this.questionContentForm.setValue({
        name: this.assessmentData.name,
        totalQuestions: this.assessmentData.totalQuestions,
        maxQuestions: this.assessmentData.maxQuestions,
        minimumPassPercentage: this.assessmentData.minimumPassPercentage,
        additionalInstructions: (this.assessmentData.additionalInstructions) ? this.assessmentData.additionalInstructions : '',
        mimeType: this.assessmentData.mimeType,
        primaryCategory: this.assessmentData.primaryCategory,
      })
      if (this.assessmentData.children && this.assessmentData.children.length > 0) {
        this.questionList = []
        this.assessmentData.children.forEach((element: any) => {
          this.questionList.push({
            name: element.name,
            identifier: element.identifier,
          })
        })
      }
    }
  }

  async updateSection() {
    let flag = 0
    const editiedMeta = <any>{}
    const nodesModify: any = {}
    Object.keys(this.questionContentForm.value).forEach((element: any) => {
      if (this.questionContentForm.controls[element].value !== this.assessmentData[element]) {
        editiedMeta[element as keyof any] = this.questionContentForm.controls[element].value
      } else {
        flag += 1
      }
    })
    if (flag === Object.keys(this.questionContentForm.value).length) {
      this.showTosterMessage('upToDate')
    } else if (flag > 0) {
      this.loaderService.changeLoad.next(true)
      nodesModify[this.assessmentData.identifier] = {
        isNew: false,
        root: false,
        metadata: editiedMeta,
        objectType: 'QuestionSet',
      }
      const requestPayload = {
        request: {
          data: {
            nodesModified: nodesModify,
            hierarchy: this.collectionstoreService.getAssessmentTreeHierarchy(this.selectedData.identifier),
          },
        },
      }
      this.triggerSave(requestPayload, true)
    }
  }

  get qcf() {
    return this.questionContentForm.controls
  }

  async saveSection() {
    if (this.questionContentForm.invalid) {
      this.showTosterMessage('fieldsRequried')
      return
    }
    this.loaderService.changeLoad.next(true)
    const nodesModify: any = {}
    const editiedMeta = <any>{}
    Object.keys(this.questionContentForm.value).forEach((element: any) => {
      editiedMeta[element as keyof any] = this.questionContentForm.controls[element].value
    })
    nodesModify[this.sectionData] = {
      isNew: true,
      root: false,
      objectType: 'QuestionSet',
      metadata: editiedMeta,
    }
    const requestPayload = {
      request: {
        data: {
          nodesModified: nodesModify,
          hierarchy: this.collectionstoreService.getAssessmentTreeHierarchy(this.selectedData.identifier, this.sectionData),
        },
      },
    }
    this.triggerSave(requestPayload, true)
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
      case 'fieldsRequried':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.REQURIED_FIELDS_MISSING,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'invalidMcqSca':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.MCQ_SCA_VALIDATION,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'allAnsweredSelected':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.MCQ_ALL_OPTIONS_CORRECT,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'wrongCombo':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.ASSESSMENT_WRONG_COMBO,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'maxLimitError':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.ASSESSMENT_MAX_LIMIT,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'missingAnswer':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.MISSING_ANSWER_FOR_FITB,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'McqMcaError':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.MCQ_MCA_VALIDATION,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
      case 'McqScaError':
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.MCQ_MCA_ANSWER_VALIDATION,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        break
    }
  }

  selectedQuestionType(item: any) {
    this.questionType = item.value
    this.quizStoreSvc.addQuestion(this.questionType)
  }

  addQuestionList() {
    if (this.questionList.length < this.assessmentData.totalQuestions) {
      const newUUID = uuidv4()
      this.questionList.push({
        name: 'New Question',
        identifier: newUUID,
      })
    } else {
      this.showTosterMessage('maxLimitError')
    }
  }

  updateSelectedQuiz(item: any) {
    this.answerOptions = (item && item.options) ? item.options : []
  }

  checkBlankCount(item: any) {
    switch (item.split('_').length - 1) {
      case 15: return 1
      case 30: return 2
      case 45: return 3
    }
    return 0
  }

  addBlanktoText() {
    this.fitbCount += 1
    this.questionText = `${this.questionText} _______________`
  }

  keyUpEvent(item: any) {
    if (item.keyCode === 8) {
      if (this.questionText.split('_').length - 1 < 15) {
        this.fitbCount = 0
        this.questionText = this.questionText.split('_').join('')
      }
    }
  }

  async questionSelected(item: any) {
    this.selectedQuestionNode = item.value
    this.questionType = ''
    this.questionText = ''
    this.fitbCount = 0
    this.quizStoreSvc.collectiveQuiz[this.selectedQuestionNode] = []
    this.quizStoreSvc.currentId = this.selectedQuestionNode
    this.quizStoreSvc.changeQuiz(0)
    if (this.contentData && this.contentData.childNodes && this.contentData.childNodes.includes(item.value)) {
      const requestPayload = {
        request: {
          search: {
            identifier: [
              item.value,
            ],
          },
        },
      }
      this.loaderService.changeLoad.next(true)
      const getQuestionDataRes = await this.editorService.getQuestionDetailsApi(requestPayload).toPromise().catch(_error => { })
      if (getQuestionDataRes && getQuestionDataRes.params && getQuestionDataRes.params.status === 'successful') {
        this.loaderService.changeLoad.next(false)
        const questionData = getQuestionDataRes.result.questions
        if (questionData && questionData.length > 0) {
          questionData.forEach((element: any, index: number) => {
            this.assignQuestion(element, index)
          })
        }
      } else {
        this.loaderService.changeLoad.next(false)
        this.showTosterMessage('fail')
      }
    }
  }

  assignQuestion(metaData: any, listNum: number) {
    const configQuestion = {
      questionId: this.quizStoreSvc.generateQuestionId(listNum),
      question: metaData.editorState.question,
      questionType: (metaData.qType === 'FTB') ? 'fitb' : toLower(metaData.qType),
      options: [],
      multiSelection: (metaData.qType === 'MCQ-MCA') ? true : false,
    }
    const questionOptions: any = []
    this.questionType = (metaData.qType === 'FTB') ? 'fitb' : toLower(metaData.qType)
    this.questionText = metaData.editorState.question
    this.fitbCount = (metaData.qType === 'FTB') ? this.checkBlankCount(metaData.editorState.question) : 0
    if (metaData.editorState.options && metaData.editorState.options.length > 0) {
      metaData.editorState.options.forEach((element: any, index: number) => {
        const configOptions: any = {
          optionId: this.quizStoreSvc.generateOptionId(configQuestion.questionId, index),
          isCorrect: (metaData.qType !== 'MTF') ? element.answer : true,
          text: element.value.body,
        }
        if (metaData.qType === 'MTF') {
          configOptions['match'] = element.answer
        }
        questionOptions.push(configOptions)
      })
    }
    configQuestion.options = questionOptions
    this.quizStoreSvc.collectiveQuiz[this.selectedQuestionNode].push(configQuestion)
  }

  saveQuestion() {
    this.loaderService.changeLoad.next(true)
    if (this.answerOptions.length > 0) {
      let flag = false
      this.answerOptions.forEach((element: any) => {
        if (element.text.length === 0) {
          this.loaderService.changeLoad.next(false)
          this.showTosterMessage('fieldsRequried')
          flag = true
        }
      })
      if (flag) {
        return
      }
    }
    if (this.questionText && this.questionType && this.answerOptions.length > 0) {
      if (this.questionType === 'mcq-sca' && this.answerOptions.length > 0) {
        const checkMcqSca = this.answerOptions.filter((v: any) => v.isCorrect)
        if (checkMcqSca && checkMcqSca.length > 1) {
          this.loaderService.changeLoad.next(false)
          this.showTosterMessage('invalidMcqSca')
          return
        }
        if (checkMcqSca && checkMcqSca.length < 1) {
          this.loaderService.changeLoad.next(false)
          this.showTosterMessage('McqScaError')
          return
        }
        this.saveMcq()
      } else if (this.questionType === 'mcq-mca' && this.answerOptions.length > 0) {
        const checkMcqMca = this.answerOptions.filter((v: any) => v.isCorrect)
        if (checkMcqMca && (checkMcqMca.length === this.answerOptions.length)) {
          this.loaderService.changeLoad.next(false)
          this.showTosterMessage('allAnsweredSelected')
          return
        }
        if (checkMcqMca && checkMcqMca.length < 2) {
          this.loaderService.changeLoad.next(false)
          this.showTosterMessage('McqMcaError')
          return
        }
        this.saveMcq()
      } else if (this.questionType === 'fitb' && this.answerOptions.length > 0) {
        if (this.fitbCount !== this.answerOptions.length) {
          this.loaderService.changeLoad.next(false)
          this.showTosterMessage('missingAnswer')
          return
        }
        if (this.answerOptions.filter((v: any) => v.text !== '').length !== this.fitbCount) {
          this.loaderService.changeLoad.next(false)
          this.showTosterMessage('fieldsRequried')
          return
        }
        this.saveFitb()
      } else if (this.questionType === 'mtf' && this.answerOptions.length > 0) {
        if (this.answerOptions.length !== this.answerOptions.filter((v: any) => v.match !== '' && v.text !== '').length) {
          this.loaderService.changeLoad.next(false)
          this.showTosterMessage('fieldsRequried')
          return
        }
        this.saveMtf()
      }
    } else {
      this.loaderService.changeLoad.next(false)
      this.showTosterMessage('fieldsRequried')
    }
  }

  async saveMcq() {
    const requestPayload = this.getRequestPayload()
    const dataSaved = await this.triggerSave(requestPayload, false, true)
    if (dataSaved) {
      this.assignData()
    }
  }

  async saveFitb() {
    const requestPayload = this.getRequestPayload()
    const dataSaved = await this.triggerSave(requestPayload, false, true)
    if (dataSaved) {
      this.assignData()
    }
  }

  async saveMtf() {
    const requestPayload = this.getRequestPayload()
    const dataSaved = await this.triggerSave(requestPayload, false, true)
    if (dataSaved) {
      this.assignData()
    }
  }

  getRequestPayload() {
    const optionsValue: { answer: boolean; value: { body: any; value: number } }[] = []
    const choicesValue: { value: { body: any; value: number } }[] = []
    let answerIndex = ''
    const rhsChoicesValue: any = []
    this.answerOptions.forEach((element: any, index: number) => {
      optionsValue.push({
        answer: (this.questionType === 'mtf') ? element.match : element.isCorrect,
        value: {
          body: element.text,
          value: index,
        },
      })
      choicesValue.push({
        value: {
          body: element.text,
          value: index,
        },
      })
      if (element.isCorrect) {
        answerIndex = (answerIndex) ? `${answerIndex},${index}` : `${index}`
      }
      if (this.questionType === 'mtf') {
        rhsChoicesValue.push(element.match)
      }
    })
    const nodesModify: any = {}
    let editiedMeta = <any>{}
    if (this.authInitService.assessmentQuestion) {
      editiedMeta = {
        code: this.authInitService.assessmentQuestion[this.questionType].code,
        mimeType: this.authInitService.assessmentQuestion[this.questionType].mimeType,
        body: this.questionText,
        primaryCategory: this.authInitService.assessmentQuestion[this.questionType].primaryCategory,
        qType: (this.questionType === 'fitb') ? 'FTB' : toUpper(this.questionType),
        editorState: {
          options: optionsValue,
          question: this.questionText,
        },
        objectType: this.authInitService.assessmentQuestion[this.questionType].objectType,
        answer: answerIndex,
        name: `${this.questionText.slice(0, 15)}${'.....?'}`,
        choices: {
          options: choicesValue,
        },
        rhsChoices: rhsChoicesValue,
      }
    }
    nodesModify[this.selectedQuestionNode] = {
      isNew: (this.assessmentData.children &&
        this.assessmentData.children.filter((v: any) => v.identifier === this.selectedQuestionNode).length > 0) ? false : true,
      root: false,
      metadata: editiedMeta,
      objectType: this.authInitService.assessmentQuestion[this.questionType].objectType,
    }
    const requestPayload = {
      request: {
        data: {
          nodesModified: nodesModify,
          hierarchy:
            this.collectionstoreService.getAssessmentTreeHierarchy(
              this.selectedData.identifier, this.sectionData, this.selectedQuestionNode),
        },
      },
    }

    return requestPayload
  }

  async triggerSave(requestPayload: any, saveSectionAction?: boolean, saveQuestion?: boolean) {
    const updateResData = await this.editorService.updateAssessmentHierarchy(requestPayload).toPromise().catch(_error => { })
    if (updateResData && updateResData.params && updateResData.params.status === 'successful') {
      const assessmentDataRes =
        await this.editorService.getAssessmentHierarchy(this.selectedData.identifier).toPromise().catch(_error => { })
      if (assessmentDataRes && assessmentDataRes.params && assessmentDataRes.params.status === 'successful') {
        this.contentService.assessmentOriginalContent = {}
        this.contentService.setAssessmentOriginalMetaHierarchy(assessmentDataRes.result.questionSet)
        this.contentData = this.contentService.getAssessmentOriginalMeta(this.selectedData.identifier)
        if (saveSectionAction) {
          this.sectionData = updateResData.result.identifiers[this.sectionData]
          this.savedSectionId.emit(updateResData.result.identifiers)
          this.assignData()
          this.updateParentAssessmentData()
        }
        if (saveQuestion) {
          this.selectedQuestionNode =
            (Object.keys(updateResData.result.identifiers).includes(this.selectedQuestionNode))
              ? updateResData.result.identifiers[this.selectedQuestionNode] : this.selectedQuestionNode
          this.answerOptions = []
        }
        this.loaderService.changeLoad.next(false)
        this.showTosterMessage('success')
        return true
      }
      this.loaderService.changeLoad.next(false)
      this.showTosterMessage('fail')

    } else {
      this.loaderService.changeLoad.next(false)
      this.showTosterMessage('fail')
    }
    return false
  }

  removeAssessment(item: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      height: '190px',
      data: item,
    })
    dialogRef.afterClosed().subscribe(async confirmDialogRes => {
      if (confirmDialogRes) {
        if (item === 'deleteQuestion') {
          this.collectionstoreService.deleteQuestion(this.selectedData.identifier, this.selectedQuestionNode, item)
        } else if (item === 'deleteSection') {
          this.collectionstoreService.deleteQuestion(this.contentData.identifier, this.sectionData, item)
        }
        const requestPayload = {
          request: {
            data: {
              nodesModified: {},
              hierarchy:
                this.collectionstoreService.getAssessmentTreeHierarchy(
                  this.selectedData.identifier),
            },
          },
        }
        this.loaderService.changeLoad.next(true)
        const dataSave = await this.triggerSave(requestPayload)
        if (dataSave) {
          if (item === 'deleteQuestion') {
            this.questionList = this.questionList.filter((v: any) => v.identifier !== this.selectedQuestionNode)
            this.selectedQuestionNode = ''
            if (this.questionList && this.questionList.length <= 0) {
              this.questionType = ''
              this.questionText = ''
              this.fitbCount = 0
            }
          } else if (item === 'deleteSection') {
            this.deleteSectionNode.emit(this.sectionData)
          }
        }
      }
    })
  }

  async updateParentAssessmentData() {
    if (this.contentData && this.contentData.children && this.contentData.children.length > 0) {
      const editiedMeta = <any>{
        totalQuestions: 0,
        maxQuestions: 0,
      }
      const nodesModify: any = {}
      this.contentData.children.forEach((element: any) => {
        editiedMeta['totalQuestions'] = editiedMeta['totalQuestions'] + element.totalQuestions
        editiedMeta['maxQuestions'] = editiedMeta['maxQuestions'] + element.maxQuestions
      })
      nodesModify[this.contentData.identifier] = {
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
        }
        this.loaderService.changeLoad.next(false)
        this.showTosterMessage('success')
      } else {
        this.loaderService.changeLoad.next(false)
        this.showTosterMessage('fail')
      }
    }
  }

}
