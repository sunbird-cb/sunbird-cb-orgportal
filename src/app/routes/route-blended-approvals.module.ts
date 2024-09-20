import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BlendedApprovalsModule } from '@ws/app'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BlendedApprovalsModule,
  ],
  exports: [
    BlendedApprovalsModule,
  ],
})
export class RouteBlendedApprovalsModule { }
