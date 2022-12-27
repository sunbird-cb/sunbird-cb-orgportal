import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from '../../../../../../src/environments/environment'
const SEARCH = '/apis/proxies/v8/sunbirdigot/read'
@Injectable({
  providedIn: 'root'
})
export class ThumbnailService {

  constructor(private http: HttpClient) { }

  fetchContent(searchData: any): Observable<any> {
    return this.http
      .post<any>(SEARCH, searchData)
      .pipe(map((data: any) => data))
  }

  getChangedArtifactUrl(url: string) {
    if (url && url.length > 0) {
      const tempData = url.split('content')
      if (url.indexOf(`/collection`) > 0) {
        return `${environment.cbpPortal}${environment.contentBucket}${tempData[tempData.length - 1]}`
      }
      if (url.indexOf('/content') > 0) {
        return `${environment.cbpPortal}${environment.certImage}${tempData[tempData.length - 1]}`
      }
      return `${environment.cbpPortal}${environment.contentBucket}/content${tempData[tempData.length - 1]}`
    }
    return url
  }
}
