import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject, Observable } from 'rxjs'
import { finalize } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import * as fileSaver from 'file-saver'

const API_ENDPOINTS = {
  // bulkUpload: `/apis/protected/v8/admin/userRegistration/bulkUpload`,
  bulkUpload: `/apis/proxies/v8/user/v1/bulkupload`,
  downloadReport: `/apis/protected/v8/admin/userRegistration/bulkUploadReport`,
  // getBulkUploadData: '/apis/protected/v8/admin/userRegistration/bulkUploadData',
  getBulkUploadData: '/apis/proxies/v8/user/v1/bulkupload',
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
    // const httpOptions = {
    //   headers: new HttpHeaders({ responseType:  'blob',
    //   'Content-Type':  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),
    // }
    this.http.get(filePath, { responseType: 'blob' }).subscribe((res: any) => {
      // window.open(window.URL.createObjectURL(res))
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

  // private addFileToList(fileName: string): void {
  //   this.fileList.push(fileName)
  //   this.fileList$.next(this.fileList)
  // }

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

  async getBulkUploadDataV1(rootOrgId: any) {
    return await this.http.get(`${API_ENDPOINTS.getBulkUploadData}/${rootOrgId}`).toPromise()
  }
}
