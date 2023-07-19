import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'ws-widget-app-profile-certificate-dialog',
  templateUrl: './profile-certificate-dialog.component.html',
  styleUrls: ['./profile-certificate-dialog.component.scss'],
})
export class ProfileCertificateDialogComponent implements OnInit {
  url!: string
  courseName: any
  author!: string
  // navUrl: any = ''
  // shareUrl = 'https://medium.com/@garfunkel61/angular-simplest-solution-for-social-sharing-feature-6f00d5d99c5e'

  constructor(
    public dialogRef: MatDialogRef<ProfileCertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.url = this.data.cet
    // this.createNavigationUrl()
  }

  // private createNavigationUrl() {
  //   this.navUrl = `https://www.linkedin.com/shareArticle?title=I%20earned%20a%20certficiation&url=${this.data.value.content.appIcon}`
  // }

  // navigate(data: any) {
  //   this.router.navigateByUrl(`/app/toc/${data}/overview`)
  // }

  // downloadCert() {
  //   const a: any = document.createElement('a')
  //   a.href = this.data.cet
  //   a.download = 'Certificate'
  //   document.body.appendChild(a)
  //   a.style = 'display: none'
  //   a.click()
  //   a.remove()
  // }
  // downloadCertPng() {
  //   const uriData = this.data.cet
  //   const img = new Image()
  //   img.src = uriData
  //   img.width = 1820
  //   img.height = 1000
  //   img.onload = () => {
  //     const canvas = document.createElement('canvas');
  //     [canvas.width, canvas.height] = [img.width, img.height]
  //     const ctx = canvas.getContext('2d')
  //     if (ctx) {
  //       ctx.drawImage(img, 0, 0, img.width, img.height)
  //       const a = document.createElement('a')
  //       const quality = 1.0 // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
  //       a.href = canvas.toDataURL('image/png', quality)
  //       a.download = 'Certificate'
  //       a.append(canvas)
  //       a.click()
  //       a.remove()
  //     }
  //   }
  // }
  // async downloadCertPdf() {
  //   const uriData = this.data.cet
  //   const img = new Image()
  //   img.src = uriData
  //   img.width = 1820
  //   img.height = 1000
  //   img.onload = () => {
  //     const canvas = document.createElement('canvas');
  //     [canvas.width, canvas.height] = [img.width, img.height]
  //     const ctx = canvas.getContext('2d')
  //     if (ctx) {
  //       ctx.drawImage(img, 0, 0, img.width, img.height)
  //       const quality = 1.0 // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
  //       const dataImg = canvas.toDataURL('application/pdf', quality)
  //       const pdf = new jsPDF('landscape', 'px', 'a4')

  //       // add the image to the PDF
  //       pdf.addImage(dataImg, 10, 20, 600, 350)

  //       // download the PDF
  //       pdf.save('Certificate.pdf')
  //     }
  //   }
  // }
  // shareCert() {
  //   return window.open(this.navUrl, '_blank')
  // }

}
