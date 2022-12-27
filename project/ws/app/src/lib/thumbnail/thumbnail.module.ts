import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AddThumbnailComponent } from './add-thumbnail/add-thumbnail.component'
import { MatButtonModule, MatButtonToggleModule, MatCardModule, MatDialogModule, MatIconModule } from '@angular/material'
import { ThumbnailService } from './thumbnail.service'



@NgModule({
  declarations: [
    AddThumbnailComponent
  ],
  imports: [
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatButtonToggleModule
  ],
  providers: [ThumbnailService],
  exports: [
    AddThumbnailComponent
  ]
})
export class ThumbnailModule { }
