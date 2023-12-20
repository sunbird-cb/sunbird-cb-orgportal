import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { debounceTime } from 'rxjs/operators'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'

@Component({
  selector: 'ws-app-add-plan-information',
  templateUrl: './add-plan-information.component.html',
  styleUrls: ['./add-plan-information.component.scss'],
})
export class AddPlanInformationComponent implements OnInit {

  @Output() planTitleInvalid = new EventEmitter<any>()

  contentForm!: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private trainingPlanDataSharingSvc: TrainingPlanDataSharingService
  ) { }

  ngOnInit() {
    if (!this.trainingPlanDataSharingSvc.trainingPlanTitle) {
      this.planTitleInvalid.emit(true)
    }
    this.contentForm = this.formBuilder.group({
      name:
        new FormControl((this.trainingPlanDataSharingSvc.trainingPlanTitle) ? this.trainingPlanDataSharingSvc.trainingPlanTitle : '',
                        [Validators.required, Validators.minLength(10)]),
    })
    
    this.contentForm.controls['name'].valueChanges.pipe(debounceTime(200)).subscribe((_ele: any) => {
      if (!this.contentForm.invalid) {
        this.trainingPlanDataSharingSvc.trainingPlanTitle = _ele
        this.trainingPlanDataSharingSvc.trainingPlanStepperData.name = _ele
      }
      this.planTitleInvalid.emit(this.contentForm.invalid)
    })
  }

}
