import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MandatoryCoursesRoutingModule } from './mandatory-courses-routing.module'
import { FolderListTableComponent } from './components/folder-list-table/folder-list-table.component'
import { AddFolderPopupComponent } from './components/add-folder-popup/add-folder-popup.component'
import { MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatCardModule } from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { MandatoryCourseComponent } from './routes/mandatory-course/mandatory-course.component'
import { NoDataComponent } from './components/no-data/no-data.component'
import { MandatoryCourseHomeComponent } from './routes/mandatory-course-home/mandatory-course-home.component'
import { AddCoursesComponent } from './routes/add-courses/add-courses.component'
import { AddBatchDialougeComponent } from './components/add-batch-dialouge/add-batch-dialouge.component'
import {BreadcrumbsOrgModule} from '@sunbird-cb/collection'

@NgModule({
  declarations: [
    MandatoryCourseHomeComponent,
    FolderListTableComponent,
    AddFolderPopupComponent,
    MandatoryCourseComponent,
    NoDataComponent,
    AddCoursesComponent,
    AddBatchDialougeComponent],
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
    BreadcrumbsOrgModule
  ],
  entryComponents: [
    AddBatchDialougeComponent
  ],
  exports: [FolderListTableComponent, AddFolderPopupComponent],

})
export class MandatoryCoursesModule { }
