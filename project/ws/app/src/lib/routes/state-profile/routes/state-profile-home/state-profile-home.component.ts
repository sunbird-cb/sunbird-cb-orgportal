import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core'
import { map } from 'rxjs/operators'
import { ConfigurationsService, ValueService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router'
import { NSProfileDataV3 } from '../../models/state-profile.models'
// tslint:disable-next-line
import _ from 'lodash'
import { Subscription } from 'rxjs'
import { StepService } from '../../services/step.service'
import { CompLocalService } from '../../services/comp.service'
// import { ProfileV3Service } from '../../services/profile_v3.service'
import { OrgProfileService } from '../../services/org-profile.service'
@Component({
  selector: 'ws-app-state-profile-home',
  templateUrl: './state-profile-home.component.html',
  styleUrls: ['./state-profile-home.component.scss'],
})
export class StateProfileHomeComponent implements OnInit, OnDestroy {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  isLtMedium$ = this.valueSvc.isLtMedium$
  private defaultSideNavBarOpenedSubscription: any
  sideNavBarOpened = true
  public screenSizeIsLtMedium = false
  sticky = false
  currentRoute = 'all'
  banner!: NsWidgetResolver.IWidgetData<any>
  userRouteName = ''
  private routerSubscription: Subscription | null = null

  tabs!: NSProfileDataV3.IProfileTab[]
  tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
  message = `Welcome to the Portal`
  currentStep = 1
  mode$ = this.isLtMedium$.pipe(map((isMedium: any) => (isMedium ? 'over' : 'side')))
  constructor(
    private valueSvc: ValueService,
    private route: ActivatedRoute,
    private router: Router,
    private stepService: StepService,
    private configSvc: ConfigurationsService,
    // private compLocalService: CompLocalService,
    // private profileSvc: ProfileV3Service,
    // private orgSvc: OrgProfileService,
  ) {
    this.tabs = _.orderBy(this.tabsData, 'step')
    this.stepService.allSteps.next(this.tabs.length)
    this.init()
  }
  init() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) { // do not delete this
        // console.log(event)
      }
      if (event instanceof NavigationEnd) {
        _.each(this.tabs, t => {
          if (event.url.indexOf(t.routerLink) !== -1) {
            this.message = t.description
            this.currentStep = t.step
            this.stepService.currentStep.next(t)
          }
        })
      }
    })
  }
  updateProfile() {
    // need to update profile
    this.router.navigate(['/page/home'])
  }
  // updateCompentency() {
  //   this.tabs.forEach(s => {
  //     if (s.step === this.currentStep) {
  //       if (s.key.indexOf('currentcompetencies') !== -1 && this.configSvc.userProfileV2) {
  //         if (this.compLocalService.autoSaveCurrent.value) {
  //           // console.log("currentcompetencies========>", this.compLocalService.currentComps.value)
  //           this.profileSvc.updateCCProfileDetails({
  //             request: {
  //               profileDetails: {
  //                 competencies: this.compLocalService.currentComps.value,
  //               },
  //               userId: this.configSvc.userProfileV2.userId,
  //             },
  //           }).subscribe(sres => {
  //             if (sres && sres.responseCode === 'OK') {
  //               this.compLocalService.autoSaveCurrent.next(false)
  //               // this.configSvc.updateGlobalProfile(true)
  //             }
  //           })

  //         }
  //       } else if (s.key.indexOf('desiredcompetencies') !== -1 && this.configSvc.userProfileV2) {
  //         if (this.compLocalService.autoSaveDesired.value) {
  //           // console.log("desiredcompetencies========>", this.compLocalService.desiredComps.value)
  //           this.profileSvc.updateDCProfileDetails({
  //             request: {
  //               profileDetails: {
  //                 desiredCompetencies: this.compLocalService.desiredComps.value,
  //               },
  //               userId: this.configSvc.userProfileV2.userId,
  //             },
  //           }).subscribe(res => {
  //             if (res && res.responseCode === 'OK') {
  //               this.compLocalService.autoSaveDesired.next(false)
  //               // this.configSvc.updateGlobalProfile(true)
  //             }
  //           })
  //         }
  //       }
  //     }
  //   })
  // }

  updateOrgProfile() {
    this.tabs.forEach(s => {
      if (s.step === this.currentStep) {
        console.log('in updateOrgProfile', s)
        const request = {
          profileDetails: {
            [s.key]: 'add the data here...from respective form',
          },
          orgId: _.get(this.configSvc.unMappedUser, 'rootOrgId'),
        }
        console.log('request: ', request)

        // Call API to update org profile

        // this.orgSvc.updateOrgProfileDetails(request).subscribe(res => {
        //   if (res && res.responseCode === 'OK') {
        //     // this.compLocalService.autoSaveDesired.next(false)
        //     // this.configSvc.updateGlobalProfile(true)
        //   }
        // })
      }
    })
  }

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })

  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
  }
  get next() {
    if (!this.isNextStepAllowed) { return }
    const nextStep = _.first(_.filter(this.tabs, { step: this.currentStep + 1 }))
    if (nextStep) {
      console.log(JSON.stringify(this.currentStep) + '+++++ current step====')
      console.log(JSON.stringify(nextStep) + '------next step ----')
      return nextStep
    }
    return 'done'

  }

  get previous() {
    const previousStep = _.first(_.filter(this.tabs, { step: this.currentStep - 1 }))
    if (previousStep !== undefined) {
      return previousStep
    }
    return 'first'
  }
  get skip() {
    if (!this.isNextStepAllowed) { return }
    this.stepService.skiped.next(true)
    const nextStep = _.first(_.filter(this.tabs, { step: this.currentStep + 1 }))
    if (nextStep && nextStep.step !== this.tabs.length + 1) {
      return nextStep
    }
    return null
  }
  get current() {
    const currentStep = _.first(_.filter(this.tabs, { step: this.currentStep }))
    if (currentStep !== undefined) {
      // console.log(JSON.stringify(currentStep)+ '-- value of currentStep======-')
      return currentStep

    }
    return null
  }
  get isNextStepAllowed(): boolean {
    let isAllowed = false
    this.tabs.forEach(s => {
      if (s.step === this.currentStep) {
        if (s.key.indexOf('welcome') !== -1) {
          isAllowed = true
        } else if (s.key.indexOf('instituteProfile') !== -1) {
          if (this.stepService.currentStep.value.allowSkip) {
            isAllowed = true
          }
        } else if (s.key.indexOf('rolesAndFunctions') !== -1) {
          if (this.stepService.currentStep.value.allowSkip) {
            isAllowed = true
          }
        } else if (s.key.indexOf('infrastructure') !== -1) {
          if (this.stepService.currentStep.value.allowSkip) {
            isAllowed = true
          }
        } else if (s.key.indexOf('trainingPrograms') !== -1) {
          if (this.stepService.currentStep.value.allowSkip) {
            isAllowed = true
          }
        } else if (s.key.indexOf('research') !== -1) {
          if (this.stepService.currentStep.value.allowSkip) {
            isAllowed = true
          }
        } else if (s.key.indexOf('consultancy') !== -1) {
          if (this.stepService.currentStep.value.allowSkip) {
            isAllowed = true
          }
        } else if (s.key.indexOf('faculty') !== -1) {
          if (this.stepService.currentStep.value.allowSkip) {
            isAllowed = true
          }
        } else if (s.key.indexOf('platformWalkthrough') !== -1) {
          if (this.stepService.currentStep.value.allowSkip) {
            isAllowed = true
          }
        }
      }
    })
    return isAllowed
  }
}
