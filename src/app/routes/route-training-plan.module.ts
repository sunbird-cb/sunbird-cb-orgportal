import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TrainingPlanModule } from '../../../project/ws/app/src/lib/routes/training-plan/training-plan.module'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TrainingPlanModule,
  ],
  exports: [
    TrainingPlanModule,
  ],
})
export class RouteTrainingPlanAppModule { }
