import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MobileAppHomeComponent } from './components/mobile-app-home.component'
import {
  MatCardModule,
  MatTabsModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
} from '@angular/material'
import { BreadcrumbsOrgModule } from '@sunbird-cb/collection'

@NgModule({
  declarations: [MobileAppHomeComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    BreadcrumbsOrgModule,
  ],
  exports: [MobileAppHomeComponent],
})
export class MobileAppModule {}
