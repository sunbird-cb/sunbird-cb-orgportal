import { NgModule } from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { Routes, RouterModule } from '@angular/router'
import { ConfigResolveService } from '../home/resolvers/config-resolve.service'
import { BatchDetailsComponent } from './components/batch-details/batch-details.component'
import { BatchListComponent } from './components/batch-list/batch-list.component'
import { BlendedHomeComponent } from './components/blended-home/blended-home.component'
import { ProfileViewComponent } from './components/profile-view/profile-view.component'
import { AvatarPhotoComponent } from './components/avatar-photo/avatar-photo.component'
import { CommonModule } from '@angular/common'
import { MatButtonModule, MatCardModule, MatIconModule, MatSidenavModule } from '@angular/material'

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
      {
        path: 'user-profile/:userId',
        component: ProfileViewComponent,
        data: {
          pageId: ':id',
          module: 'blended-approvals',
        },
      },
    ],
  },
]

@NgModule({
  declarations: [
    ProfileViewComponent,
    AvatarPhotoComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
  ],
  exports: [RouterModule],
  providers: [],
})
export class BlendedApprovalsRoutingModule { }
