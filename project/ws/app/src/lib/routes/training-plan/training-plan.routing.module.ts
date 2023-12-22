import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ConfigResolveService } from './resolvers/config-resolve.service'
import { TrainingPlanHomeComponent } from './routes/training-plan-home/training-plan-home.component'
import { CreatePlanComponent } from './routes/create-plan/create-plan.component'
import { PreviewPlanComponent } from './routes/preview-plan/preview-plan.component'
import { UpdatePlanResolveService } from './resolvers/update-plan-resolve.service'

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
        path: 'update-plan/:planId',
        component: CreatePlanComponent,
        data: {
          pageId: 'update-plan',
          module: 'Create Plan',
        },
        resolve: {
          contentData: UpdatePlanResolveService
        }
      },
      {
        path: 'preview-plan',
        component: PreviewPlanComponent,
        data: {
          pageId: 'preview-plan',
          module: 'Preview Plan',
        },
      },
      {
        path: 'preview-plan-for-dashboard/:planId',
        component: PreviewPlanComponent,
        data: {
          pageId: 'preview-plan',
          module: 'Preview Plan',
        },
        resolve: {
          contentData: UpdatePlanResolveService
        }
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
