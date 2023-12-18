import { BehaviorSubject } from 'rxjs'
import { Injectable } from '@angular/core'

@Injectable()
export class LoaderService {
  changeLoad = new BehaviorSubject<boolean>(false)
  $currentState = this.changeLoad.asObservable()

  changeLoaderState(state: boolean) {
    this.changeLoad.next(state)
  }

}
