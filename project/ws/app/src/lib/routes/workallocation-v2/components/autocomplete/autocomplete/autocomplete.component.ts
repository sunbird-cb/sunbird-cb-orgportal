import { Component, ContentChild, ContentChildren, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core'
import { AutocompleteContentDirective } from '../autocomplete-content.directive'
import { OptionComponent } from '../option/option.component'
import { switchMap } from 'rxjs/operators'
import { merge } from 'rxjs'

@Component({
  selector: 'ws-app-autocomplete',
  // templateUrl: './autocomplete.component.html',
  template: `
    <ng-template #root>
      <div class="autocomplete">
        <ng-container *ngTemplateOutlet="content.tpl"></ng-container>
      </div>
    </ng-template>
  `,
  styleUrls: ['./autocomplete.component.scss'],
  exportAs: 'wsAppAutocomplete',
})
export class AutocompleteComponent implements OnInit {
  @ViewChild('root', { static: false }) rootTemplate!: TemplateRef<any>
  @ContentChild(AutocompleteContentDirective, { static: false })
  content: AutocompleteContentDirective | undefined
  @ContentChildren(OptionComponent) options!: QueryList<OptionComponent>

  constructor() { }

  ngOnInit() {
  }

  optionsClick() {
    return this.options.changes.pipe(
      switchMap(options => {
        const clicks = options.map((option: any) => option.click)
        return merge(...clicks)
      })
    )
  }

}
