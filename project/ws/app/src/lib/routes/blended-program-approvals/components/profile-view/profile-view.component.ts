
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core'
// import { MatNavList } from '@angular/material/list'
import { NSProfileDataV2 } from '../../../../routes/approvals/models/profile-v2.model'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
// import { DiscussService } from '../../../discuss/services/discuss.service'
// import { ProfileV2Service } from '../../services/profile-v2.servive'
/* tslint:disable */
import _ from 'lodash'
// import { NetworkV2Service } from '../../../network-v2/services/network-v2.service'
// import { NSNetworkDataV2 } from '../../../network-v2/models/network-v2.model'
// import { ConfigurationsService, ValueService } from '@sunbird-cb/utils'
// import { map } from 'rxjs/operators'
import { BlendedApporvalService } from '../../services/blended-approval.service'

import {
  WidgetUserService,
  NsContent
  // WidgetContentService,
} from '@sunbird-cb/collection'
/* tslint:enable */
// import {  } from '@sunbird-cb/utils'

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class ProfileViewComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private bpService: BlendedApporvalService,
    public router: Router,
    private userSvc: WidgetUserService,
  ) {
    this.Math = Math
    // this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId

    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    const userId = this.route.snapshot.params.userId

    this.bpService.getUserById(userId).subscribe((res: any) => {
      this.viewProfile = res
      // this.designation = res?.profileDetails?.professionalDetails[0]?.designation;
      this.userSvc.fetchUserBatchList(userId).subscribe((result: any) => {
        this.certificationData = result
      })
      this.portalProfile = res
      this.designation = res.profileDetails.professionalDetails
      this.academics = res.profileDetails.academics

      // this.location = res.profileDetails.professionalDetails[0].location
      // this.doj = res.profileDetails.professionalDetails[0].doj
      // this.description = res.profileDetails.professionalDetails[0].description

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
      // this.fetchUserBatchList()

    })

  }
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  sticky = false
  /* tslint:disable */
  selectedTab: number = 2; // Default selected tab
  doj: any
  description: any
  academics: any

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
  designation!: string | null
  tabsData: NSProfileDataV2.IProfileTab[]
  currentUser!: string | null
  // connectionRequests!: NSNetworkDataV2.INetworkUser[]
  currentUsername: any
  certificationData: any
  viewProfile: any[] = []
  enrolledCourse: any = []
  allCertificate: any = []

  sideNavBarOpened = true
  verifiedBadge = false
  private defaultSideNavBarOpenedSubscription: any
  public screenSizeIsLtMedium = false

  selectTab(tabIndex: number): void {
    this.selectedTab = tabIndex
  }
  // isLtMedium$ = this.valueSvc.isLtMedium$
  // mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }
  decideAPICall() {
    const user = this.portalProfile.userId || this.portalProfile.id || ''
    if (this.portalProfile && user) {
      this.fetchUserDetails(this.currentUsername)
      // this.fetchConnectionDetails(user)
    } else {

      // if (this.configSvc.userProfile) {
      //   const me = this.configSvc.userProfile.userName || ''
      //   if (me) {
      //     this.fetchUserDetails(me)
      //     // this.fetchConnectionDetails(this.configSvc.userProfile.userId)
      //   }
      // }

    }
  }

  ngOnInit() {

    // int left blank

    // this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
    //   this.sideNavBarOpened = !isLtMedium
    // })
  }

  ngOnDestroy() {
    if (this.tabs) {
      this.tabs.unsubscribe()
    }

    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

  ngAfterViewInit() {
    // this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
  }
  fetchUserDetails(name: string) {
    if (name) {
      // this.discussService.fetchProfileInfo(name).subscribe((response: any) => {
      //   if (response) {
      //     this.discussProfileData = response
      //     this.discussionList = _.uniqBy(_.filter(this.discussProfileData.posts, p => _.get(p, 'isMainPost') === true), 'tid') || []
      //   }
      // })
    }
  }
  // fetchConnectionDetails(wid: string) {
  //   this.networkV2Service.fetchAllConnectionEstablishedById(wid).subscribe(
  //     (data: any) => {
  //       this.connectionRequests = data.result.data
  //     },
  //     (_err: any) => {
  //       // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError)
  //     })
  // }

  fetchUserBatchList() {
    const user = this.portalProfile.userId || this.portalProfile.id || ''
    this.userSvc.fetchUserBatchList(user).subscribe((courses: NsContent.ICourse[]) => {

      courses.forEach(items => {
        if (items.completionPercentage === 100) {
          this.enrolledCourse.push(items)
          // return items;
        }
      })
      // this.downloadAllCertificate(this.enrolledCourse)
    })
  }

  // downloadAllCertificate(data: any) {
  //   data.forEach((item: any) => {
  //     if (item.issuedCertificates.length !== 0) {
  //       const certId = item.issuedCertificates[0].identifier
  //       this.contentSvc.downloadCert(certId).subscribe(response => {

  //         this.allCertificate.push({ identifier: item.issuedCertificates[0].identifier, dataUrl: response.result.printUri })

  //       })
  //     }
  //   })
  // }
}
