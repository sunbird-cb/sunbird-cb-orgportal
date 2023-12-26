import { Component, EventEmitter, Input, Output, OnInit, OnChanges, ChangeDetectorRef, ViewChild } from '@angular/core'
import { MatPaginator, PageEvent } from '@angular/material';
import { TrainingPlanDataSharingService } from '../../services/training-plan-data-share.service'
import { SafeUrl } from '@angular/platform-browser'

@Component({
  selector: 'ws-app-standard-card',
  templateUrl: './standard-card.component.html',
  styleUrls: ['./standard-card.component.scss'],
})
export class StandardCardComponent implements OnInit, OnChanges {
  @Input() cardSize: any
  @Input() checkboxVisibility: any = true
  @Input() contentData: any[] = []
  @Input() showDeleteFlag = false
  @Input() showPagination = false;  
  @Input() count = 0;
  @Output() handleSelectedChips = new EventEmitter()
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator | any;
  dataSource: any;
  selectedContent: any[] = []
  startIndex = 0;
  lastIndex = 20; 
  pageSize = 20;  
  defaultPosterImage: SafeUrl | null = '/assets/instances/eagle/app_logos/default.png';
  defaultThumbnail: SafeUrl | null = 'assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg'
  constructor(private trainingPlanDataSharingService: TrainingPlanDataSharingService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.trainingPlanDataSharingService.clearFilter.subscribe(()=>{
      this.resetPageIndex();
    })
  }

  ngOnChanges() {
    this.changeDetectorRef.detectChanges();
    console.log('this.contentData', this.contentData)
    // this.dataSource = new MatTableDataSource<any>(this.contentData);
    // this.dataSource.paginator = this.paginator;
    console.log('this.dataSource', this.dataSource);
  }

  onChangePage(pe: PageEvent) {
    console.log(pe.pageIndex);
    console.log(pe.pageSize);
    this.startIndex = (pe.pageIndex) * pe.pageSize;
    this.lastIndex = (pe.pageIndex + 1) * pe.pageSize ;
    this.trainingPlanDataSharingService.handleContentPageChange.next({pageIndex: this.startIndex, pageSize: this.lastIndex});
    // this.startIndex = this.pageIndex
  }

  selectContentItem(event: any, item: any) {
    if (event.checked) {
      // this.selectedContent.push(item);
      this.trainingPlanDataSharingService.trainingPlanContentData.data.content.map((sitem: any, index: any) => {
        if (sitem.identifier === item.identifier) {
          sitem['selected'] = true
          this.trainingPlanDataSharingService.trainingPlanContentData.data.content.splice(index, 1)
          this.trainingPlanDataSharingService.trainingPlanContentData.data.content.unshift(sitem)
        }
      })

      if (this.trainingPlanDataSharingService.trainingPlanStepperData['contentList']) {
        this.trainingPlanDataSharingService.trainingPlanStepperData['contentList'].push(item.identifier)
      }
      console.log(this.trainingPlanDataSharingService.trainingPlanContentData)
    } else {
      // this.selectedContent = this.selectedContent.filter( sitem  => sitem.identifier !== item.identifier)
      this.trainingPlanDataSharingService.trainingPlanContentData.data.content.map((sitem: any) => {
        if (sitem.identifier === item.identifier) {
          sitem['selected'] = false
        }
      })
      this.trainingPlanDataSharingService.trainingPlanStepperData['contentList'].filter((identifier: any, index: any) => {
        if (identifier === item.identifier) {
          this.trainingPlanDataSharingService.trainingPlanStepperData['contentList'].splice(index, 1)
        }
      })
    }
    this.handleSelectedChips.emit(true)
  }

  deleteItem(item: any) {
    this.trainingPlanDataSharingService.trainingPlanContentData.data.content.map((sitem: any) => {
      if (sitem.identifier === item.identifier) {
        sitem['selected'] = false
      }
    })
    this.contentData.filter((sitem: any, index: any) => {
      if (sitem.identifier === item.identifier) {
        this.contentData.splice(index, 1)
      }
    })
    this.trainingPlanDataSharingService.trainingPlanStepperData['contentList'].filter((identifier: any, index: any) => {
      if (identifier === item.identifier) {
        this.trainingPlanDataSharingService.trainingPlanStepperData['contentList'].splice(index, 1)
      }
    })
  }

  resetPageIndex() {
    this.startIndex = 0;
    this.lastIndex = 20;
    this.pageSize = 20;
    if(this.paginator) {
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = 20;
    }
   
  }

}
