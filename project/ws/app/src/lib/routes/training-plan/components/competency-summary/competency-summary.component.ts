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
    title: 'behavioural',
    behavioural: {
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
      title: 'behavioural',
      behavioural: {
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
    if (this.contentData) {
      this.contentData.map((item: any) => {
        if (item.selected) {
          this.selectedCardData.push(item)
        }
      })
    }
    // let competencyThemeObj = {};

    if (this.selectedCardData) {
      let fObj = { competencyTheme: '', count: 0 }
      this.selectedCardData.map((sitem: any) => {
        if (sitem && sitem.competencies_v5) {
          sitem.competencies_v5.map((fitem: any) => {
            if (fitem.competencyArea.toLowerCase() === 'behavioral') {
              const result = this.checkIfThemeNameExists(this.competencySummaryObj[0]['behavioural']['listData'], fitem)
              fObj = { competencyTheme: fitem.competencyTheme, count: 1 }
              if (result) {
                this.competencySummaryObj[0]['behavioural']['count'] = this.competencySummaryObj[0]['behavioural']['count'] + 1
                this.competencySummaryObj[0]['behavioural']['listData'].push(fObj)
              }
              this.selectedIndex = 0
            }
            if (fitem.competencyArea.toLowerCase() === 'functional') {
              const result = this.checkIfThemeNameExists(this.competencySummaryObj[1]['functional']['listData'], fitem)
              fObj = { competencyTheme: fitem.competencyTheme, count: 1 }
              if (result) {
                this.competencySummaryObj[1]['functional']['count'] = this.competencySummaryObj[1]['functional']['count'] + 1
                this.competencySummaryObj[1]['functional']['listData'].push(fObj)
              }
              this.selectedIndex = 1
            }
            if (fitem.competencyArea.toLowerCase() === 'domain') {
              const result = this.checkIfThemeNameExists(this.competencySummaryObj[2]['domain']['listData'], fitem)
              fObj = { competencyTheme: fitem.competencyTheme, count: 1 }
              if (result) {
                this.competencySummaryObj[2]['domain']['count'] = this.competencySummaryObj[2]['domain']['count'] + 1
                this.competencySummaryObj[2]['domain']['listData'].push(fObj)
              }
              this.selectedIndex = 2
            }
          })
        }

      })
    }
  }

  checkIfThemeNameExists(arr: any, fitem: any): boolean {
    let flag = true
    arr.map((sitem: any) => {
      if (sitem.competencyTheme === fitem.competencyTheme) {
        sitem['count'] = sitem['count'] + 1
        flag = false
      }
    })
    return flag
  }

}
