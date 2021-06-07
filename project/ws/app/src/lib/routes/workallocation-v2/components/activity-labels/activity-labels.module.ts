import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivityLabelsComponent } from './activity-labels.component'
import {
  MatAutocompleteModule, MatCardModule,
  MatCheckboxModule,
  MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSnackBarModule,
} from '@angular/material'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { CdkStepperModule } from '@angular/cdk/stepper'
import { CdkTableModule } from '@angular/cdk/table'
import { CdkTreeModule } from '@angular/cdk/tree'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AutocompleteModule } from '../autocomplete/autocomplete.module'
import { ComponentSharedModule } from '../component-shared.module'
import { WatRolePopupComponent } from './wat-role-popup/wat-role-popup.component'
@NgModule({
  declarations: [
    ActivityLabelsComponent,
    WatRolePopupComponent,
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
    ComponentSharedModule,
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
  ],
  entryComponents: [WatRolePopupComponent],
  exports: [ActivityLabelsComponent],
  // providers: [{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
  // { provide: MatDialogRef, useValue: {} },]
})
export class ActivityLabelsModule { }
