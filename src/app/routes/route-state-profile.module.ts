import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StateProfileModule } from '@ws/app/src/lib/routes/state-profile/state-profile.module'
@NgModule({
  imports: [
    CommonModule, StateProfileModule],
  exports: [StateProfileModule],
})
export class RouteStateProfileModule { }
