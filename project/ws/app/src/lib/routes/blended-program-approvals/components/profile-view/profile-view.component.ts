
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { NSProfileDataV2 } from '../../../../routes/approvals/models/profile-v2.model'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
/* tslint:disable */
import _ from 'lodash'
import { BlendedApporvalService } from '../../services/blended-approval.service'
import { WidgetUserService } from '@sunbird-cb/collection'
import moment from 'moment'
import { ProfileCertificateDialogComponent } from '../profile-certificate-dialog/profile-certificate-dialog.component'

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class ProfileViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  sticky = false
  /* tslint:disable */
  selectedTab: number = 2; // Default selected tab
  doj: any
  description: any
  academics: any = []
  hobbies: any = []
  Math: any
  /* tslint:enable */
  elementPosition: any
  currentFilter = 'timestamp'
  discussionList!: any
  discussProfileData!: any
  portalProfile!: NSProfileDataV2.IProfile
  userDetails: any
  location!: string | null
  tabs: any
  designation: any = []
  tabsData: NSProfileDataV2.IProfileTab[]
  currentUser!: string | null
  // connectionRequests!: NSNetworkDataV2.INetworkUser[]
  currentUsername: any
  certificationData: any = []
  viewProfile: any[] = []
  enrolledCourse: any = []
  allCertificate: any = []

  sideNavBarOpened = true
  verifiedBadge = false
  private defaultSideNavBarOpenedSubscription: any
  public screenSizeIsLtMedium = false
  programData: any
  breadcrumbs: any

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private bpService: BlendedApporvalService,
    public router: Router,
    private userSvc: WidgetUserService,
  ) {
    this.Math = Math
    // this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    const currentState = this.router.getCurrentNavigation()
    if (currentState && currentState.extras.state) {
      this.programData = currentState.extras.state
      if (this.programData) {
        this.breadcrumbs = {
          titles: [{ title: 'Blended programs', url: '/app/home/blended-approvals' },
          { title: this.programData.programName, url: `/app/blended-approvals/${this.programData.programID}/batches` },
          // tslint:disable-next-line:max-line-length
          { title: this.programData.batchName, url: `/app/blended-approvals/${this.programData.programID}/batches/${this.programData.batchID}` }],
        }
      }
    }
    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    const userId = this.route.snapshot.params.userId

    this.bpService.getUserById(userId).subscribe((res: any) => {
      this.viewProfile = res
      // this.designation = res?.profileDetails?.professionalDetails[0]?.designation;
      this.userSvc.fetchUserBatchList(userId).subscribe((result: any) => {
        result.forEach((items: any) => {
          if (items.completionPercentage === 100) {
            this.certificationData.push(items)
            // return items;
          }
        })
        this.downloadAllCertificate(this.certificationData)
        // this.certificationData = result
      })
      this.portalProfile = res
      if (res.profileDetails) {
        this.designation = res.profileDetails.professionalDetails ? res.profileDetails.professionalDetails : []
        this.academics = res.profileDetails.academics ? res.profileDetails.academics : []
        this.hobbies = res.profileDetails.interests ? res.profileDetails.interests : []
      }

      this.tabs = this.route.data.subscribe(data => {
        if (res.profileDetails.verifiedKarmayogi === true) {
          this.verifiedBadge = true
        }

        if (res.profileDetails) {
          this.portalProfile = res.profileDetails
        } else {
          this.portalProfile = res
          _.set(this.portalProfile, 'personalDetails.firstname', _.get(res, 'firstName'))
          _.set(this.portalProfile, 'personalDetails.email', _.get(res, 'email'))
          _.set(this.portalProfile, 'personalDetails.userId', _.get(res, 'userId'))
          _.set(this.portalProfile, 'personalDetails.userName', _.get(res, 'userName'))
        }

        const user = this.portalProfile.userId || this.portalProfile.id || _.get(data, 'res.id') || ''
        if (this.portalProfile && !(this.portalProfile.id && this.portalProfile.userId)) {
          this.portalProfile.id = user
          this.portalProfile.userId = user
        }

      })

    })
  }

  downloadAllCertificate(data: any) {
    data.forEach((item: any) => {
      if (item.issuedCertificates.length !== 0) {
        item.issuedCertificates.forEach((cid: any) => {
          // const certId = item.issuedCertificates[0].identifier
          const certId = cid.identifier
          this.bpService.downloadCert(certId).subscribe((response: any) => {
            this.allCertificate.push({
              identifier: certId,
              dataUrl: response.result.printUri,
              content: item.content,
              issuedCertificates: cid,
            })

          })
        })
      }
    })
  }

  paDate(date: any): string {
    const dat = moment(date, 'DD-MM-YYYY').toDate()
    return dat.toDateString()
  }

  certpaDate(date: any): string {
    let dat
    if (date) {

      dat = `Issued on ${moment(date).format('MMM YYYY')}`
    } else {
      dat = 'Certificate Not issued '
    }
    return dat
  }
  selectTab(tabIndex: number): void {
    this.selectedTab = tabIndex
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.tabs) {
      this.tabs.unsubscribe()
    }

    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

  ngAfterViewInit() {
  }

  openCertificateDialog(value: any) {
    if (value.issuedCertificates.length !== 0) {
      if (value.issuedCertificates.identifier === value.identifier) {
        const cet = value.dataUrl
        this.dialog.open(ProfileCertificateDialogComponent, {
          autoFocus: false,
          data: { cet, value },
        })
      }
    }
  }
}
