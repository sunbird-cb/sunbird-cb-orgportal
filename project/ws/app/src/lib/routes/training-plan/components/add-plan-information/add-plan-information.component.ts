import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { debounceTime } from 'rxjs/operators'
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ws-app-add-plan-information',
  templateUrl: './add-plan-information.component.html',
  styleUrls: ['./add-plan-information.component.scss'],
})
export class AddPlanInformationComponent implements OnInit {

  @Output() planTitleInvalid = new EventEmitter<any>()

  contentForm!: FormGroup
  private subscr:Subscription = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private tpdsSvc: TrainingPlanDataSharingService
  ) { }

  ngOnInit() {
    
    const noSpecialChar = new RegExp(/^[\u0900-\u097F\u0980-\u09FF\u0C00-\u0C7F\u0B80-\u0BFF\u0C80-\u0CFF\u0D00-\u0D7F\u0A80-\u0AFF\u0B00-\u0B7F\u0A00-\u0A7Fa-zA-Z0-9()$[\]\\.:,_/ -]*$/)
    if (!this.tpdsSvc.trainingPlanTitle) {
      this.planTitleInvalid.emit(true)
    }
    this.contentForm = this.formBuilder.group({
      name:
        new FormControl('', [Validators.required, Validators.pattern(noSpecialChar), Validators.minLength(10)]),
    })

    this.subscr = this.subscr.add(this.contentForm.controls['name'].valueChanges.pipe(debounceTime(500)).subscribe((_ele: any) => {
      if (!this.contentForm.invalid) {
        this.tpdsSvc.trainingPlanTitle = _ele
        this.tpdsSvc.trainingPlanStepperData.name = _ele
      }
      this.planTitleInvalid.emit(this.contentForm.invalid)
    }));

    if (this.tpdsSvc.trainingPlanTitle) {
      this.contentForm.controls['name'].setValue(this.tpdsSvc.trainingPlanTitle)
    }
  }

  ngOnDestroy() {
    if(this.subscr) {
      this.subscr.unsubscribe();
    }
    
  }

}


