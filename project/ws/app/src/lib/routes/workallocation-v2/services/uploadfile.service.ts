import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  GETPRFOILEDATA: 'apis/proxies/v8/api/user/v2/read',
  CREATE_ASSET: 'apis/proxies/v8/action/content/v3/create',
  UPLOAD_FILE: 'apis/proxies/v8/upload/action/content/v3/upload',
  UPDATE_WORKORDER: 'apis/protected/v8/workallocation/update/workorder',
  DOWNLOAD_PDF: 'apis/protected/v8/workallocation/getWOPdf',
}

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {

  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GETPRFOILEDATA}`)
  }

  crreateAsset(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CREATE_ASSET}`, req)
  }

  uploadFile(val: any, formdata: any): Observable<any> {
    this.http.post<any>(`${API_END_POINTS.UPLOAD_FILE}/${val}`, formdata, {
      headers: {
        'content-type': 'application/json',
      },
    })
    return this.http.post<any>(`${API_END_POINTS.UPLOAD_FILE}/${val}`, formdata)
  }

  updateWorkOrder(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_WORKORDER}`, req)
  }

  getDraftPDF(val: any): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.DOWNLOAD_PDF}/${val}`, { responseType: 'blob' as 'json' })
  }

}
