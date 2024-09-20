import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { LeftMenuComponent } from './left-menu.component'
import {
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatCardModule,
  MatSidenavModule,
  MatListModule,
  MatExpansionModule,
} from '@angular/material'

@NgModule({
  declarations: [LeftMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatChipsModule,
    MatCardModule,
    MatListModule,
    MatExpansionModule,
  ],
  entryComponents: [LeftMenuComponent],
  exports: [
    LeftMenuComponent,
  ],
})
export class LeftMenuModule { }
