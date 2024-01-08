import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AcsendingOrderPipe } from './acsending-order.pipe'

@NgModule({
  declarations: [AcsendingOrderPipe],
  imports: [
    CommonModule,
  ],
  exports: [AcsendingOrderPipe],
})
export class PipeAcsendingOrderModule { }
