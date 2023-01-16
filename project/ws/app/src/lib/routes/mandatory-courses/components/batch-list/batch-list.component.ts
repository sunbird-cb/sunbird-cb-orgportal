import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NsContent } from '@sunbird-cb/collection'
// export interface courseFolder {
//   folderId: number,
//   folderName: string
//   courseCount: number
//   batchCount: number

// }

const ELEMENT_DATA: NsContent.IBatch[] = [

  {
    batchId: '1210',
    createdBy: '',
    endDate: '',
    enrollmentType: '01',
    identifier: 'string',
    name: 'Course 01 batch 01',
    startDate: '11 june',
    status: 1212,
    cert_templates: null,
    collectionId: '0001',
    courseId: 'string',
    createdDate: 'string',
    createdFor: [],
    description: null,
    enrollmentEndDate: 'string',
    id: '001',
    mentors: ['string'],
    tandc: null,
    updatedDate: 'string',
  },
  {
    batchId: '1212',
    createdBy: '',
    endDate: '',
    enrollmentType: '002',
    identifier: 'string',
    name: 'Course 02 batch 02',
    startDate: '11 june',
    status: 1212,
    cert_templates: null,
    collectionId: '0002',
    courseId: 'string',
    createdDate: 'string',
    createdFor: [],
    description: null,
    enrollmentEndDate: 'string',
    id: '002',
    mentors: ['string'],
    tandc: null,
    updatedDate: 'string',
  },
  {
    batchId: '1213',
    createdBy: '',
    endDate: '',
    enrollmentType: '01',
    identifier: 'string',
    name: 'Course 03 batch 03',
    startDate: '13 june',
    status: 1212,
    cert_templates: null,
    collectionId: '0003',
    courseId: 'string',
    createdDate: 'string',
    createdFor: [],
    description: null,
    enrollmentEndDate: 'string',
    id: '003',
    mentors: ['string'],
    tandc: null,
    updatedDate: 'string',
  },
]

@Component({
  selector: 'ws-app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss'],
})
export class BatchListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'enrollmentType', 'collectionId', 'id', 'startDate', 'enrollmentEndDate', 'addMember', 'null']
  dataSource = ELEMENT_DATA
  folderId: any
  @Input() batches: any

  constructor(private route: ActivatedRoute) { }

  ngOnChanges() {
    this.folderId = this.route.snapshot.params['doId']
    console.log(this.batches)
    this.dataSource = this.batches
  }

  ngOnInit() {

  }

}
