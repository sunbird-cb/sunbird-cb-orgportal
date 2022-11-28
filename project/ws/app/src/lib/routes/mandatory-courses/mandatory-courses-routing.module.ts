import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { MandatoryCoursesHomeComponent } from './routes/mandatory-courses-home/mandatory-courses-home/mandatory-courses-home.component'


const routes: Routes = [
  {
    path: '',
    component: MandatoryCoursesHomeComponent,
  },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MandatoryCoursesRoutingModule { }
