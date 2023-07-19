import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeEmailPipe } from './pipe-email.pipe'
import { PipeCertificateImageURL } from './pipe-certimage-URL.pipe'

@NgModule({
  declarations: [PipeEmailPipe, PipeCertificateImageURL],
  imports: [
    CommonModule,
  ],
  exports: [PipeEmailPipe, PipeCertificateImageURL],
})
export class PipeEmailModule { }
