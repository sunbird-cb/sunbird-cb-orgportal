import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core"


@Component({
  selector: 'ws-app-create-workallocation',
  templateUrl: './create-workallocation.component.html',
  styleUrls: ['./create-workallocation.component.scss'],
})
export class CreateWorkallocationComponent implements OnInit, AfterViewInit {
  canPublish = false
  /**
   * this is for selecting tabs dynamically
   */
  selectedTab = 'officer'
  public officerOffset!: number | null
  public activitiesOffset!: number | null
  public rolesOffset!: number | null
  public competenciesOffset!: number | null
  public levelsOffset!: number | null

  @ViewChild('mainWindow', { static: true }) mainWindowElement!: ElementRef
  @ViewChild('officer', { static: true }) officerElement!: ElementRef
  @ViewChild('activities', { static: true }) activitiesElement!: ElementRef
  @ViewChild('roles', { static: true }) rolesElement!: ElementRef
  @ViewChild('competencies', { static: true }) competenciesElement!: ElementRef
  @ViewChild('levels', { static: true }) levelsElement!: ElementRef
  /**
   * this is for selecting tabs dynamically
   */
  // tslinr=t
  constructor() {
  }
  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event'])
  /**
    * this is for selecting tabs dynamically
    */
  onScroll(_$event: any) {
    // const offset = $event.srcElement.scrollTop || this.document.body.scrollTop || 0
    const offset = window.pageYOffset || 0
    if (this.officerOffset != null && this.activitiesOffset && this.rolesOffset && this.competenciesOffset && this.levelsOffset) {
      if (offset >= this.officerOffset && offset < this.activitiesOffset) {
        this.selectedTab = 'officer'
      } else if (offset >= this.activitiesOffset && offset < this.rolesOffset) {
        this.selectedTab = 'activities'
      } else if (offset >= this.rolesOffset && offset < this.competenciesOffset) {
        this.selectedTab = 'roles'
      } else if (offset >= this.competenciesOffset && offset < this.levelsOffset) {
        this.selectedTab = 'competencies'
      } else if (offset >= this.levelsOffset) {
        this.selectedTab = 'levels'
      } else {
        this.selectedTab = 'officer'
      }
    }
  }
  /**
  * this is for selecting tabs dynamically
  */
  ngAfterViewInit() {
    /**
  * this is for selecting tabs dynamically
  */
    const defaultOffsetToMinus = 146
    this.officerOffset = this.officerElement.nativeElement.offsetTop - defaultOffsetToMinus
    this.activitiesOffset = this.activitiesElement.nativeElement.offsetTop - defaultOffsetToMinus
    this.rolesOffset = this.rolesElement.nativeElement.offsetTop - defaultOffsetToMinus
    this.competenciesOffset = this.competenciesElement.nativeElement.offsetTop - defaultOffsetToMinus
    this.levelsOffset = this.levelsElement.nativeElement.offsetTop - defaultOffsetToMinus
    /**
  * this is for selecting tabs dynamically
  */
  }
  filterComp($element: any, filterType: string) {
    this.selectedTab = filterType
    $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
  }
  get currentProgress(): number {
    return 70
  }
  get getsubPath(): string {
    return `./#${this.selectedTab}`
  }

}
