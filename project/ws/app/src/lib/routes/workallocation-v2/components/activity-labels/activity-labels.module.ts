import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivityLabelsComponent } from './activity-labels.component'
import {
  MatAutocompleteModule, MatCardModule,
  MatFormFieldModule, MatIconModule, MatInputModule
} from '@angular/material'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { CdkStepperModule } from '@angular/cdk/stepper'
import { CdkTableModule } from '@angular/cdk/table'
import { CdkTreeModule } from '@angular/cdk/tree'
import { ReactiveFormsModule } from '@angular/forms'



@NgModule({
  declarations: [ActivityLabelsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  entryComponents: [ActivityLabelsComponent],
  exports: [ActivityLabelsComponent],
})
export class ActivityLabelsModule { }