import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CreateWorkallocationComponent } from './routes/create-workallocation/create-workallocation.component'
import { RouterModule } from '@angular/router'
import { WorkallocationV2RoutingModule } from './workallocation-v2-routing.module'
import { BreadcrumbsOrgModule, ScrollspyLeftMenuModule, UIORGTableModule } from '@sunbird-cb/collection'
import {
  MatSidenavModule, MatGridListModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule,
  MatIconModule, MatButtonModule, MatRadioModule, MatDialogModule, MatSelectModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatTableModule, MatAutocompleteModule,
} from '@angular/material'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { ExportAsModule } from 'ngx-export-as'
import { MatMenuModule } from '@angular/material/menu'
import { MatTabsModule } from '@angular/material/tabs'
import { WorkallocationV2HomeComponent } from './routes/workallocation-v2-home/workallocation-v2-home.component'
import { OfficerComponent } from './components/officer/officer.component'
import { AutocompleteModule } from './components/autocomplete/autocomplete.module'
import { ActivityLabelsModule } from './components/activity-labels/activity-labels.module'
import { WINDOW_PROVIDERS } from './services/window.service'
import { AssistantMessageCardComponent } from './components/assistant-message-card/assistant-message-card.component'
import { AssistantContentCardComponent } from './components/assistant-content-card/assistant-content-card.component'
import { WatStoreService } from './services/wat.store.service'
import { CompetencyLabelsModule } from './components/competency-labels/competency-labels.module'
import { ComponentSharedModule } from './components/component-shared.module'
import { DraftAllocationsComponent } from './routes/draft-allocations/draft-allocations.component'
import { PublishedAllocationsComponent } from './routes/published-allocations/published-allocations.component'
import { CompDetailModule } from './components/comp-details/comp-details.module'
import { NgxPaginationModule } from 'ngx-pagination'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { NgCircleProgressModule } from 'ng-circle-progress'
import { UserWorkService } from './services/user-work.service'
import { DebounceClickDirective } from './directive/DebounceClickDirective'
import { DisableButtonOnSubmitDirective } from './directive/DisableButtonOnSubmitDirective'

@NgModule({
  declarations: [
    CreateWorkallocationComponent,
    WorkallocationV2HomeComponent,
    OfficerComponent,
    AssistantMessageCardComponent,
    AssistantContentCardComponent,
    DraftAllocationsComponent,
    PublishedAllocationsComponent,
    DebounceClickDirective,
    DisableButtonOnSubmitDirective,
  ],
  imports: [
    CommonModule, ReactiveFormsModule, WorkallocationV2RoutingModule, BreadcrumbsOrgModule,
    ActivityLabelsModule, CompDetailModule, CompetencyLabelsModule, RouterModule, MatSidenavModule, MatListModule,
    ScrollspyLeftMenuModule, MatCardModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatGridListModule,
    MatRadioModule, MatDialogModule, MatSelectModule, MatProgressSpinnerModule,
    MatExpansionModule, MatDividerModule, MatPaginatorModule, MatTableModule, WidgetResolverModule,
    UIORGTableModule, ExportAsModule, MatMenuModule, MatTabsModule, MatProgressSpinnerModule, MatAutocompleteModule,
    AutocompleteModule, ComponentSharedModule, NgxPaginationModule, Ng2SearchPipeModule,
    NgCircleProgressModule.forRoot({}),
  ],
  entryComponents: [
    // AllocationActionsComponent,
    // WatRolePopup,
  ],
  providers: [WINDOW_PROVIDERS, WatStoreService, UserWorkService],
  // exports: [DownloadAllocationComponent],
})
export class WorkallocationV2Module { }
