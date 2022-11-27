import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MandatoryCoursesModule } from '../../../project/ws/app/src/lib/routes/mandatory-courses/mandatory-courses.module'
// import { MandatoryCoursesModule }

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MandatoryCoursesModule,
  ],
  exports: [
    MandatoryCoursesModule,
  ],
})
export class RouteMandatoryCoursesModule { }
