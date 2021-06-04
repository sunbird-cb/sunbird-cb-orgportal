import { Directive, ElementRef, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core'
import { fromEvent } from 'rxjs'
import { ConnectionPositionPair, Overlay, OverlayRef } from '@angular/cdk/overlay'
import { AutocompleteComponent } from './autocomplete/autocomplete.component'
import { TemplatePortal } from '@angular/cdk/portal'
import { debounceTime, filter, takeUntil } from 'rxjs/operators'
import { NgControl } from '@angular/forms'
import { untilDestroyed } from 'ngx-take-until-destroy'

@Directive({
  selector: '[wsAppAutocomplete]',
})
export class AutocompleteDirective implements OnInit, OnDestroy {
  @Input() wsAppAutocomplete!: AutocompleteComponent
  private overlayRef!: OverlayRef | null

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private ngControl: NgControl,
    private vcr: ViewContainerRef,
    private overlay: Overlay
  ) {
  }

  get control() {
    return this.ngControl.control
  }

  ngOnInit() {
    fromEvent(this.origin, 'focus').pipe(
      debounceTime(1000),
      untilDestroyed(this)
      // tslint:disable-next-line: deprecation
    ).subscribe(() => {
      // if (this.control && this.control.value && this.control.value.length >= 3) {
      this.openDropdown()
      if (this.overlayRef) {
        this.wsAppAutocomplete.optionsClick()
          .pipe(takeUntil(this.overlayRef.detachments()))
          // tslint:disable-next-line: deprecation
          .subscribe((value: any) => {
            if (this.control) {
              this.control.setValue(value)
            }
            this.close()
          })
      }
      // }
    })
  }

  openDropdown() {
    if (this.overlayRef) {
      this.close()
    }
    this.overlayRef = this.overlay.create({
      width: this.origin.offsetWidth,
      maxHeight: 40 * 3,
      backdropClass: '',
      scrollStrategy: this.overlay.scrollStrategies.reposition({ scrollThrottle: 10 }),
      positionStrategy: this.getOverlayPosition(),
    })

    const template = new TemplatePortal(this.wsAppAutocomplete.rootTemplate, this.vcr)
    this.overlayRef.attach(template)

    // tslint:disable-next-line: deprecation
    overlayClickOutside(this.overlayRef, this.origin).subscribe(() => this.close())
  }

  private close() {
    if (this.overlayRef) {
      this.overlayRef.detach()
      // this.overlayRef = {} as OverlayRef
      this.overlayRef = null
    }
  }

  ngOnDestroy() { }

  private getOverlayPosition() {
    const positions = [
      new ConnectionPositionPair(
        { originX: 'start', originY: 'bottom' },
        { overlayX: 'start', overlayY: 'top' }
      ),
      new ConnectionPositionPair(
        { originX: 'start', originY: 'top' },
        { overlayX: 'start', overlayY: 'bottom' }
      ),
    ]

    return this.overlay
      .position()
      .flexibleConnectedTo(this.origin)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(false)
  }

  get origin() {
    return this.host.nativeElement
  }
}

export function overlayClickOutside(overlayRef: OverlayRef, origin: HTMLElement) {
  return fromEvent<MouseEvent>(document, 'click')
    .pipe(
      filter(event => {
        const clickTarget = event.target as HTMLElement
        const notOrigin = clickTarget !== origin // the input
        const notOverlay = !!overlayRef && !overlayRef.overlayElement.contains(clickTarget) // the autocomplete
        return notOrigin && notOverlay
      }),
      takeUntil(overlayRef.detachments())
    )
}
