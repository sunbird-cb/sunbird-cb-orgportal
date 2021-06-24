import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CountComponent } from './count.component'

@NgModule({
  declarations: [CountComponent],
  imports: [
    CommonModule,
  ],
  exports: [CountComponent],
})
export class CountModule { }
