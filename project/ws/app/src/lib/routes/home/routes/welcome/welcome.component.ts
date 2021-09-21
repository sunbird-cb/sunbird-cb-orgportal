
import { DOCUMENT } from '@angular/common'
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
/* tslint:disable */
import _ from 'lodash'
import { environment } from '../../../../../../../../../src/environments/environment'
import { ProfileV2Service } from '../../services/home.servive'
import {
  dashboardListData,
} from "../../../../../../../../../src/mdo-assets/data/data"
import { Router } from '@angular/router'
/* tslint:enable */

@Component({
  selector: 'ws-app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss', './bootstrap-rain.scss'],
  /* tslint:disable-next-line */
  encapsulation: ViewEncapsulation.None,
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})

export class WelcomeComponent implements OnInit, AfterViewInit, OnDestroy {
  // sliderData1!: any

  resolutionFilter = 'week'
  compFilter = 'table'
  showCBPLink = false
  showKarmayogiLink = false
  deptName: any

  selectedDashboardId = ''

  // List of available dashboards
  dashboardList = dashboardListData

  currentDashboard: any = []

  dashboardOne = {
    showFilters: 'false',
    showWidgets: 'true',
    widgetTitle: 'This month so far',
    showWidgetTitle: 'true',
    showMessage: true,
    messageType: 'warning',
    message:
      // tslint:disable-next-line:max-line-length
      'Please note that the data shown here is not actual and is only intended to showcase the capability of the platform until the actual usage begins.',
    visualizationDetails: [
      {
        row: 1,
        name: 'Visualization Row 1',
        vizArray: [
          {
            id: 23,
            name: 'Status of work allocation orders (top 5)',
            description: 'Percentage of approved work allocation orders by MDO',
            info: 'Percentage of approved work allocation orders by MDO',
            dimensions: {
              height: 250,
              width: 6,
            },
            vizType: 'chart',
            noUnit: true,
            charts: [
              {
                id: 'topWAT',
                name: 'Status of work allocation orders (top 5)',
                code: '',
                chartType: 'table_bar',
                filter: '',
                headers: [],
              },
            ],
          },
          {
            id: 24,
            name: 'Status of work allocation orders (bottom 5)',
            description: 'Percentage of approved work allocation orders by MDO',
            info: 'Percentage of approved work allocation orders by MDO',
            dimensions: {
              height: 250,
              width: 6,
            },
            vizType: 'chart',
            noUnit: true,
            charts: [
              {
                id: 'btmpWAT',
                name: 'Status of work allocation orders (bottom 5)',
                code: '',
                chartType: 'table_bar',
                filter: '',
                headers: [],
              },
            ],
          },
        ],
      },
      {
        row: 2,
        name: 'Visualization Row 2',
        vizArray: [
          {
            id: 25,
            name: 'Content quality score (Top 5)',
            description: 'Representation of CBP providers based on quality of CBPs (avg. CQS score ) ',
            info: 'Representation of CBP providers based on quality of CBPs (avg. CQS score ) ',
            dimensions: {
              height: 250,
              width: 6,
            },
            vizType: 'chart',
            noUnit: true,
            charts: [
              {
                id: 'cqTop',
                name: 'Content quality score (Top 5)',
                code: '',
                chartType: 'table_bar',
                filter: '',
                headers: [],
              },
            ],
          },
          {
            id: 26,
            name: 'Content quality score (Bottom 5)',
            description: 'Representation of CBP providers based on quality of CBPs (avg. CQS score ) ',
            info: 'Representation of CBP providers based on quality of CBPs (avg. CQS score ) ',
            dimensions: {
              height: 250,
              width: 6,
            },
            vizType: 'chart',
            noUnit: true,
            charts: [
              {
                id: 'cqBtm',
                name: 'Content quality score (Bottom 5)',
                code: '',
                chartType: 'table_bar',
                filter: '',
                headers: [],
              },
            ],
          },
        ],
      },
      {
        row: 3,
        name: 'Visualization Row 3',
        vizArray: [
          {
            id: 27,
            name: 'Platform usage trend',
            description: 'Time spent on the platform',
            info: 'Time spent on the platform',
            dimensions: {
              height: 250,
              width: 12,
            },
            vizType: 'chart',
            noUnit: true,
            charts: [
              {
                id: 'pltUsage',
                name: 'Platform usage trend',
                code: '',
                chartType: 'line_bar',
                filter: '',
                headers: [],
              },
            ],
          },
        ],
      },
    ],
    chartDetails: [
      {
        statusInfo: {
          statusCode: 200,
          statusMessage: 'success',
          errorMessage: '',
        },
        responseData: {
          chartType: 'table_bar',
          visualizationCode: 'topWAT',
          chartFormat: null,
          drillDownChartId: 'none',
          filterKeys: null,
          customData: null,
          dates: null,
          filter: null,
          data: [
            {
              headerName: 'MDO',
              headerValue: 309,
              headerSymbol: 'number',
              colorPaletteCode: '#7B47A4',
              colorPaletteId: null,
              plots: [
                {
                  label: 'Header',
                  name: 'ISTM',
                  value: 78,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'LBSNA',
                  value: 64,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'UIDAI',
                  value: 60,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'DoPT',
                  value: 57,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'NIC',
                  value: 50,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'one',
                },
              ],
              insight: null,
              isDecimal: null,
            },
            {
              headerName: 'Work allocation orders approved',
              headerValue: 309,
              headerSymbol: 'number',
              colorPaletteCode: '#7B47A4',
              colorPaletteId: null,
              plots: [
                {
                  label: 'Header',
                  name: 'ISTM',
                  value: 78,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'LBSNA',
                  value: 64,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'UIDAI',
                  value: 60,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'DoPT',
                  value: 57,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'NIC',
                  value: 50,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'one',
                },
              ],
              insight: null,
              isDecimal: null,
            },
          ],
        },
      },
      {
        statusInfo: {
          statusCode: 200,
          statusMessage: 'success',
          errorMessage: '',
        },
        responseData: {
          chartType: 'table_bar',
          visualizationCode: 'btmpWAT',
          chartFormat: null,
          drillDownChartId: 'none',
          filterKeys: null,
          customData: null,
          dates: null,
          filter: null,
          data: [
            {
              headerName: 'MDO',
              headerValue: 92,
              headerSymbol: 'number',
              colorPaletteCode: '#F3457E',
              colorPaletteId: null,
              plots: [
                {
                  label: 'Header',
                  name: 'DRDO',
                  value: 12,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'AYUSH',
                  value: 15,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'ISRO',
                  value: 18,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'NIRDPR',
                  value: 22,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'SVPNPA',
                  value: 25,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'two',
                },
              ],
              insight: null,
              isDecimal: null,
            },
            {
              headerName: 'Work allocation orders approved',
              headerValue: 92,
              headerSymbol: 'number',
              colorPaletteCode: '#F3457E',
              colorPaletteId: null,
              plots: [
                {
                  label: 'Header',
                  name: 'DRDO',
                  value: 12,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'AYUSH',
                  value: 15,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'ISRO',
                  value: 18,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'NIRDPR',
                  value: 22,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'SVPNPA',
                  value: 25,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: true,
                  colorCode: 'two',
                },
              ],
              insight: null,
              isDecimal: null,
            },
          ],
        },
      },
      {
        statusInfo: {
          statusCode: 200,
          statusMessage: 'success',
          errorMessage: '',
        },
        responseData: {
          chartType: 'table_bar',
          visualizationCode: 'cqTop',
          chartFormat: null,
          drillDownChartId: 'none',
          filterKeys: null,
          customData: null,
          dates: null,
          filter: null,
          data: [
            {
              headerName: 'CBP provider',
              headerValue: 309,
              headerSymbol: 'number',
              colorPaletteCode: '#7B47A4',
              colorPaletteId: null,
              plots: [
                {
                  label: 'Header',
                  name: 'Harappa',
                  value: 98,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'LBSNA',
                  value: 84,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'ISTM',
                  value: 84,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'JAPL',
                  value: 82,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'NIC',
                  value: 80,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'one',
                },
              ],
              insight: null,
              isDecimal: null,
            },
            {
              headerName: 'Average content quality score',
              headerValue: 309,
              headerSymbol: 'number',
              colorPaletteCode: '#7B47A4',
              colorPaletteId: null,
              plots: [
                {
                  label: 'Header',
                  name: 'Harappa',
                  value: 98,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'LBSNA',
                  value: 84,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'ISTM',
                  value: 84,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'JAPL',
                  value: 82,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'one',
                },
                {
                  label: 'Header',
                  name: 'NIC',
                  value: 80,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'one',
                },
              ],
              insight: null,
              isDecimal: null,
            },
          ],
        },
      },
      {
        statusInfo: {
          statusCode: 200,
          statusMessage: 'success',
          errorMessage: '',
        },
        responseData: {
          chartType: 'table_bar',
          visualizationCode: 'cqBtm',
          chartFormat: null,
          drillDownChartId: 'none',
          filterKeys: null,
          customData: null,
          dates: null,
          filter: null,
          data: [
            {
              headerName: 'CBP provider',
              headerValue: 309,
              headerSymbol: 'number',
              colorPaletteCode: '#7B47A4',
              colorPaletteId: null,
              plots: [
                {
                  label: 'Header',
                  name: 'Udemy',
                  value: 62,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'AYUSH',
                  value: 64,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'ISRO',
                  value: 64,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'NIRDPR',
                  value: 65,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'SVPNPA',
                  value: 67,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'two',
                },
              ],
              insight: null,
              isDecimal: null,
            },
            {
              headerName: 'Average content quality score',
              headerValue: 309,
              headerSymbol: 'number',
              colorPaletteCode: '#7B47A4',
              colorPaletteId: null,
              plots: [
                {
                  label: 'Header',
                  name: 'Udemy',
                  value: 62,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'AYUSH',
                  value: 64,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'ISRO',
                  value: 64,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'NIRDPR',
                  value: 65,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'two',
                },
                {
                  label: 'Header',
                  name: 'SVPNPA',
                  value: 67,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                  isPercentage: false,
                  colorCode: 'two',
                },
              ],
              insight: null,
              isDecimal: null,
            },
          ],
        },
      },
      {
        statusInfo: {
          statusCode: 200,
          statusMessage: 'success',
          errorMessage: '',
        },
        responseData: {
          chartType: 'line_bar',
          visualizationCode: 'pltUsage',
          chartFormat: null,
          drillDownChartId: 'none',
          filterKeys: null,
          customData: null,
          dates: null,
          filter: null,
          widgetData: [
            {
              headerName: 'Aggregate',
              headerValue: '4206 hours',
            },
            {
              headerName: 'Daily user average',
              headerValue: '1.2 hours',
            },
          ],
          data: [
            {
              headerName: 'Total hours',
              headerValue: 431720.3772538068,
              headerSymbol: 'number',
              colorPaletteCode: null,
              colorPaletteId: null,
              plots: [
                {
                  label: 'Header',
                  name: '3',
                  value: 60,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '6',
                  value: 17,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '9',
                  value: 8,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '12',
                  value: 5,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '15',
                  value: 63,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '18',
                  value: 43,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '21',
                  value: 3,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '24',
                  value: 67,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '27',
                  value: 40,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '30',
                  value: 20,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
              ],
              insight: null,
              isDecimal: null,
            },
            {
              headerName: 'User Average',
              headerValue: 2414.6296621315787,
              headerSymbol: 'number',
              colorPaletteCode: null,
              colorPaletteId: null,
              plots: [
                {
                  label: 'Header',
                  name: '3',
                  value: 45,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '6',
                  value: 48,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '9',
                  value: 48,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '12',
                  value: 38,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '15',
                  value: 25,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '18',
                  value: 39,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '21',
                  value: 80,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '24',
                  value: 80,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '27',
                  value: 23,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
                {
                  label: 'Header',
                  name: '30',
                  value: 28,
                  valueLabel: 'Value',
                  symbol: 'number',
                  parentName: null,
                  parentLabel: null,
                },
              ],
              insight: null,
              isDecimal: null,
            },
          ],
        },
      },
    ],
    widgetData: [
      {
        statusInfo: {
          statusCode: 200,
          statusMessage: 'success',
          errorMessage: '',
        },
        responseData: {
          chartType: 'metric',
          visualizationCode: 'approvedWAByPercentage',
          chartFormat: null,
          drillDownChartId: 'none',
          filterKeys: null,
          customData: null,
          dates: null,
          filter: null,
          data: [
            {
              headerName: 'Approved work allocations %',
              headerValue: 48,
              headerSymbol: 'number',
              colorPaletteCode: null,
              colorPaletteId: null,
              plots: [],
              insight: 5,
              isDecimal: false,
              isPercentage: true,
              insightStatus: 'up',
              info: 'Approved work allocations %',
            },
          ],
        },
      },
      {
        statusInfo: {
          statusCode: 200,
          statusMessage: 'success',
          errorMessage: '',
        },
        responseData: {
          chartType: 'metric',
          visualizationCode: 'approvedWorkAllocations',
          chartFormat: null,
          drillDownChartId: 'none',
          filterKeys: null,
          customData: null,
          dates: null,
          filter: null,
          data: [
            {
              headerName: 'Approved work allocations',
              headerValue: 2430,
              headerSymbol: 'number',
              colorPaletteCode: null,
              colorPaletteId: null,
              plots: [],
              insight: 101,
              isDecimal: false,
              isPercentage: false,
              insightStatus: 'up',
              info: 'Approved work allocations',
            },
          ],
        },
      },
      {
        statusInfo: {
          statusCode: 200,
          statusMessage: 'success',
          errorMessage: '',
        },
        responseData: {
          chartType: 'metric',
          visualizationCode: 'avgContentQltyScore',
          chartFormat: null,
          drillDownChartId: 'none',
          filterKeys: null,
          customData: null,
          dates: null,
          filter: null,
          data: [
            {
              headerName: 'Average content quality score',
              headerValue: 75,
              headerSymbol: 'number',
              colorPaletteCode: null,
              colorPaletteId: null,
              plots: [],
              insight: 4,
              isDecimal: false,
              isPercentage: false,
              insightStatus: 'down',
              info: 'Average content quality score',
            },
          ],
        },
      },
      {
        statusInfo: {
          statusCode: 200,
          statusMessage: 'success',
          errorMessage: '',
        },
        responseData: {
          chartType: 'metric',
          visualizationCode: 'pltEnage',
          chartFormat: null,
          drillDownChartId: 'none',
          filterKeys: null,
          customData: null,
          dates: null,
          filter: null,
          data: [
            {
              headerName: 'Platform engagement',
              headerValue: '4206 hours',
              headerSymbol: 'number',
              colorPaletteCode: null,
              colorPaletteId: null,
              plots: [],
              insight: null,
              isDecimal: false,
              isPercentage: false,
              insightStatus: 'up',
              info: 'Platform engagement',
            },
          ],
        },
      },
      {
        statusInfo: {
          statusCode: 200,
          statusMessage: 'success',
          errorMessage: '',
        },
        responseData: {
          chartType: 'metric',
          visualizationCode: 'newUsers',
          chartFormat: null,
          drillDownChartId: 'none',
          filterKeys: null,
          customData: null,
          dates: null,
          filter: null,
          data: [
            {
              headerName: 'New users onboarded',
              headerValue: 232,
              headerSymbol: 'number',
              colorPaletteCode: null,
              colorPaletteId: null,
              plots: [],
              insight: 12,
              isDecimal: false,
              isPercentage: false,
              insightStatus: 'down',
              info: 'New users onboarded',
            },
          ],
        },
      },
    ],
  }

  constructor(@Inject(DOCUMENT) private document: Document, private homeResolver: ProfileV2Service, private router: Router) {
  }
  filterR(type: string) {
    this.resolutionFilter = type
  }
  filterComp(type: string) {
    this.compFilter = type
  }
  ngOnDestroy() {

  }
  ngOnInit() {
    this.getUserDetails()
    // this.fetchRoles()
    this.selectDashbord()
  }

  selectDashbord() {
    if (this.selectedDashboardId === '') {
      this.selectedDashboardId = this.dashboardList[0].responseData[0].id
      this.currentDashboard.push(this.dashboardOne)
    }
  }

  getUserDetails() {
    this.homeResolver.getUserDetails().subscribe((res: any) => {
      if (res.roles && res.roles.length > 0) {
        Object.keys(res.roles).forEach((key: any) => {
          const objVal = res.roles[key]
          if (objVal === 'CONTENT_CREATOR' || objVal === 'EDITOR' || objVal === 'PUBLISHER' || objVal === 'REVIEWER') {
            this.showCBPLink = true
          }
          if (objVal === 'Member') {
            this.showKarmayogiLink = true
          }
        })
      }
    })
  }
  // fetchRoles() {
  // const rolesAndAccessData: any[] = []
  // this.homeResolver.getMyDepartment().subscribe((roles: any) => {
  //   this.deptName = roles.deptName
  //   if (this.deptName) {
  // this.sliderData1 = {
  //   widgetType: 'slider',
  //   widgetSubType: 'sliderOrgBanners',
  //   style: {
  //     'border-radius': '8px',
  //   },
  //   widgetData: [
  //     {
  //       banners: {
  //         l: 'assets/images/banners/home/home_banner_l.jpg',
  //         m: 'assets/images/banners/home/home_banner_m.jpg',
  //         s: 'assets/images/banners/home/home_banner_m.jpg',
  //         xl: 'assets/images/banners/home/home_banner_xl.jpg',
  //         xs: 'assets/images/banners/home/home_banner_xl.jpg',
  //         xxl: 'assets/images/banners/home/home_banner_xl.jpg',
  //       },
  //       title: this.deptName,
  //       logo: 'assets/icons/govtlogo.jpg',
  //     },
  //   ],
  // }
  //   }
  //   roles.rolesInfo.forEach((role: { roleName: string }) => {
  //     rolesAndAccessData.push({
  //       role: role.roleName,
  //       count: roles.noOfUsers,
  //     })
  //   })
  // })
  // }

  openky() {
    this.openNewWindow()
  }
  openNewWindow(): void {
    const link = this.document.createElement('a')
    link.target = '_blank'
    link.href = environment.karmYogiPath
    link.click()
    link.remove()
  }
  openCBP() {
    this.openNewWindowCBP()
  }
  openNewWindowCBP(): void {
    const link = this.document.createElement('a')
    link.target = '_blank'
    link.href = environment.cbpPath
    link.click()
    link.remove()
  }
  ngAfterViewInit() {
  }

  viewmdoinfo(tab: any) {
    if (tab === 'leadership') {
      this.router.navigate(['/app/home/mdoinfo/leadership'])
    } else if (tab === 'staff') {
      this.router.navigate(['/app/home/mdoinfo/staff'])
    } else if (tab === 'budget') {
      this.router.navigate(['/app/home/mdoinfo/budget'])
    }
  }
}
