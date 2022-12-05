import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AddCoursesComponent } from './routes/add-courses/add-courses.component'
import { AddMembersComponent } from './routes/add-members/add-members.component'
import { BatchDetailsComponent } from './routes/batch-details/batch-details.component'
import { MandatoryCourseHomeComponent } from './routes/mandatory-course-home/mandatory-course-home.component'
import { MandatoryCourseComponent } from './routes/mandatory-course/mandatory-course.component'

const routes: Routes = [
  {
    path: '',
    component: MandatoryCourseHomeComponent,
    children: [
      {
        path: ':doId',
        component: MandatoryCourseComponent,
      },
      {
        path: ':doId/choose-courses',
        component: AddCoursesComponent,
      },
      {
        path: ':doId/batch-details/:batchId',
        component: BatchDetailsComponent,
      },
      {
        path: ':doId/batch-details/:batchId/choose-members',
        component: AddMembersComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MandatoryCoursesRoutingModule { }
