import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MandatoryCoursesRoutingModule } from './mandatory-courses-routing.module'
import { MandatoryCourseComponent } from './routes/mandatory-courses-home/mandatory-courses-home/mandatory-course.component'
import { NoDataComponent } from './components/no-data/no-data.component'
import { MandatoryCourseHomeComponent } from './routes/mandatory-course-home/mandatory-course-home.component'
import { AddCoursesComponent } from './routes/add-courses/add-courses.component'

@NgModule({
  declarations: [MandatoryCourseComponent, NoDataComponent, MandatoryCourseHomeComponent, AddCoursesComponent],
  imports: [
    CommonModule,
    MandatoryCoursesRoutingModule,
  ],
})
export class MandatoryCoursesModule { }
