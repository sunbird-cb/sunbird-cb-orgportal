import { Component, EventEmitter, Input, Output, OnInit, OnChanges, ChangeDetectorRef, ViewChild } from '@angular/core'
import { MatPaginator, PageEvent } from '@angular/material'
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
  @Input() showPagination = false
  @Input() count = 0
  @Output() handleSelectedChips = new EventEmitter()
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | any
  dataSource: any
  selectedContent: any[] = []
  startIndex = 0
  lastIndex = 20
  pageSize = 20
  defaultPosterImage: SafeUrl | null = '/assets/instances/eagle/app_logos/default.png'
  defaultThumbnail: SafeUrl | null = 'assets/instances/eagle/app_logos/KarmayogiBharat_Logo.svg'
  constructor(
    private tpdsSvc: TrainingPlanDataSharingService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.tpdsSvc.clearFilter.subscribe(() => {
      this.resetPageIndex()
    })
    if (this.tpdsSvc.trainingPlanStepperData.status && this.tpdsSvc.trainingPlanStepperData.status.toLowerCase() === 'live') {
      this.showDeleteFlag = false
    }
  }

  ngOnChanges() {
    // console.log('this.contentData', this.contentData);
    this.changeDetectorRef.detectChanges()

    // this.dataSource = new MatTableDataSource<any>(this.contentData);
    // this.dataSource.paginator = this.paginator;
  }

  onChangePage(pe: PageEvent) {
    this.startIndex = (pe.pageIndex) * pe.pageSize
    this.lastIndex = pe.pageSize
    this.tpdsSvc.handleContentPageChange.next({ pageIndex: this.startIndex, pageSize: pe.pageSize})
    // this.startIndex = this.pageIndex
  }

  selectContentItem(event: any, item: any) {
    if (event.checked) {
      // this.selectedContent.push(item);
      this.tpdsSvc.trainingPlanContentData.data.content.map((sitem: any, index: any) => {
        if (sitem.identifier === item.identifier) {
          sitem['selected'] = true
          this.tpdsSvc.trainingPlanContentData.data.content.splice(index, 1)
          this.tpdsSvc.trainingPlanContentData.data.content.unshift(sitem)
        }
      })

      if (this.tpdsSvc.trainingPlanStepperData['contentList']) {
        this.tpdsSvc.trainingPlanStepperData['contentList'].push(item.identifier)
      }
    } else {
      // this.selectedContent = this.selectedContent.filter( sitem  => sitem.identifier !== item.identifier)
      this.tpdsSvc.trainingPlanContentData.data.content.map((sitem: any) => {
        if (sitem.identifier === item.identifier) {
          sitem['selected'] = false
        }
      })
      this.tpdsSvc.trainingPlanStepperData['contentList'].filter((identifier: any, index: any) => {
        if (identifier === item.identifier) {
          this.tpdsSvc.trainingPlanStepperData['contentList'].splice(index, 1)
        }
      })
    }
    this.handleSelectedChips.emit(true)
  }

  deleteItem(item: any) {
    this.tpdsSvc.trainingPlanContentData.data.content.map((sitem: any) => {
      if (sitem.identifier === item.identifier) {
        sitem['selected'] = false
      }
    })
    this.contentData.filter((sitem: any, index: any) => {
      if (sitem.identifier === item.identifier) {
        this.contentData.splice(index, 1)
      }
    })
    this.tpdsSvc.trainingPlanStepperData['contentList'].filter((identifier: any, index: any) => {
      if (identifier === item.identifier) {
        this.tpdsSvc.trainingPlanStepperData['contentList'].splice(index, 1)
      }
    })
  }

  resetPageIndex() {
    this.startIndex = 0
    this.lastIndex = 20
    this.pageSize = 20
    if (this.paginator) {
      this.paginator.pageIndex = 0
      this.paginator.pageSize = 20
    }

  }

}
