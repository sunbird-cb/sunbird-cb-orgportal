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
import { AvatarPhotoModule, BreadcrumbsOrgModule, LeftMenuModule, UIORGTableModule, ScrollspyLeftMenuModule } from '@sunbird-cb/collection'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { ExportAsModule } from 'ngx-export-as'
import { WorkallocationModule } from '../workallocation/workallocation.module'
import { NgxPaginationModule } from 'ngx-pagination'
import { UIAdminTableModule } from '../../head/work-allocation-table/ui-admin-table.module'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSortModule } from '@angular/material/sort'
import { TrainingPlanRoutingModule } from './training-plan.routing.module'
import { TrainingPlanHomeComponent } from './routes/training-plan-home/training-plan-home.component'
import { CreatePlanComponent } from './routes/create-plan/create-plan.component'
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component'
import { StepperComponent } from './components/stepper/stepper.component'
import { SearchComponent } from './components/search/search.component'
import { StandardCardComponent } from './components/standard-card/standard-card.component'
import { CompetencySummaryComponent } from './components/competency-summary/competency-summary.component'
@NgModule({
  declarations: [
    TrainingPlanHomeComponent,
    CreatePlanComponent,
    BreadcrumbComponent,
    StepperComponent,
    SearchComponent,
    StandardCardComponent,
    CompetencySummaryComponent
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    UIORGTableModule,
    WidgetResolverModule,
    ReactiveFormsModule,
    TrainingPlanRoutingModule,
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
    PipeOrderByModule,
    BreadcrumbsOrgModule,
    WidgetResolverModule,
    ScrollspyLeftMenuModule,
    MatRadioModule,
    ExportAsModule,
    WorkallocationModule,
    NgxPaginationModule,
    UIAdminTableModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
  ],
  entryComponents: [
  ],
  providers: [
    InitResolver,
  ],
})
export class TrainingPlanModule {

}
