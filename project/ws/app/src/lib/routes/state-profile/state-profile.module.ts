import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatSnackBarModule } from '@angular/material'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { RouterModule } from '@angular/router'
import { StateProfileRoutingModule } from './state-profile-routing.module'
import { SetupLeftMenuComponent } from './components/left-menu/left-menu.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TopicService } from './services/topics.service'
// import { PlayerVideoComponent } from '@sunbird-cb/collection/src/lib/player-video/player-video.component'
import { PlatformWalkthroughComponent } from './routes/platform-walkthrough/platform-walkthrough.component'
import { RolesAndActivityService } from './services/rolesandActivities.service'
import { LevelCardComponent } from './components/level-card/level-card.component'
import { LevelInfoComponent } from './components/level-info/level-info.component'
import { CompTooltipDirective } from './directives/tooltip.directive'
import { WelcomeOnboardComponent } from './routes/welcome-onboard/welcome-onboard.component'
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component'
import { CompLocalService } from './services/comp.service'
import { StateProfileHomeComponent } from './routes/state-profile-home/state-profile-home.component'
import { ConsultancyComponent } from './routes/consultancy/consultancy.component'
import { FacultyComponent } from './routes/faculty/faculty.component'
import { InfrastructureComponent } from './routes/infrastructure/infrastructure.component'
import { InstituteProfileComponent } from './routes/institute-profile/institute-profile.component'
import { ResearchComponent } from './routes/research/research.component'
import { RolesAndFunctionsComponent } from './routes/roles-and-functions/roles-and-functions.component'
import { TrainingRogramsComponent } from './routes/training-rograms/training-rograms.component'
import { MatRadioModule } from '@angular/material/radio'
import { OrgProfileService } from './services/org-profile.service'

@NgModule({
  declarations: [
    StateProfileHomeComponent,
    SetupLeftMenuComponent,
    PlatformWalkthroughComponent,
    LevelCardComponent,
    LevelInfoComponent,
    CompTooltipDirective,
    WelcomeOnboardComponent,
    DialogBoxComponent,
    ConsultancyComponent,
    FacultyComponent,
    InfrastructureComponent,
    InstituteProfileComponent,
    ResearchComponent,
    RolesAndFunctionsComponent,
    TrainingRogramsComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    StateProfileRoutingModule,
    FormsModule,
    MatCheckboxModule,
    MatInputModule,
    // TreeCatalogModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatSelectModule,
    MatRadioModule,
  ],
  providers: [
    TopicService,
    RolesAndActivityService,
    CompLocalService,
    OrgProfileService,
  ],
  entryComponents: [
    DialogBoxComponent,
  ],
})
export class StateProfileModule { }
