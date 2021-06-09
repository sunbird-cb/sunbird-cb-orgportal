import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { FormGroup, FormControl } from '@angular/forms'
import { UploadFileService } from '../../services/uploadfile.service'
// import * as PDFJS from 'pdfjs-dist/webpack'
import { NsContent } from '@sunbird-cb/utils'
// import { Subject, Subscription } from 'rxjs'
const pdfjsViewer = require('pdfjs-dist/web/pdf_viewer')
@Component({
  selector: 'ws-app-publish-popup',
  templateUrl: './publish-popup.component.html',
  styleUrls: ['./publish-popup.component.scss'],
})
export class PublishPopupComponent implements OnInit {
  @ViewChild('file', { static: false }) file: any
  public files: Set<File> = new Set()
  progress: any
  uploading = false
  uploadSuccessful = false

  config = 1
  workorderData: any
  fileInfo: any
  form!: FormGroup
  userData: any
  uploadedFile: any
  comparePDF = false
  @ViewChild('fullScreenContainer', { static: true })
  containerSection!: ElementRef<HTMLElement>

  @ViewChild('pdfContainer', { static: true })
  pdfContainer!: ElementRef<HTMLCanvasElement>
  DEFAULT_SCALE = 1.0
  MAX_SCALE = 3
  MIN_SCALE = 0.2
  CSS_UNITS = 96 / 72
  totalPages = 0
  currentPage = new FormControl(0)
  zoom = new FormControl(this.DEFAULT_SCALE)
  isSmallViewPort = false
  realTimeProgressRequest = {
    content_type: 'Resource',
    current: ['0'],
    max_size: 0,
    mime_type: NsContent.EMimeTypes.PDF,
    user_id_type: 'uuid',
  }
  current: string[] = []
  identifier: string | null = null
  enableTelemetry = false
  // private pdfInstance: PDFJS.PDFDocumentProxy | null = null
  // private lastRenderTask: any | null = null
  // Subscriptions
  public isInFullScreen = false
  signedPDF: any
  draftPDF: any

  constructor(private uploadService: UploadFileService, private router: Router,
    // tslint:disable-next-line:align
    private dialogRef: MatDialogRef<PublishPopupComponent>,
    // tslint:disable-next-line:align
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.workorderData = data.data

    this.uploadService.getProfile().subscribe((userdata: any) => {
      this.userData = userdata.result.response
    })

  }

  ngOnInit() {
    // SimpleLinkService does not support handling of relative link switching PDFLinkService
    pdfjsViewer.SimpleLinkService.prototype.getDestinationHash =
      pdfjsViewer.PDFLinkService.prototype.getDestinationHash
    pdfjsViewer.SimpleLinkService.prototype.getAnchorUrl =
      pdfjsViewer.PDFLinkService.prototype.getAnchorUrl

    // this.render()
  }
  // private async render(): Promise<boolean> {
  // this.pdfContainer.nativeElement.innerHTML = ''
  // let page: any
  // if (this.pdfInstance) {
  //   page = await this.pdfInstance.getPage(1)
  // }
  // const pageNumStr = '1'
  // if (!this.current.includes(pageNumStr)) {
  //   this.current.push(pageNumStr)
  // }
  // const viewport = page.getViewport({ scale: this.zoom.value })
  // this.pdfContainer.nativeElement.width = viewport.width
  // this.pdfContainer.nativeElement.height = viewport.height
  // this.lastRenderTask = new pdfjsViewer.PDFPageView({
  //   scale: viewport.scale,
  //   container: this.pdfContainer.nativeElement,
  //   id: '1',
  //   defaultViewport: viewport,
  //   textLayerFactory: new pdfjsViewer.DefaultTextLayerFactory(),
  //   annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
  // })
  // return true
  // }

  addFiles() {
    this.file.nativeElement.click()
  }

  onFilesAdded(files: any) {
    this.uploading = true
    const fileList = (<HTMLInputElement>files.target).files
    if (fileList && fileList.length > 0) {
      const file: File = fileList[0]
      this.uploadedFile = file
      this.closeDialog()
    }
  }

  closeDialog() {
    const username = `${this.userData.firstName} ${this.userData.lastName}`

    const request = {
      request: {
        content: {
          name: 'PDF Asset',
          creator: username,
          createdBy: this.userData.id,
          code: 'pdf asset',
          mimeType: 'application/pdf',
          contentType: 'Asset',
          primaryCategory: 'Asset',
          organisation: ['igot-karmayogi'],
          createdFor: ['0131397178949058560'],
        },
      },
    }
    // start the upload and save the progress map
    this.progress = this.uploadService.crreateAsset(request).subscribe((res: any) => {
      const contentID = res.result.identifier
      const formData: FormData = new FormData()
      formData.append('data', this.uploadedFile)

      this.uploadService.uploadFile(contentID, formData).subscribe((fdata: any) => {
        const artifactUrl = fdata.result.artifactUrl
        this.workorderData.signedPdfLink = artifactUrl
        const req = this.workorderData

        this.uploadService.updateWorkOrder(req).subscribe((fres: any) => {
          if (fres.result.message === 'Successful') {
            this.uploading = false
          }
        })
      })
    })
    // tslint:disable-next-line:forin
    // for (const key in this.progress) {
    //   this.progress[key].progress.subscribe((val: any) => console.log(val))
    // }
  }

  compareFiles() {
    this.comparePDF = true
    // this.signedPDF = this.workorderData.signedPdfLink
    // this.draftPDF = 'C:/Downloads/Draft(1).pdf'

    // const pdf = await PDFJS.getDocument(this.signedPDF).promise
    // this.pdfInstance = pdf
    // this.totalPages = this.pdfInstance.numPages
    // this.zoom.enable()
    // this.currentPage = 1
    // this.currentPage.setValue(
    //   typeof this.widgetData.resumePage === 'number' &&
    //     this.widgetData.resumePage >= 1 &&
    //     this.widgetData.resumePage <= this.totalPages
    //     ? this.widgetData.resumePage
    //     : 1,
    // )
    // this.renderSubject.next()
    // this.activityStartedAt = new Date()
    // if (!this.widgetData.disableTelemetry) {
    //   this.eventDispatcher(WsEvents.EnumTelemetrySubType.Loaded)
    // }
  }

  publishOrder() {
    this.comparePDF = false
    this.workorderData.status = 'Published'
    const req = this.workorderData

    this.uploadService.updateWorkOrder(req).subscribe((fres: any) => {
      if (fres) {
        this.uploading = false
        this.uploadSuccessful = true
        this.workorderData = fres.result.data
      }
    })
  }

  dismiss() {
    this.dialogRef.close()
    this.router.navigate([`/app/workallocation/published`, this.workorderData.id])
  }

}
