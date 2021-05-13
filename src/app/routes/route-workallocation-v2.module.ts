import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WorkallocationV2Module } from '@ws/app'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WorkallocationV2Module,
  ],
  exports: [
    WorkallocationV2Module,
  ],
})
export class RouteWorkAllocationV2Module { }
