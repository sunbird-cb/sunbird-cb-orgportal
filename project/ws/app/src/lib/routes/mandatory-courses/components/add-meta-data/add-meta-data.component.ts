import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { ImageCropComponent } from '../../../../image-crop/image-crop.component'
import { forkJoin } from 'rxjs'
// import { map } from 'rxjs/operators'
import { environment } from '../../../../../../../../../src/environments/environment'
import { AddThumbnailComponent } from '../../../../thumbnail/add-thumbnail/add-thumbnail.component'
// import { ThumbnailService } from '../../../../thumbnail/thumbnail.service'
import { MandatoryCourseService } from '../../services/mandatory-course.service'
import { flatMap, mergeMap } from 'rxjs/operators'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'ws-app-add-meta-data',
  templateUrl: './add-meta-data.component.html',
  styleUrls: ['./add-meta-data.component.scss'],
})
export class AddMetaDataComponent implements OnInit {
  metaDataForm: FormGroup
  data!: any
  pageData!: any
  folderInfo: any
  bdtitles!: any
  @Output() sendCourseInfo = new EventEmitter()
  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private sanitizer: DomSanitizer, private mandatoryCourseService: MandatoryCourseService,
    private route: ActivatedRoute, private snackBar: MatSnackBar) {
    this.metaDataForm = this.fb.group({
      name: [''],
      purpose: [''],
      description: [''],
      appIcon: [''],
      posterImage: [''],
    })
  }

  ngOnInit() {
    this.pageData = this.route.snapshot.data.pageData.data
    this.mandatoryCourseService.updatePageData(this.route.snapshot.data.pageData.data)
    this.getinitalData()
  }

  getinitalData() {
    this.route.params.pipe(
      flatMap(id => this.mandatoryCourseService.getEditContent(id.doId))
    ).subscribe((res: any) => {
      this.metaDataForm.controls.name.setValue(res.result.content.name)
      this.metaDataForm.controls.purpose.setValue(res.result.content.purpose || '')
      this.metaDataForm.controls.description.setValue(res.result.content.description || '')
      this.metaDataForm.controls.appIcon.setValue(res.result.content.appIcon || '')
      this.metaDataForm.controls.posterImage.setValue(res.result.content.posterImage || '')
      this.data = { appURL: res.result.content.appIcon }
      this.folderInfo = res.result.content
      this.mandatoryCourseService.sharefolderData(this.folderInfo)
      this.sendCourseInfo.emit(this.folderInfo.children)
    })
  }

  openDialog(type: string) {

    const dialogConfig = new MatDialogConfig()
    const dialogRef = this.dialog.open(AddThumbnailComponent, dialogConfig)

    const instance = dialogRef.componentInstance

    instance.isUpdate = true
    dialogRef.afterClosed().subscribe(data => {
      this.data = data
      if (data && data.appURL) {
        if (type === 'appIcon') {
          this.metaDataForm.controls.appIcon.setValue(data.appURL)
          this.metaDataForm.controls.posterImage.setValue(data.appURL)
        }
        if (type === 'cbpProviderImage') {
          this.metaDataForm.controls.creatorLogo.setValue(data.appURL)
          // this.canUpdate = true
        }
        // this.storeData()
      } else if (data && data.file) {
        this.uploadAppIcon(data.file, type)
      }
    })
  }

  uploadAppIcon(file: File, type: string) {
    if (!file) {
      return
    }
    const formdata = new FormData()
    const fileName = file ? file.name : ''

    const dialogRef = this.dialog.open(ImageCropComponent, {
      width: '70%',
      data: {
        isRoundCrop: false,
        imageFile: file,
        width: (type === 'appIcon') ? 265 : (type === 'cbpProviderImage') ? 72 : 0,
        height: (type === 'appIcon') ? 150 : (type === 'cbpProviderImage') ? 72 : 0,
        isThumbnail: true,
        imageFileName: fileName,
      },
    })

    dialogRef.afterClosed().subscribe({
      next: (result: File) => {
        if (result) {
          formdata.append('content', result, fileName)

          const requestBody = {
            name: fileName,
            ...this.pageData.image,
          }
          this.mandatoryCourseService.createContent(requestBody).pipe(
            mergeMap(id => this.mandatoryCourseService.upload(formdata, id)))
            .subscribe(data => {
              this.metaDataForm.controls.appIcon.setValue(data.result.artifactUrl || '')
              this.metaDataForm.controls.posterImage.setValue(data.result.artifactUrl || '')
              this.data.appURL = data.result.artifactUrl
              const req = {
                request: {
                  content: {
                    artifactUrl: data.result.artifactUrl,
                    versionKey: data.result.versionKey,
                  },
                },
              }

              this.mandatoryCourseService.updateContent(req, data.result.identifier).subscribe(() => {
                this.snackBar.open('Saved Successfully', 'Close', { verticalPosition: 'top' })
              })

            })
        }
      },
    })
  }

  getsanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
  generateUrl(oldUrl: string) {
    const chunk = oldUrl.split('/')
    const newChunk = environment.azureHost.split('/')
    const newLink = []
    for (let i = 0; i < chunk.length; i += 1) {
      if (i === 2) {
        newLink.push(newChunk[i])
      } else if (i === 3) {
        newLink.push(environment.azureBucket)
      } else {
        newLink.push(chunk[i])
      }
    }
    const newUrl = newLink.join('/')
    return newUrl
  }
  showError() {
    return false
  }
  updateContent() {
    const requestParams = {
      request: {
        data: {
          nodesModified: {
            [this.route.snapshot.params.doId]: {
              isNew: false,
              root: true,
            },
          },
          hierarchy: {
            [this.route.snapshot.params.doId]: {
              root: true,
              children: [
              ],
            },
          },
        },
      },
    }
    if (this.metaDataForm.valid) {
      const requestBody = {
        request: {
          content: {
            ...this.metaDataForm.value,
            versionKey: this.folderInfo.versionKey,
          },
        },
      }
      forkJoin([this.mandatoryCourseService.updateContent(requestBody, this.route.snapshot.params.doId),
      this.mandatoryCourseService.updateHierarchy(requestParams)]).subscribe(() => {
        this.snackBar.open('Saved Successfully', 'Close', { verticalPosition: 'top' })
      })
    }
  }
}
