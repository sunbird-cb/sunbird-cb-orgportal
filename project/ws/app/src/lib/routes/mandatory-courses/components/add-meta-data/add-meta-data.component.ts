import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { ImageCropComponent } from '../../../../image-crop/image-crop.component'
// import { Observable } from 'rxjs'
// import { map } from 'rxjs/operators'
import { environment } from '../../../../../../../../../src/environments/environment'
import { AddThumbnailComponent } from '../../../../thumbnail/add-thumbnail/add-thumbnail.component'
// import { ThumbnailService } from '../../../../thumbnail/thumbnail.service'
import { MandatoryCourseService } from '../../services/mandatory-course.service'
@Component({
  selector: 'ws-app-add-meta-data',
  templateUrl: './add-meta-data.component.html',
  styleUrls: ['./add-meta-data.component.scss'],
})
export class AddMetaDataComponent implements OnInit {
  metaDataForm: FormGroup
  data!: any
  pageData!: any
  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private sanitizer: DomSanitizer, private mandatoryCourseService: MandatoryCourseService, private route: ActivatedRoute) {
    this.metaDataForm = this.fb.group({
      name: ['', [Validators.required]],
      purpose: ['', [Validators.required]],
      instructions: [''],
      appIcon: ['', [Validators.required]],
      posterImage: ['', [Validators.required]],
      creatorLogo: []
    })
  }

  ngOnInit() {
    this.pageData = this.mandatoryCourseService.getPageData()
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
            ...this.pageData
          }
          this.mandatoryCourseService.createContent(requestBody).subscribe(res => {
            console.log(res)
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
  showError(meta: string) {
    console.log(meta)
    // if (
    //   this.contentService.checkCondition(this.contentMeta.identifier, meta, 'required') &&
    //   !this.contentService.isPresent(meta, this.contentMeta.identifier)
    // ) {
    //   if (this.isSubmitPressed) {
    //     return true
    //   }
    //   if (this.contentForm.controls[meta] && this.contentForm.controls[meta].touched) {
    //     return true
    //   }
    //   return false
    // }
    return false
  }
  updateContent() {
    if (this.metaDataForm.valid) {
      console.log(this.metaDataForm.value)
      const requestBody = {
        request: {
          content: {
            ...this.metaDataForm.value
          }
        }
      }
      this.mandatoryCourseService.updateContent(requestBody, this.route.snapshot.params.doId).subscribe(res => {
        console.log(res)
      })
    }
  }
}
