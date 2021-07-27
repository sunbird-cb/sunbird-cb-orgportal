import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CreateUserComponent } from './routes/create-user/create-user.component'
import { ViewUserComponent } from './routes/view-user/view-user.component'
import { RouterModule } from '@angular/router'
import { UsersRoutingModule } from './users.routing.module'
import { BreadcrumbsOrgModule, ScrollspyLeftMenuModule } from '@sunbird-cb/collection'
import {
  MatSidenavModule, MatGridListModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule,
  MatIconModule, MatButtonModule, MatRadioModule, MatDialogModule, MatSelectModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatTableModule,
} from '@angular/material'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { RolesService } from './services/roles.service'

@NgModule({
  declarations: [CreateUserComponent, ViewUserComponent],
  imports: [
    CommonModule, RouterModule, UsersRoutingModule, BreadcrumbsOrgModule,
    MatSidenavModule, MatListModule, ScrollspyLeftMenuModule, MatCardModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatGridListModule,
    MatRadioModule, MatDialogModule, ReactiveFormsModule, MatSelectModule, MatProgressSpinnerModule,
    MatExpansionModule, MatDividerModule, MatPaginatorModule, MatTableModule, WidgetResolverModule,
  ],
  providers: [RolesService],
})
export class UsersModule { }
