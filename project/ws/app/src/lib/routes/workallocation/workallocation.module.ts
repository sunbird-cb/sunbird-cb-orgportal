import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CreateWorkallocationComponent } from './routes/create-workallocation/create-workallocation.component'
import { DownloadAllocationComponent } from './routes/download-allocation/download-allocation.component'
import { RouterModule } from '@angular/router'
import { WorkallocationRoutingModule } from './workallocation-routing.module'
import { BreadcrumbsOrgModule, ScrollspyLeftMenuModule, UIORGTableModule } from '@sunbird-cb/collection'
import {
  MatSidenavModule, MatGridListModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule,
  MatIconModule, MatButtonModule, MatRadioModule, MatDialogModule, MatSelectModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatTableModule,
} from '@angular/material'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { ExportAsModule } from 'ngx-export-as'

@NgModule({
  declarations: [CreateWorkallocationComponent, DownloadAllocationComponent],
  imports: [
    CommonModule, RouterModule, WorkallocationRoutingModule, BreadcrumbsOrgModule,
    MatSidenavModule, MatListModule, ScrollspyLeftMenuModule, MatCardModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatGridListModule,
    MatRadioModule, MatDialogModule, ReactiveFormsModule, MatSelectModule, MatProgressSpinnerModule,
    MatExpansionModule, MatDividerModule, MatPaginatorModule, MatTableModule, WidgetResolverModule,
    UIORGTableModule, ExportAsModule,
  ],
  exports: [DownloadAllocationComponent],
})
export class WorkallocationModule { }
