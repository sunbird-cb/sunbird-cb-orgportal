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
    private tpdsSvc: TrainingPlanDataSharingService
  ) { }

  ngOnInit() {
    if (!this.tpdsSvc.trainingPlanTitle) {
      this.planTitleInvalid.emit(true)
    }
    this.contentForm = this.formBuilder.group({
      name:
        new FormControl('', [Validators.required, Validators.minLength(10)]),
    })

    this.contentForm.controls['name'].valueChanges.pipe(debounceTime(500)).subscribe((_ele: any) => {
      if (!this.contentForm.invalid) {
        this.tpdsSvc.trainingPlanTitle = _ele
        this.tpdsSvc.trainingPlanStepperData.name = _ele
      }
      this.planTitleInvalid.emit(this.contentForm.invalid)
    })

    if (this.tpdsSvc.trainingPlanTitle) {
      this.contentForm.controls['name'].setValue(this.tpdsSvc.trainingPlanTitle)
    }
  }

}
