import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Routes, RouterModule } from '@angular/router'
import { CreateWorkallocationComponent } from './routes/create-workallocation/create-workallocation.component'
import { UpdateWorkallocationComponent } from './routes/update-workallocation/update-workallocation.component'

const routes: Routes = [
  {
    path: 'create',
    component: CreateWorkallocationComponent,
  },
  {
    path: 'details/:userId',
    component: UpdateWorkallocationComponent,
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
export class WorkallocationRoutingModule { }
