import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { StateProfileHomeComponent } from './routes/state-profile-home/state-profile-home.component'
import { WelcomeOnboardComponent } from './routes/welcome-onboard/welcome-onboard.component'
import { InstituteProfileComponent } from './routes/institute-profile/institute-profile.component'
import { RolesAndFunctionsComponent } from './routes/roles-and-functions/roles-and-functions.component'
import { InfrastructureComponent } from './routes/infrastructure/infrastructure.component'
import { TrainingRogramsComponent } from './routes/training-rograms/training-rograms.component'
import { ResearchComponent } from './routes/research/research.component'
import { ConsultancyComponent } from './routes/consultancy/consultancy.component'
import { FacultyComponent } from './routes/faculty/faculty.component'
import { PageResolve } from '@sunbird-cb/utils'

const routes: Routes = [
  {
    path: '',
    component: StateProfileHomeComponent,
    data: {
      pageId: '',
      module: 'state-profile',
    },
    resolve: {
      // competencies: CompetencyResolverService,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'welcome',
      },
      {
        path: 'welcome',
        component: WelcomeOnboardComponent,
        data: {
          pageId: 'state-profile/wolcome',
          module: 'Setup',
        },
      },
      {
        path: 'institute-profile',
        component: InstituteProfileComponent,
        data: {
          pageId: 'state-profile/institute-profile',
          module: 'Setup',
          pageType: 'feature',
          pageKey: 'institute-profile',
        },
        resolve: {
          pageData: PageResolve,
        },
      },
      {
        path: 'roles',
        component: RolesAndFunctionsComponent,
        data: {
          pageId: 'state-profile/roles',
          module: 'Setup',
        },
      },
      {
        path: 'infra',
        component: InfrastructureComponent,
        data: {
          pageId: 'state-profile/infra',
          module: 'Setup',
        },
      },
      {
        path: 'training-programs',
        component: TrainingRogramsComponent,
        data: {
          pageId: 'state-profile/training-programs',
          module: 'Setup',
        },
      },
      {
        path: 'research',
        component: ResearchComponent,
        data: {
          pageId: 'state-profile/research',
          module: 'Setup',
        },
      },
      {
        path: 'consultancy',
        component: ConsultancyComponent,
        data: {
          pageId: 'state-profile/consultancy',
          module: 'Setup',
        },
      },
      {
        path: 'faculty',
        component: FacultyComponent,
        data: {
          pageId: 'state-profile/faculty',
          module: 'Setup',
        },
      },

    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    // TopicResolverService,
    // CompetencyResolverService,
  ],
  // Don't forget to pass RouteResolver into the providers array
})

export class StateProfileRoutingModule { }
