import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MandatoryCoursesRoutingModule } from './mandatory-courses-routing.module';
import { MandatoryCoursesHomeComponent } from './routes/mandatory-courses-home/mandatory-courses-home/mandatory-courses-home.component';


@NgModule({
  declarations: [MandatoryCoursesHomeComponent],
  imports: [
    CommonModule,
    MandatoryCoursesRoutingModule
  ]
})
export class MandatoryCoursesModule { }
