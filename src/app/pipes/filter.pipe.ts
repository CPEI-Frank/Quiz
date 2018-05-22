import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], term) {
    return term ? items.filter(item => item.title.indexOf(term) !== -1) : items;
  }
}
