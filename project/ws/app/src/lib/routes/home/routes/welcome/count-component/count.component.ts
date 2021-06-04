
import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
/* tslint:disable */
import _ from 'lodash'
import { IPrintCount } from './count.model'
/* tslint:enable */

@Component({
  selector: 'ws-app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss'],
  /* tslint:disable */
  // host: { class: 'flex margin-xs' },
  /* tslint:enable */
})

export class CountComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<IPrintCount> {
  @Input() widgetData!: IPrintCount
  @HostBinding('class') className = '\'flex margin-xs'
  ngOnInit(): void {
  }
}
