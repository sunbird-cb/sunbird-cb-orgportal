import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { FileService } from '../../services/upload.service'
import { Observable } from 'rxjs'
import { MatSnackBar, MatSort } from '@angular/material'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { environment } from 'src/environments/environment'
import { ActivatedRoute } from '@angular/router'
// tslint:disable-next-line
import _ from 'lodash'

@Component({
  selector: 'ws-app-users-upload',
  templateUrl: './users-upload.component.html',
  styleUrls: ['./users-upload.component.scss'],
})
export class UsersUploadComponent implements OnInit, AfterViewInit, OnDestroy {
  private fileName: any
  public displayLoader!: Observable<boolean>
  public formGroup = this.fb.group({
    file: ['', Validators.required],
  })
  fetching = false
  showFileError = false
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>
  @ViewChild(MatSort, { static: true }) sort!: MatSort
  bulkUploadData: any
  uplaodSuccessMsg!: string
  dataSource: MatTableDataSource<any>
  displayedColumns: string[] = ['identifier', 'fileName', 'status', 'dateCreatedOn', 'dateUpdatedOn']
  tabledata: any = {
    actions: [],
    columns: [
      { displayName: 'Id', key: 'identifier' },
      { displayName: 'Name', key: 'fileName' },
      { displayName: 'Status', key: 'status' },
      { displayName: 'Created on', key: 'dateCreatedOn' },
      { displayName: 'Updated on', key: 'dateUpdatedOn' },
    ],
    needCheckBox: false,
    needHash: false,
    sortColumn: 'dateCreatedOn',
    sortState: 'desc',
    needUserMenus: false,
  }
  departments: string[] = []
  contactUsUrl = ''
  fileSelected!: any
  pageDataSubscription!: any
  downloadSampleFilePath = ''
  downloadAsFileName = ''
  rootOrgId!: any

  objDataSource = new MatTableDataSource<any>()
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | null = null

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator
    this.setDataSourceAttributes()
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator
  }

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {
    this.rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    this.dataSource = new MatTableDataSource(this.bulkUploadData)
    this.dataSource.paginator = this.paginator

    this.pageDataSubscription = this.route.data.subscribe(data => {
      if (data && data.pageData) {
        this.downloadSampleFilePath = data.pageData.data.downloadSampleFilePath
        this.downloadAsFileName = data.pageData.data.downloadAsFileName
      }
    })
  }

  ngOnInit() {
    this.displayLoader = this.fileService.isLoading()
    this.contactUsUrl = `${environment.karmYogiPath}/public/contact `
    this.getBulkUploadData()
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    // this.dataSource = new MatTableDataSource(this.bulkUploadData)
    setTimeout(() => {
      this.dataSource.sort = this.sort
    })
  }

  getBulkUploadData() {
    this.fetching = true
    this.fileService.getBulkUploadDataV1(this.rootOrgId).then((res: any) => {
      this.fetching = false
      if (res.result && res.result.content) {
        this.bulkUploadData = res.result.content
        // this.bulkUploadData = []
        this.dataSource = new MatTableDataSource(this.bulkUploadData)
        setTimeout(() => this.dataSource.paginator = this.paginator)
        setTimeout(
          () => {
            if (this.sort) {
              this.sort.active = this.tabledata.sortColumn,
                this.sort.start = this.tabledata.sortState
            }
            this.dataSource.sort = this.sort
          },
          100)
      }
    })
      .catch(() => { })
      .finally(() => {
        this.fetching = false
      })
  }

  public onFileChange(event: any) {
    this.showFileError = false
    // const reader = new FileReader()
    // if (event.target.files && event.target.files.length) {
    //   this.fileName = event.target.files[0].name
    //   const [file] = event.target.files
    //   reader.readAsDataURL(file)

    //   reader.onload = () => {
    //     this.formGroup.patchValue({
    //       file: reader.result,
    //     })
    //   }
    // }

    // const file: File = event.target.files[0]
    // this.fileName = file.name

    // this.fileSelected = file
    // this.formGroup.patchValue({
    //   file,
    // })

    const fileList = (<HTMLInputElement>event.target).files
    if (fileList && fileList.length > 0) {
      const file: File = fileList[0]
      this.fileName = file.name
      this.fileSelected = file
      this.formGroup.patchValue({
        file,
      })
    }
  }

  public onSubmit(form: any): void {
    // Validate File type before uploading
    if (this.fileService.validateFile(this.fileName)) {
      if (this.formGroup && this.formGroup.get('file')) {
        const formData: FormData = new FormData()
        formData.append('data', this.fileSelected, this.fileName)
        // tslint:disable-next-line: no-non-null-assertion
        this.fileService.upload(this.fileName, formData)
          .subscribe(
            _res => {
              // this.uplaodSuccessMsg = res
              this.openSnackbar('File uploaded successfully..!')
              // // tslint:disable-next-line: no-non-null-assertion
              // this.formGroup!.get('file')!.setValue(['', Validators.required])
              if (form && form.file) {
                form.file.value = ''
              }
              this.formGroup.reset()
              this.getBulkUploadData()
            },
            err => {
              // tslint:disable-next-line: no-console
              console.log('error', err)
              this.openSnackbar(this.toastError.nativeElement.value)
            })
      }
    } else {
      this.showFileError = true
      this.openSnackbar(this.toastError.nativeElement.value)
    }
  }

  public refreshTable() {
    this.getBulkUploadData()
  }
  public downloadFile(): void {
    this.fileService.download(this.downloadSampleFilePath, this.downloadAsFileName)
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  public downloadReport(row: any) {
    this.fileService.downloadReport(row.identifier, row.name)
  }

  ngOnDestroy() {
    if (this.pageDataSubscription) {
      this.pageDataSubscription.unsubscribe()
    }
  }

}
