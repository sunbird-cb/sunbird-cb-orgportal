import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ConfigResolveService } from '../home/resolvers/config-resolve.service'
import { BatchDetailsComponent } from './components/batch-details/batch-details.component'
import { BatchListComponent } from './components/batch-list/batch-list.component'
import { BlendedHomeComponent } from './components/blended-home/blended-home.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: '',
    component: BlendedHomeComponent,
    resolve: {
      configService: ConfigResolveService,
    },
    children: [
      {
        path: ':id/batches',
        component: BatchListComponent,
        data: {
          pageId: ':id',
          module: 'blended-approvals',
        },
      },
      {
        path: ':id/batches/:batchid',
        component: BatchDetailsComponent,
        data: {
          pageId: ':id',
          module: 'blended-approvals',
        },
      },
    ],
  },
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [],
})
export class BlendedApprovalsRoutingModule { }
