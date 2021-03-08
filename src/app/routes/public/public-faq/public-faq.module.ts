import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PublicFaqComponent } from './public-faq.component'
import {
  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatCardModule,
  MatDividerModule,
  MatListModule,
  MatButtonModule,
} from '@angular/material'
import { RouterModule } from '@angular/router'
import { BreadcrumbsOrgModule } from '@sunbird-cb/collection'

@NgModule({
  declarations: [PublicFaqComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    RouterModule,
    BreadcrumbsOrgModule,
    MatButtonModule,
  ],
  exports: [PublicFaqComponent],
})
export class PublicFaqModule {}
