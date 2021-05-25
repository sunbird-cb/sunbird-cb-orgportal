import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Routes, RouterModule } from '@angular/router'
import { CreateWorkallocationComponent } from './routes/create-workallocation/create-workallocation.component'
import { WorkallocationV2HomeComponent } from './routes/workallocation-v2-home/workallocation-v2-home.component'
import { DraftAllocationsComponent } from './routes/draft-allocations/draft-allocations.component';
import { PublishedAllocationsComponent } from './routes/published-allocations/published-allocations.component';
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
        path: 'create',
        component: CreateWorkallocationComponent,
      },
      {
        path: 'drafts',
        component: DraftAllocationsComponent,
      },
      {
        path: 'published',
        component: PublishedAllocationsComponent,
      },
      {
        path: ':userId',
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
})
export class WorkallocationV2RoutingModule { }
