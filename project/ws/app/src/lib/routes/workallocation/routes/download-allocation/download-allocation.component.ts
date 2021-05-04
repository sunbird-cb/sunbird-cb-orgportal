import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-app-download-allocation',
  templateUrl: './download-allocation.component.html',
  styleUrls: ['./download-allocation.component.scss'],
})
export class DownloadAllocationComponent implements OnInit {
  @Input() data: any[] | undefined
  @Input() deptname: any
  @Input() currentFilter: any
  term!: string | null

  today: number = Date.now()

  constructor() { }

  ngOnInit() {
    // console.log(this.data)
    // console.log(this.deptname)
  }

}
