import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeFilterModule, PipeHtmlTagRemovalModule, PipeOrderByModule, PipeRelativeTimeModule } from '@sunbird-cb/utils'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import {
  MatIconModule,
  MatListModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSelectModule,
  MatInputModule,
  MatButtonModule,
  MatSidenavModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatRadioModule,
  MatTabsModule,
  MatCheckboxModule,
} from '@angular/material'
import { MatMenuModule } from '@angular/material/menu'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatCardModule } from '@angular/material/card'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { InitResolver } from './resolvers/init-resolve.service'
import { RouterModule } from '@angular/router'
import { HomeRoutingModule } from './home.rounting.module'
import { HomeComponent } from './routes/home/home.component'
import { UsersViewComponent } from './routes/users-view/users-view.component'
import { AvatarPhotoModule, BreadcrumbsOrgModule, LeftMenuModule, UIORGTableModule, ScrollspyLeftMenuModule } from '@sunbird-cb/collection'
import { AboutComponent } from './routes/about/about.component'
import { RolesAccessComponent } from './routes/roles-access/roles-access.component'
import { ApprovalsComponent } from './routes/approvals/approvals.component'
import { WorkallocationComponent } from './routes/workallocation/workallocation.component'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { ExportAsModule } from 'ngx-export-as'
import { WorkallocationModule } from '../workallocation/workallocation.module'
import { NgxPaginationModule } from 'ngx-pagination'
import { UIAdminTableModule } from '../../head/work-allocation-table/ui-admin-table.module'
import { WelcomeComponent } from './routes/welcome/welcome.component'
import { RainDashboardsModule } from '@sunbird-cb/rain-dashboards'
import { MdoinfoComponent } from './routes/mdoinfo/mdoinfo.component'
import { LeadershipComponent } from './routes/leadership/leadership.component'
import { StaffComponent } from './routes/staff/staff.component'
import { BudgetComponent } from './routes/budget/budget.component'
import { LeftMenuComponent } from './components/left-menu/left-menu.component'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSortModule } from '@angular/material/sort'
import { LeadershiptableComponent } from './components/leadershiptable/leadershiptable.component'
import { BudgettableComponent } from './components/budgettable/budgettable.component'
import { AdduserpopupComponent } from './components/adduserpopup/adduserpopup.component'
import { StaffdetailspopupComponent } from './components/staffdetailspopup/staffdetailspopup.component'
import { MdoInfoService } from './services/mdoinfo.service'
import { BudgetschemepopupComponent } from './components/budgetschemepopup/budgetschemepopup.component'
import { BudgetproofspopupComponent } from './components/budgetproofspopup/budgetproofspopup.component'
import { UploadService } from './services/upload.service'
import { AdmintableComponent } from './components/admintable/admintable.component'
import { UsersModule } from '../users/users.module'
@NgModule({
  declarations: [
    HomeComponent,
    UsersViewComponent,
    AboutComponent,
    RolesAccessComponent,
    ApprovalsComponent,
    WorkallocationComponent,
    WelcomeComponent,
    MdoinfoComponent,
    LeadershipComponent,
    StaffComponent,
    BudgetComponent,
    LeftMenuComponent,
    LeadershiptableComponent,
    AdmintableComponent,
    BudgettableComponent,
    AdduserpopupComponent,
    StaffdetailspopupComponent,
    BudgetschemepopupComponent,
    BudgetproofspopupComponent,
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    UIORGTableModule,
    WidgetResolverModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    LeftMenuModule,
    FormsModule,
    RouterModule,
    MatGridListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    PipeFilterModule,
    PipeHtmlTagRemovalModule,
    PipeRelativeTimeModule,
    AvatarPhotoModule,
    // EditorSharedModule,
    // CkEditorModule,
    PipeOrderByModule,
    BreadcrumbsOrgModule,
    WidgetResolverModule,
    ScrollspyLeftMenuModule,
    MatRadioModule,
    ExportAsModule,
    WorkallocationModule,
    NgxPaginationModule,
    UIAdminTableModule,
    RainDashboardsModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    UsersModule,
  ],
  entryComponents: [
    AdduserpopupComponent,
    StaffdetailspopupComponent,
    BudgetschemepopupComponent,
    BudgetproofspopupComponent,
  ],
  providers: [
    // CKEditorService,
    // LoaderService,
    InitResolver,
    MdoInfoService,
    UploadService,
  ],
})
export class HomeModule {

}
