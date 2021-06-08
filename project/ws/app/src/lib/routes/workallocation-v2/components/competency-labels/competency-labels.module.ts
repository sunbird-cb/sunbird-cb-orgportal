import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CompetencyLabelsComponent } from './competency-labels.component'
import {
  MatAutocompleteModule, MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule, MatSelectModule, MatSnackBarModule,
} from '@angular/material'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { CdkStepperModule } from '@angular/cdk/stepper'
import { CdkTableModule } from '@angular/cdk/table'
import { CdkTreeModule } from '@angular/cdk/tree'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AutocompleteModule } from '../autocomplete/autocomplete.module'
import { WatCompPopupComponent } from './wat-comp-popup/wat-comp-popup.component'

@NgModule({
  declarations: [
    CompetencyLabelsComponent, WatCompPopupComponent,
  ],
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
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
    MatSelectModule,
    MatRadioModule,
  ],
  entryComponents: [WatCompPopupComponent],
  exports: [CompetencyLabelsComponent],
})
export class CompetencyLabelsModule { }
