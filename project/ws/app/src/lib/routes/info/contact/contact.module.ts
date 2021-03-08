import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ContactHomeComponent } from './components/contact-home.component'
import { MatToolbarModule, MatCardModule, MatButtonModule } from '@angular/material'
import { BreadcrumbsOrgModule } from '@sunbird-cb/collection'

@NgModule({
  declarations: [ContactHomeComponent],
  imports: [CommonModule, MatToolbarModule, MatCardModule, BreadcrumbsOrgModule, MatButtonModule],
  exports: [ContactHomeComponent],
})
export class ContactModule {}
