import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MandatoryCoursesRoutingModule } from './mandatory-courses-routing.module'
import { FolderListTableComponent } from './components/folder-list-table/folder-list-table.component'
import { AddFolderPopupComponent } from './components/add-folder-popup/add-folder-popup.component'
import {
  MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule,
  MatTabsModule, MatCardModule, MatDialogModule, MatDatepickerModule, MatCheckboxModule, MatSnackBarModule,
} from '@angular/material'
import { MatSelectModule } from '@angular/material/select'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
// import { MatListModule } from '@angular/material/list'

import { MandatoryCourseComponent } from './routes/mandatory-course/mandatory-course.component'
import { NoDataComponent } from './components/no-data/no-data.component'
import { MandatoryCourseHomeComponent } from './routes/mandatory-course-home/mandatory-course-home.component'
import { AddCoursesComponent } from './routes/add-courses/add-courses.component'
import { AddBatchDialougeComponent } from './components/add-batch-dialouge/add-batch-dialouge.component'

import { BreadcrumbsOrgModule, CardContentModule } from '@sunbird-cb/collection'
import { BatchListComponent } from './components/batch-list/batch-list.component'
// import { AddMembersComponent } from './routes/add-members/add-members.component'

// import { BreadcrumbsOrgModule } from '@sunbird-cb/collection';
import { AddMembersComponent } from './routes/add-members/add-members.component'
import { BatchDetailsComponent } from './routes/batch-details/batch-details.component'
import { AddMetaDataComponent } from './components/add-meta-data/add-meta-data.component'
import { UserCardComponent } from './components/user-card/user-card.component'
import { AddThumbnailComponent } from '../../thumbnail/add-thumbnail/add-thumbnail.component'
import { ThumbnailModule } from '../../thumbnail/thumbnail.module'
import { ImageCropModule } from '../../image-crop/image-crop.module'
import { FilterTagsComponent } from './components/filter-tags/filter-tags.component'
import { StatusWidgetComponent } from './components/status-widget/status-widget.component'

@NgModule({
  declarations: [
    MandatoryCourseHomeComponent,
    FolderListTableComponent,
    AddFolderPopupComponent,
    MandatoryCourseComponent,
    NoDataComponent,
    AddCoursesComponent,
    AddBatchDialougeComponent,
    AddMembersComponent,
    BatchDetailsComponent,
    BatchListComponent,
    AddMetaDataComponent,
    UserCardComponent,
    FilterTagsComponent,
    StatusWidgetComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MandatoryCoursesRoutingModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    BreadcrumbsOrgModule,
    CardContentModule,
    MatDialogModule,
    BreadcrumbsOrgModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    ThumbnailModule,
    ImageCropModule,
    MatTooltipModule,
    MatMenuModule
  ],
  entryComponents: [
    AddBatchDialougeComponent,
    AddThumbnailComponent,
  ],
  exports: [FolderListTableComponent, AddFolderPopupComponent],

})
export class MandatoryCoursesModule { }
