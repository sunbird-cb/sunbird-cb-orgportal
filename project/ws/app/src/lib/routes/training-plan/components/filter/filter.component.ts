import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { TrainingPlanService } from './../../services/traininig-plan.service';
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ws-app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Output() toggleFilter = new EventEmitter()
  providersList: any[] = [];
  selectedProviders: any[] = [];
  competencyTypeList = [{ "id": "Behavioral", name: 'Behavioural' }, { "id": 'Functional', name: 'Functional' }, { "id": 'Domain', name: 'Domain' }];
  competencyList: any = [];
  competencyThemeList: any[] = [];
  competencySubThemeList: any[] = [];
  searchThemeControl = new FormControl();
  constructor(private trainingPlanService: TrainingPlanService, private trainingPlanDataSharingService: TrainingPlanDataSharingService) { }

  ngOnInit() {
    this.getFilterEntity();
    this.getProviders();
    console.log('trainingPlanDataSharingService--',this.trainingPlanDataSharingService)
    // this.searchThemeControl.valueChanges.pipe(
    //   debounceTime(500),
    // ).subscribe((_value: any) => {
    //   console.log('_value', _value);
    //   if(_value) {
    //     this.competencyThemeList = this.competencyThemeList.filter((sitem) => {
    //       return sitem.name.toLowerCase().includes(_value.toLowerCase());
    //     })
    //     console.log(this.competencyThemeList)
    //   }
     
    // });
  }

  getFilterEntity() {
    let filterObj = {
      "search": {
        "type": "Competency Area"
      },
      "filter": {
        "isDetail": true
      }
    }
    this.trainingPlanService.getFilterEntity(filterObj).subscribe((res: any) => {
      console.log('entity,', res);
      this.competencyList = res;

    })
  }
  getProviders() {
    this.trainingPlanService.getProviders().subscribe((res: any) => {
      console.log('providers,', res);
      this.providersList = res;
    })
  }

  hideFilter() {
    this.toggleFilter.emit(false)
  }

  checkedProviders(event: any, item: any) {
    if (event) {
      this.selectedProviders.push(item);
    } else {
      if (this.selectedProviders.indexOf(item) > -1) {
        const index = this.selectedProviders.findIndex((x: any) => x === item)
        this.selectedProviders.splice(index, 1)
      }
    }
  }

  getCompetencyTheme(event: any, ctype: any) {
    console.log('ctype', ctype, this.competencyList, event);
    if (event.checked) {
      this.competencyList.map((citem: any) => {
        if (citem.name === ctype.id) {
          console.log(citem.name, ctype.name, citem.children)
          citem.children.map((themechild: any) => {
            themechild['parent'] = ctype.id;
          })
          this.competencyThemeList = this.competencyThemeList.concat(citem.children);
          console.log('competencyThemeList', this.competencyThemeList)
        }
      })
    } else {
      this.competencyThemeList = this.competencyThemeList.filter((sitem) => {
        return sitem.parent != ctype.id
      })
    }
    console.log('competencyThemeList', this.competencyThemeList)
  }

  getCompetencySubTheme(event: any, cstype: any) {
    console.log('cstype.parent', cstype.name)
    if (event.checked) {
      this.competencyThemeList.map((csitem: any) => {
        if (csitem.name === cstype.name) {
          csitem.children.map((subthemechild: any) => {
            subthemechild['parentType'] = csitem.parent;
            subthemechild['parent'] = csitem.name;
          })
          this.competencySubThemeList = this.competencySubThemeList.concat(csitem.children);
        }
      })
    } else {
      this.competencySubThemeList = this.competencySubThemeList.filter((sitem) => {
        return sitem.parent != cstype.name
      })
    }
    console.log('this.competencySubThemeList', this.competencySubThemeList);
  }



  manageCompetencySubTheme(event: any, csttype: any) {
    console.log('cstype, event --', event, csttype);
  }
}
