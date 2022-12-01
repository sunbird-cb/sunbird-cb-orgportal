import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AddCoursesComponent } from './routes/add-courses/add-courses.component'
import { MandatoryCourseHomeComponent } from './routes/mandatory-course-home/mandatory-course-home.component'
import { MandatoryCourseComponent } from './routes/mandatory-courses-home/mandatory-courses-home/mandatory-course.component'

const routes: Routes = [
  {
    path: '',
    component: MandatoryCourseHomeComponent,
    children: [
      {
        path: ':id',
        component: MandatoryCourseComponent,
      },
      {
        path: ':id/courses',
        component: AddCoursesComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MandatoryCoursesRoutingModule { }
