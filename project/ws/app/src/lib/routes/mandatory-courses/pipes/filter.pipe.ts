import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'mandatoryFilter',
  pure: false
})
export class MandatoryFilterPipe implements PipeTransform {

  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items
    }
    return items.filter(item => item.name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1)
  }
}
