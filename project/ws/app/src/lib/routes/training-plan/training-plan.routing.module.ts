import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ConfigResolveService } from './resolvers/config-resolve.service'
import { TrainingPlanHomeComponent } from './routes/training-plan-home/training-plan-home.component'
import { CreatePlanComponent } from './routes/create-plan/create-plan.component'
import { PreviewPlanComponent } from './routes/preview-plan/preview-plan.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'create-plan',
  },
  {
    path: '',
    component: TrainingPlanHomeComponent,
    resolve: {
      configService: ConfigResolveService,
    },
    children: [
      {
        path: 'create-plan',
        component: CreatePlanComponent,
        data: {
          pageId: 'create-plan',
          module: 'Create Plan',
        },
      },
      {
        path: 'preview-plan',
        component: PreviewPlanComponent,
        data: {
          pageId: 'preview-plan',
          module: 'Preview Plan',
        },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    ConfigResolveService,
  ],
})
export class TrainingPlanRoutingModule { }
