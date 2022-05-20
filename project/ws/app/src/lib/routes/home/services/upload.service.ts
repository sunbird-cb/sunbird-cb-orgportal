import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

const API_END_POINTS = {
  GETPRFOILEDATA: 'apis/proxies/v8/api/user/v2/read',
  CREATE_ASSET: 'apis/proxies/v8/action/content/v3/create',
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  // upload(file: any): any {
  //   throw new Error("Method not implemented.");
  // }
  // getFiles(): any {
  //   throw new Error("Method not implemented.");
  // }
  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GETPRFOILEDATA}`)
  }

  crreateAsset(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CREATE_ASSET}`, req)
  }

  // upload(file: File): Observable<HttpEvent<any>> {
  //   const formData: FormData = new FormData()

  //   formData.append('file', file)

  //   const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
  //     reportProgress: true,
  //     responseType: 'json',
  //   })

  //   return this.http.request(req)
  // }

  // getFiles(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/files`)
  // }
}
