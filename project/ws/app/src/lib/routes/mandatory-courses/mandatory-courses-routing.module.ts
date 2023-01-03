import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PageResolve } from '@sunbird-cb/utils'
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
        data: {
          pageType: 'feature',
          pageKey: 'mandatory-courses',
          pageId: 'app/mandatory-courses',
          module: 'mandatory-courses',
        },
        resolve: {
          pageData: PageResolve,
        },
      },
      {
        path: ':doId/choose-courses',
        component: AddCoursesComponent,
        data: {
          label: 'choose-courses'
        }
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
