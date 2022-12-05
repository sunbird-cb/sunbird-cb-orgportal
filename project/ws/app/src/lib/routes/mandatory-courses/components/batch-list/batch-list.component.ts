import { Component, OnInit } from '@angular/core'
import { NsContent } from '../../models/mandatory-course.models.'
// export interface courseFolder {
//   folderId: number,
//   folderName: string
//   courseCount: number
//   batchCount: number

// }

const ELEMENT_DATA: NsContent.IBatch[] = [

  {
    batchId: '123',
    createdBy: '',
    endDate: '',
    enrollmentType: '00',
    identifier: 'string',
    name: 'Course 1 batch',
    startDate: '10 june',
    status: 1212,
    cert_templates: null,
    collectionId: '0001',
    courseId: 'string',
    createdDate: 'string',
    createdFor: [],
    description: null,
    enrollmentEndDate: 'string',
    id: '005',
    mentors: ['string'],
    tandc: null,
    updatedDate: 'string'
  }
]

@Component({
  selector: 'ws-app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss']
})
export class BatchListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'enrollmentType', 'collectionId', 'id', 'startDate', 'enrollmentEndDate', 'null']
  dataSource = ELEMENT_DATA
  constructor() { }

  ngOnInit() {
  }

}
