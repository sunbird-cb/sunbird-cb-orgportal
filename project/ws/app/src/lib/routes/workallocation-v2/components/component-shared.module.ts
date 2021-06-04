import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatSidenavModule, MatGridListModule, MatListModule, MatCardModule, MatFormFieldModule, MatInputModule,
  MatIconModule, MatButtonModule, MatRadioModule, MatDialogModule, MatSelectModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatTableModule, MatAutocompleteModule, MatExpansionModule, MatDividerModule, MatTabsModule, MatMenuModule,
} from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { UserAutocompleteCardComponent } from './user-autocomplete-card/user-autocomplete-card.component'
import { ExportAsModule } from 'ngx-export-as'
import { AutocompleteModule } from './autocomplete/autocomplete.module'
import { InitialAvatarComponent } from './initial-avatar/initial-avatar.component'
import { PublishPopupComponent } from './publish-popup/publish-popup.component'

@NgModule({
  declarations: [
    UserAutocompleteCardComponent,
    InitialAvatarComponent,
    PublishPopupComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule, FormsModule, ReactiveFormsModule, MatSidenavModule, MatListModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatGridListModule,
    MatRadioModule, MatDialogModule, MatSelectModule, MatProgressSpinnerModule,
    MatExpansionModule, MatDividerModule, MatPaginatorModule, MatTableModule,
    ExportAsModule, MatMenuModule, MatTabsModule, MatProgressSpinnerModule, MatAutocompleteModule,
    AutocompleteModule,
  ],
  exports: [
    UserAutocompleteCardComponent,
    InitialAvatarComponent,
    PublishPopupComponent,
  ],
  entryComponents: [PublishPopupComponent],
})
export class ComponentSharedModule { }
