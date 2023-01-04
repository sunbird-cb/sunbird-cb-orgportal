import { Component, OnInit, Input, Inject, Output, EventEmitter, OnDestroy } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { ThumbnailService } from '../thumbnail.service'
@Component({
  selector: 'ws-auth-add-thumbnail',
  templateUrl: './add-thumbnail.component.html',
  styleUrls: ['./add-thumbnail.component.scss'],
  providers: [],
})
export class AddThumbnailComponent implements OnInit, OnDestroy {
  // toggle: NsContent.IContent[] = []

  @Input() stage = 1
  @Input() type = ''
  @Output() addAppIcon = new EventEmitter<string>()
  @Input() isUpdate = false

  canUpdate = true

  showMainContent: Boolean = true
  srcResult: any
  public imagePath: any
  imgURL: any
  public message: string | undefined
  public imageList!: []
  currentFilter = 'myimages'
  queryFilter = ''
  totalContent = 0
  fetchError = false
  isChecked: boolean
  thumbanilSelectval!: string
  toggle!: any
  constructor(
    public dialogRef: MatDialogRef<AddThumbnailComponent>,
    private configSvc: ConfigurationsService,
    private thumbnailSvc: ThumbnailService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isChecked = true
  }

  ngOnInit() {
    this.filter('myimages')
    this.imageList = []
  }

  ngOnDestroy() {

  }

  onFileSelected(files: any) {
    if (files.length === 0) {
      return
    }

    const mimeType = files[0].type
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.'
      return
    }

    const reader = new FileReader()
    this.imagePath = files[0]
    // this.isChecked = true
    reader.readAsDataURL(files[0])
    reader.onload = _event => {
      this.imgURL = reader.result
    }
  }

  showHideButton() {
    this.showMainContent = this.showMainContent ? false : true
  }

  filter(key: string | 'myimages' | 'all') {
    if (key) {
      this.currentFilter = key
      switch (key) {
        case 'myimages':
          this.fetchContent(false, (this.configSvc.userProfile && this.configSvc.userProfile.userId) || '')
          break
        case 'all':
          this.fetchContent(false, null)
          break

        default:
          this.fetchContent(false, (this.configSvc.userProfile && this.configSvc.userProfile.userId) || '')
          break
      }
    }
  }

  fetchContent(loadMoreFlag: boolean, createdBy: string | null) {
    const requestData = {
      request: {
        filters: {
          createdBy,
          compatibilityLevel: { min: 1, max: 2 },
          contentType: ['Asset'],
          mediaType: ['image'],
          status: ['Live', 'Review', 'Draft', 'Processing'],
        },
        query: this.queryFilter,
        // pageNo: loadMoreFlag ? this.pagination.offset : 0,
        sort_by: { lastUpdatedOn: 'desc' },
        // pageSize: this.pagination.limit

      },
    }
    this.thumbnailSvc.fetchContent(requestData).subscribe(
      data => {

        this.imageList =
          loadMoreFlag && !this.queryFilter
            ? (this.imageList || []).concat(
              data && data.result && data.result.content ? data.result.content : [],
            )
            : data && data.result.content
              ? data.result.content
              : []
        this.totalContent = data && data.result.response ? data.result.response.totalHits : 0
        // this.showLoadMore =
        //   this.pagination.offset * this.pagination.limit + this.pagination.limit < this.totalContent
        //     ? true`
        //     : false
        this.fetchError = false
      },
      () => {
        this.fetchError = true
        this.imageList = []
        // this.showLoadMore = false
        // this.loadService.changeLoad.next(false)
      },
    )
  }
  getUrl(url: string) {
    if (this.thumbnailSvc.getChangedArtifactUrl(url)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url)
    }
    return '/assets/instances/eagle/app_logos/default.png'
  }

  onValChange(val: any) {
    this.isChecked = true
    this.thumbanilSelectval = val ? val.identifier : ''
    this.toggle = val
  }
  public uploadThumbnail() {
    this.dialogRef.close({ appURL: this.toggle ? this.toggle.artifactUrl : '' })
  }
  public uploadSelectedThumbnail() {
    this.dialogRef.close({ file: this.imagePath })
  }
}
