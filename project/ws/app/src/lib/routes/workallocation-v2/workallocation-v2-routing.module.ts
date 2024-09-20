import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Routes, RouterModule } from '@angular/router'
import { CreateWorkallocationComponent } from './routes/create-workallocation/create-workallocation.component'
import { WorkallocationV2HomeComponent } from './routes/workallocation-v2-home/workallocation-v2-home.component'
import { DraftAllocationsComponent } from './routes/draft-allocations/draft-allocations.component'
import { PublishedAllocationsComponent } from './routes/published-allocations/published-allocations.component'
import { PageResolve } from '@sunbird-cb/utils'
import { UserWorkResolverService } from './services/user-work-resolver.service'
// import { UpdateWorkallocationComponent } from './routes/update-workallocation/update-workallocation.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'create',
  },
  {
    path: '',
    component: WorkallocationV2HomeComponent,
    children: [
      {
        path: 'create/:workorder',
        component: CreateWorkallocationComponent,
        data: {
          pageType: 'feature',
          pageKey: 'wat-comp-defaults',
          pageId: 'create/:workorder',
          module: 'Work Allocation',
        },

        resolve: {
          pageData: PageResolve,
        },
      },
      {
        path: 'update/:workorder/:officerId',
        component: CreateWorkallocationComponent,
        data: {
          pageType: 'feature',
          pageKey: 'wat-comp-defaults',
          pageId: 'update',
          module: 'Work Allocation',
        },
        resolve: {
          pageData: PageResolve,
          watData: UserWorkResolverService,
        },
      },
      {
        path: 'drafts/:workorder',
        component: DraftAllocationsComponent,
        data: {
          pageId: 'drafts/:workorder',
          module: 'Work Allocation',
        },
      },
      {
        path: 'published/:workorder',
        component: PublishedAllocationsComponent,
        data: {
          pageId: 'published/:workorder',
          module: 'Work Allocation',
        },
      },
      {
        path: ':userId',
        data: {
          pageId: ':userId',
          module: 'Work Allocation',
        },
        // component: UpdateWorkallocationComponent,
      }],
  },
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [UserWorkResolverService],
})
export class WorkallocationV2RoutingModule { }
