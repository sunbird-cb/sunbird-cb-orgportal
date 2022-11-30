import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MandatoryCoursesRoutingModule } from './mandatory-courses-routing.module'
import { MandatoryCoursesHomeComponent } from './routes/mandatory-courses-home/mandatory-courses-home/mandatory-courses-home.component'
import { FolderListTableComponent } from './components/folder-list-table/folder-list-table.component'
import { AddFolderPopupComponent } from './components/add-folder-popup/add-folder-popup.component'
import { MatTableModule } from '@angular/material'
import { MatFormFieldModule, MatInputModule } from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'


@NgModule({
  declarations: [MandatoryCoursesHomeComponent, FolderListTableComponent, AddFolderPopupComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MandatoryCoursesRoutingModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [FolderListTableComponent, AddFolderPopupComponent]
})
export class MandatoryCoursesModule { }
