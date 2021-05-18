import { Directive, TemplateRef } from '@angular/core'

@Directive({
  selector: '[wsAppAutocompleteContent]',
})
export class AutocompleteContentDirective {
  constructor(public tpl: TemplateRef<any>) {
  }
}
