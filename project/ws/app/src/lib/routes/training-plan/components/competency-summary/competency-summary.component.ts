import { Component, Input, OnChanges, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-competency-summary',
  templateUrl: './competency-summary.component.html',
  styleUrls: ['./competency-summary.component.scss'],
})
export class CompetencySummaryComponent implements OnInit, OnChanges {
  @Input() contentData: any
  @Input() selectContentCount: any
  selectedCardData: any[] = []
  competencySummaryObj: any = [{
    title: 'behaviroal',
    behaviroal: {
      listData: [],
      count: 0,
    },
  }, {
    title: 'functional',
    functional: {
      listData: [],
      count: 0,
    },
  }, {
    title: 'domain',
    domain: {
      listData: [],
      count: 0,
    },
  },
  ]
  selectedIndex = 0
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedCardData = []
    this.competencySummaryObj = [{
      title: 'behaviroal',
      behaviroal: {
        listData: [],
        count: 0,
      },
    }, {
      title: 'functional',
      functional: {
        listData: [],
        count: 0,
      },
    }, {
      title: 'domain',
      domain: {
        listData: [],
        count: 0,
      },
    },
    ]
    this.contentData.map((item: any) => {
      if (item.selected) {
        this.selectedCardData.push(item)
      }
    })

    // let competencyThemeObj = {};

    this.selectedCardData.map((sitem: any) => {
      sitem.competencies_v5.map((fitem: any) => {
        if (fitem.competencyArea.toLowerCase() === 'behaviroal') {
          this.competencySummaryObj[0]['behaviroal']['count'] = this.competencySummaryObj[0]['behaviroal']['count'] + 1

          // competencyThemeObj = this.checkIfThemeNameExists(this.competencySummaryObj['behaviroal']['listData'], fitem);
          this.competencySummaryObj[0]['behaviroal']['listData'].push(fitem)
          this.selectedIndex = 0
        }
        if (fitem.competencyArea.toLowerCase() === 'functional') {
          this.competencySummaryObj[1]['functional']['count'] = this.competencySummaryObj[1]['functional']['count'] + 1
          this.competencySummaryObj[1]['functional']['listData'].push(fitem)
          this.selectedIndex = 1
        }
        if (fitem.competencyArea.toLowerCase() === 'domain') {
          this.competencySummaryObj[2]['domain']['count'] = this.competencySummaryObj[2]['domain']['count'] + 1
          this.competencySummaryObj[2]['domain']['listData'].push(fitem)
          this.selectedIndex = 2
        }
      })
    })
  }

  // checkIfThemeNameExists(arr:any, fitem:any):object {
  //   arr.map((sitem:any)=>{
  //     if(sitem.competencyTheme === fitem.competencyTheme) {

  //     }
  //   })
  //   return {"themeName": "", "themeCount": 0};
  // }

}
