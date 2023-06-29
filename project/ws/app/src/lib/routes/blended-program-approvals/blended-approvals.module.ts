import { NgModule } from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { CommonModule } from '@angular/common'
import {
  AvatarPhotoModule,
  BreadcrumbsOrgModule,
  LeftMenuWithoutLogoModule,
  UIORGTableModule,
} from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { HomeModule } from '../home/home.module'
import { RouterModule } from '@angular/router'
import {
  MatSidenavModule,
  MatIconModule,
} from '@angular/material'
import { MatCardModule } from '@angular/material/card'
import { BatchDetailsComponent } from './components/batch-details/batch-details.component'
import { BatchListComponent } from './components/batch-list/batch-list.component'
import { BlendedHomeComponent } from './components/blended-home/blended-home.component'
import { BlendedApprovalsRoutingModule } from './blended-approvals-routing.module'
import { UsersCardComponent } from './components/users-card/users-card.component'

@NgModule({
  declarations: [BlendedHomeComponent, BatchListComponent, BatchDetailsComponent, UsersCardComponent],
  imports: [CommonModule, BlendedApprovalsRoutingModule, BreadcrumbsOrgModule, LeftMenuWithoutLogoModule, WidgetResolverModule,
    MatSidenavModule, MatIconModule, HomeModule, RouterModule, UIORGTableModule, MatCardModule, AvatarPhotoModule, MatListModule],
  exports: [],
  providers: [],
})
export class BlendedApprovalsModule { }
