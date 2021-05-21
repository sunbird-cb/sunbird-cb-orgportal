import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CompetencyLabelsComponent } from './competency-labels.component'
import {
  MatAutocompleteModule, MatCardModule,
  MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule,
} from '@angular/material'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { CdkStepperModule } from '@angular/cdk/stepper'
import { CdkTableModule } from '@angular/cdk/table'
import { CdkTreeModule } from '@angular/cdk/tree'
import { ReactiveFormsModule } from '@angular/forms'
import { AutocompleteModule } from '../autocomplete/autocomplete.module'

@NgModule({
  declarations: [CompetencyLabelsComponent],
  imports: [
    CommonModule,
    AutocompleteModule,
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
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  entryComponents: [CompetencyLabelsComponent],
  exports: [CompetencyLabelsComponent],
})
export class CompetencyLabelsModule { }
