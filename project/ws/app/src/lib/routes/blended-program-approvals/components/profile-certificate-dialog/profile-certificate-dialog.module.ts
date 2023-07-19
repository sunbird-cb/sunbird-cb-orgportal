import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProfileCertificateDialogComponent } from './profile-certificate-dialog.component'
import { MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatSnackBarModule, MatTooltipModule, MatMenuModule } from '@angular/material'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils'

@NgModule({
  declarations: [ProfileCertificateDialogComponent],
  imports: [
    CommonModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatMenuModule,
    MatSnackBarModule,
    PipeSafeSanitizerModule,
  ],
  exports: [
    ProfileCertificateDialogComponent,
  ],
  entryComponents: [ProfileCertificateDialogComponent],
})
export class ProfileCertificateDialogModule { }
