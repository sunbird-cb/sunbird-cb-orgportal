import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WorkallocationModule } from '@ws/app'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WorkallocationModule,
  ],
  exports: [
    WorkallocationModule,
  ],
})
export class RouteWorkAllocationModule { }
