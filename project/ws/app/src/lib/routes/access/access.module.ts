import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AccessRoutingModule } from './access-routing.module'
import { HomeComponent } from './routes/home/home.component'
import { PrivilegesComponent } from './routes/privileges/privileges.component'
import {
  BreadcrumbsOrgModule,
  LeftMenuWithoutLogoModule,
  GroupCheckboxModule,
  UIORGTableModule,
} from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { HomeModule } from '../home/home.module'
import { RouterModule } from '@angular/router'
import { UsersComponent } from './routes/users/users.component'
import { UsersService } from './services/users.service'
import {
  MatSidenavModule,
  MatIconModule,
} from '@angular/material'
import { MatCardModule } from '@angular/material/card'

@NgModule({
  declarations: [HomeComponent, PrivilegesComponent, UsersComponent],
  imports: [CommonModule, AccessRoutingModule, BreadcrumbsOrgModule, LeftMenuWithoutLogoModule, WidgetResolverModule,
    MatSidenavModule, MatIconModule, GroupCheckboxModule, HomeModule, RouterModule, UIORGTableModule, MatCardModule],
  exports: [UsersComponent],
  providers: [UsersService],
})
export class AccessModule { }
