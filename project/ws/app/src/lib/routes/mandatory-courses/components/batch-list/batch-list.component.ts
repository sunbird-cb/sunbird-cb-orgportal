import { Component, OnInit, Input } from '@angular/core'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { NsContent } from '@sunbird-cb/collection'
import { MandatoryCourseService } from '../../services/mandatory-course.service'
import { AddBatchDialougeComponent } from '../../components/add-batch-dialouge/add-batch-dialouge.component'
const ELEMENT_DATA: NsContent.IBatch[] = []

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
  addMemberLinks: any
  constructor(private route: ActivatedRoute, private mandatoryCourseServce: MandatoryCourseService, private dialog: MatDialog, private snackbar: MatSnackBar) { }

  ngOnChanges() {
    this.folderId = this.route.snapshot.params['doId']
    console.log(this.batches)
    // this.dataSource = this.batches
    this.addMemberLinks = `/app/mandatory-courses/${this.route.snapshot.params.doId}/batch-details/`
    this.updateAddMembers()
  }

  ngOnInit() {

  }

  openCreateBatchDialog(batchInfo: any) {
    const dialogRef = this.dialog.open(AddBatchDialougeComponent, {
      width: 'auto',
      // panelClass: 'custom-dialog-container',
      data: {
        batchInfo: batchInfo
      }
    })
    dialogRef.afterClosed().subscribe(() => {
      // this.getFolderInfo()
    })
  }

  deleteBatch(batch: any) {
    this.mandatoryCourseServce.deleteBatch(batch.batchId).subscribe(() => {
      this.snackbar.open('deleted the batch', 'Close')
    })
  }

  updateAddMembers() {
    this.batches.forEach((batch: any) => {
      this.mandatoryCourseServce.getBatchDetails(batch.batchId).subscribe((data: any) => {
        batch.members = data.length < 10 ? `0${data.length}` : data.length || '00'
        batch.pending = '00'
        batch.completed = '00'
      })
      this.dataSource = this.batches
    })

  }
}

