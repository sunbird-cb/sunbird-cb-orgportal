import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject, Observable } from 'rxjs'
import { finalize } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import * as fileSaver from 'file-saver'

const API_ENDPOINTS = {
  // bulkUpload: `/apis/proxies/v8/user/v1/bulkupload`,
  bulkUpload: `/apis/proxies/v8/user/v2/bulkupload`, // csv support
  downloadReport: `/apis/protected/v8/admin/userRegistration/bulkUploadReport`,
  getBulkUploadData: '/apis/proxies/v8/user/v1/bulkupload',
  getBulkApproval: '/apis/proxies/v8/workflow/admin/bulkupdate/getstatus',
  // bulkApprovalUpload: `/apis/proxies/v8/workflow/admin/transition/bulkupdate`,
  bulkApprovalUpload: '/apis/proxies/v8/workflow/admin/v2/bulkupdate/transition', // csv support
}

@Injectable()
export class FileService {
  // tslint:disable-next-line: prefer-array-literal
  private fileList: string[] = new Array<string>()
  private fileList$: Subject<string[]> = new Subject<string[]>()
  private displayLoader$: Subject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient) { }

  public isLoading(): Observable<boolean> {
    return this.displayLoader$
  }

  public upload(_fileName: string, fileContent: FormData): Observable<any> {
    this.displayLoader$.next(true)
    return this.http.post<any>(API_ENDPOINTS.bulkUpload, fileContent)
      .pipe(finalize(() => this.displayLoader$.next(false)))
  }

  public download(filePath: string, downloadAsFileName: string): void {
    this.http.get(filePath, { responseType: 'blob' }).subscribe((res: any) => {
      fileSaver.saveAs(res, downloadAsFileName)
    })
  }

  public downloadReport(id: any, name: string) {
    return this.http.get(`${API_ENDPOINTS.downloadReport}/${id}`).subscribe(
      (response: any) => {
        const blobObj = new Blob([new Uint8Array(response.report.data)])
        fileSaver.saveAs(blobObj, `${name.split('.')[0]}-report.csv`)
        return response
      },
    )
  }

  public remove(fileName: any): void {
    this.http.delete('/files/${fileName}').subscribe(() => {
      this.fileList.splice(this.fileList.findIndex(name => name === fileName), 1)
      this.fileList$.next(this.fileList)
    })
  }

  public list(): Observable<string[]> {
    return this.fileList$
  }

  validateFile(name: String) {
    const allowedFormats = ['xlsx', 'csv']
    const ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
    if (allowedFormats.indexOf(ext) > -1) {
      return true
      // tslint:disable-next-line: no-else-after-return
    } else {
      return false
    }
  }

  async getBulkUploadData() {
    return await this.http.get(`${API_ENDPOINTS.getBulkUploadData}`).toPromise()
  }

  public getBulkUploadDataV1(rootOrgId: any): Observable<any> {
    return this.http.get(`${API_ENDPOINTS.getBulkUploadData}/${rootOrgId}`)
  }

  public getBulkApprovalUploadDataV1(): Observable<any> {
    return this.http.get(`${API_ENDPOINTS.getBulkApproval}`)
  }

  public uploadApproval(_fileName: string, fileContent: FormData): Observable<any> {
    this.displayLoader$.next(true)
    return this.http.post<any>(API_ENDPOINTS.bulkApprovalUpload, fileContent)
      .pipe(finalize(() => this.displayLoader$.next(false)))
  }
}
