import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MandatoryCoursesRoutingModule } from './mandatory-courses-routing.module'
import { FolderListTableComponent } from './components/folder-list-table/folder-list-table.component'
import { AddFolderPopupComponent } from './components/add-folder-popup/add-folder-popup.component'
import { MatIconModule, MatTableModule } from '@angular/material'
import { MatFormFieldModule, MatInputModule } from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { MandatoryCourseComponent } from './routes/mandatory-courses-home/mandatory-courses-home/mandatory-course.component'
import { NoDataComponent } from './components/no-data/no-data.component'
import { MandatoryCourseHomeComponent } from './routes/mandatory-course-home/mandatory-course-home.component'
import { AddCoursesComponent } from './routes/add-courses/add-courses.component'

@NgModule({
  declarations: [MandatoryCourseHomeComponent, FolderListTableComponent, AddFolderPopupComponent, MandatoryCourseComponent, NoDataComponent, AddCoursesComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MandatoryCoursesRoutingModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  exports: [FolderListTableComponent, AddFolderPopupComponent]

})
export class MandatoryCoursesModule { }
