import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeDurationTransformModule, PipeFilterModule, PipeHtmlTagRemovalModule, PipeOrderByModule, PipeRelativeTimeModule } from '@sunbird-cb/utils'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import {
  MatIconModule, MatListModule, MatFormFieldModule, MatDialogModule,
  MatSelectModule, MatInputModule, MatButtonModule, MatSidenavModule,
  MatChipsModule, MatProgressSpinnerModule, MatProgressBarModule, MatRadioModule,
  MatTabsModule, MatCheckboxModule, MatDatepickerModule, MatAutocompleteModule, MatSlideToggleModule,
} from '@angular/material'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatMenuModule } from '@angular/material/menu'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSortModule } from '@angular/material/sort'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { NgxPaginationModule } from 'ngx-pagination'
import { RainDashboardsModule } from '@sunbird-cb/rain-dashboards'

import { ExportAsModule } from 'ngx-export-as'
import { HomeRoutingModule } from './home.rounting.module'
import { AvatarPhotoModule, BreadcrumbsOrgModule, UIORGTableModule, ScrollspyLeftMenuModule } from '@sunbird-cb/collection'
import { UsersModule } from '../users/users.module'
import { WorkallocationModule } from '../workallocation/workallocation.module'
import { UIAdminTableModule } from '../../head/work-allocation-table/ui-admin-table.module'
import { LeftMenuModule } from '../../head/left-menu/left-menu.module'

import { InitResolver } from './resolvers/init-resolve.service'
import { MdoInfoService } from './services/mdoinfo.service'
import { UploadService } from './services/upload.service'
import { TrainingPlanDashboardService } from './services/training-plan-dashboard.service'
import { UsersService } from '../users/services/users.service'

import { HomeComponent } from './routes/home/home.component'
import { UsersViewComponent } from './routes/users-view/users-view.component'
import { AboutComponent } from './routes/about/about.component'
import { RolesAccessComponent } from './routes/roles-access/roles-access.component'
import { ApprovalsComponent } from './routes/approvals/approvals.component'
import { WorkallocationComponent } from './routes/workallocation/workallocation.component'
import { WelcomeComponent } from './routes/welcome/welcome.component'
import { MdoinfoComponent } from './routes/mdoinfo/mdoinfo.component'
import { LeadershipComponent } from './routes/leadership/leadership.component'
import { StaffComponent } from './routes/staff/staff.component'
import { BudgetComponent } from './routes/budget/budget.component'
import { LeftMenuComponent } from './components/left-menu/left-menu.component'
import { LeadershiptableComponent } from './components/leadershiptable/leadershiptable.component'
import { BudgettableComponent } from './components/budgettable/budgettable.component'
import { AdduserpopupComponent } from './components/adduserpopup/adduserpopup.component'
import { StaffdetailspopupComponent } from './components/staffdetailspopup/staffdetailspopup.component'
import { BudgetschemepopupComponent } from './components/budgetschemepopup/budgetschemepopup.component'
import { BudgetproofspopupComponent } from './components/budgetproofspopup/budgetproofspopup.component'
import { AdmintableComponent } from './components/admintable/admintable.component'
import { BlendedApprovalsComponent } from './routes/blended-approvals/blended-approvals.component'
import { ReportsSectionComponent } from './routes/reports-section/reports-section.component'
import { TrainingPlanDashboardComponent } from './routes/training-plan-dashboard/training-plan-dashboard.component'
import { AdminsTableComponent } from './routes/admins-table/admins-table.component'
import { ReportsVideoComponent } from './routes/reports-video/reports-video.component'
import { ProfleApprovalBulkUploadComponent } from './routes/profle-approval-bulk-upload/profle-approval-bulk-upload.component'
import { UserCardComponent } from './components/user-cards/user-card.component'
import { SearchComponent } from './components/search/search.component'
import { FilterComponent } from './components/filter/filter.component'
import { FilterSearchPipeModule } from '../pipes/filter-search/filter-search.module'
import { ApprovalPendingComponent } from './routes/approvals/approval-pending/approval-pending.component'
import { RejectionPopupComponent } from './components/rejection-popup/rejection-popup.component'
import { AllUsersComponent } from './routes/users-view/all-users/all-users.component'
import { BulkUploadComponent } from './routes/users-view/bulk-upload/bulk-upload.component'
import { VerifyOtpComponent } from './routes/users-view/verify-otp/verify-otp.component'
import { FileProgressComponent } from './routes/users-view/file-progress/file-progress.component'
import { UserCreationComponent } from './routes/users-view/user-creation/user-creation.component'
import { SingleUserCreationComponent } from './routes/users-view/single-user-creation/single-user-creation.component'
import { BulkUploadApprovalComponent } from './routes/approvals/bulk-upload/bulk-upload.component'
import { RequestListComponent } from './components/request-list/request-list.component'
import { CreateRequestFormComponent } from './components/request-list/create-request-form/create-request-form.component'
import { CompetencyViewComponent } from './components/request-list/competency-view/competency-view.component'
import { AssignListPopupComponent } from './components/request-list/assign-list-popup/assign-list-popup.component'
import { SingleAssignPopupComponent } from './components/request-list/single-assign-popup/single-assign-popup.component'
import { HttpClientModule } from '@angular/common/http'
import { DesignationModule } from './routes/designation/designation.module'
import { OdcsMappingComponent } from './routes/odcs-mapping/odcs-mapping.component'
import { environment } from '../../../../../../../src/environments/environment'
import { TaxonomyEditorModule } from '@sunbird-cb/taxonomy-editor'
import { MentorManageComponent } from './routes/mentor-manage/mentor-manage.component'

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
    BlendedApprovalsComponent,
    ReportsSectionComponent,
    TrainingPlanDashboardComponent,
    AdminsTableComponent,
    ReportsVideoComponent,
    ProfleApprovalBulkUploadComponent,
    UserCardComponent,
    SearchComponent,
    FilterComponent,
    ApprovalPendingComponent,
    BulkUploadComponent,
    RejectionPopupComponent,
    AllUsersComponent,
    VerifyOtpComponent,
    FileProgressComponent,
    UserCreationComponent,
    SingleUserCreationComponent,
    BulkUploadApprovalComponent,
    RequestListComponent,
    CreateRequestFormComponent,
    CompetencyViewComponent,
    AssignListPopupComponent,
    SingleAssignPopupComponent,
    OdcsMappingComponent,
    MentorManageComponent,
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    UIORGTableModule,
    WidgetResolverModule,
    ReactiveFormsModule,
    HomeRoutingModule,
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
    MatDatepickerModule,
    PipeDurationTransformModule,
    LeftMenuModule,
    FilterSearchPipeModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    HttpClientModule,
    DesignationModule,
    TaxonomyEditorModule,
  ],
  entryComponents: [
    AdduserpopupComponent,
    StaffdetailspopupComponent,
    BudgetschemepopupComponent,
    BudgetproofspopupComponent,
    ReportsVideoComponent,
    UserCardComponent,
    SearchComponent,
    FilterComponent,
    RejectionPopupComponent,
    VerifyOtpComponent,
    FileProgressComponent,
    CompetencyViewComponent,
    AssignListPopupComponent,
    SingleAssignPopupComponent,
  ],
  providers: [
    { provide: 'environment', useValue: environment },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    InitResolver,
    MdoInfoService,
    UploadService,
    TrainingPlanDashboardService,
    UsersService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {

}
