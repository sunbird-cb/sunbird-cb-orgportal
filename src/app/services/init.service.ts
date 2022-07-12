import { APP_BASE_HREF } from '@angular/common'
// import { retry } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { MatIconRegistry } from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
import { BtnSettingsService } from '@sunbird-cb/collection'
import {
  hasPermissions,
  hasUnitPermission,
  NsWidgetResolver,
  WidgetResolverService,
} from '@sunbird-cb/resolver'
import {
  // AuthKeycloakService,
  ConfigurationsService,
  LoggerService,
  NsAppsConfig,
  NsInstanceConfig,
  // NsUser,
  UserPreferenceService,
  AuthKeycloakService,
} from '@sunbird-cb/utils'
import { map } from 'rxjs/operators'
import { environment } from '../../environments/environment'
/* tslint:disable*/
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
/* tslint:enable*/
// interface IDetailsResponse {
//   tncStatus: boolean
//   roles: string[]
//   group: string[]
//   profileDetailsStatus: boolean
// }

interface IFeaturePermissionConfigs {
  [id: string]: Omit<NsWidgetResolver.IPermissions, 'feature'>
}

const endpoint = {
  profilePid: '/apis/proxies/v8/api/user/v2/read',
  // profileV2: '/apis/protected/v8/user/profileRegistry/getUserRegistryById',
  // details: `/apis/protected/v8/user/details?ts=${Date.now()}`,
  orgProfile: (orgId: string) => `/apis/proxies/v8/org/v1/profile/read?orgId=${orgId}`,
}

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private baseUrl = this.configSvc.baseUrl
  constructor(
    private logger: LoggerService,
    private configSvc: ConfigurationsService,
    private authSvc: AuthKeycloakService,
    private widgetResolverService: WidgetResolverService,
    private settingsSvc: BtnSettingsService,
    private userPreference: UserPreferenceService,
    private http: HttpClient,
    // private widgetContentSvc: WidgetContentService,

    @Inject(APP_BASE_HREF) private baseHref: string,
    // private router: Router,
    domSanitizer: DomSanitizer,
    iconRegistry: MatIconRegistry,
  ) {
    this.configSvc.isProduction = environment.production

    // Register pin icon for use in Knowledge Board
    // Usage: <mat-icon svgIcon="pin"></mat-icon>
    iconRegistry.addSvgIcon(
      'pin',
      domSanitizer.bypassSecurityTrustResourceUrl('mdo-assets/icons/pin.svg'),
    )
    iconRegistry.addSvgIcon(
      'facebook',
      domSanitizer.bypassSecurityTrustResourceUrl('mdo-assets/icons/facebook.svg'),
    )
    iconRegistry.addSvgIcon(
      'linked-in',
      domSanitizer.bypassSecurityTrustResourceUrl('mdo-assets/icons/linked-in.svg'),
    )
    iconRegistry.addSvgIcon(
      'twitter',
      domSanitizer.bypassSecurityTrustResourceUrl('mdo-assets/icons/twitter.svg'),
    )
    iconRegistry.addSvgIcon(
      'goi',
      domSanitizer.bypassSecurityTrustResourceUrl('mdo-assets/icons/emblem-dark.png'),
    )
    iconRegistry.addSvgIcon(
      'hubs',
      domSanitizer.bypassSecurityTrustResourceUrl('mdo-assets/icons/hubs.svg'),
    )
  }

  async init() {
    // this.logger.removeConsoleAccess()
    await this.fetchDefaultConfig()
    // const authenticated = await this.authSvc.initAuth()
    // if (!authenticated) {
    //   this.settingsSvc.initializePrefChanges(environment.production)
    //   this.updateNavConfig()
    //   this.logger.info('Not Authenticated')
    //   return false
    // }
    // Invalid User
    try {
      const path = window.location.pathname
      if (!path.startsWith('/public')) {
        await this.fetchStartUpDetails()
      }// detail: depends only on userID
    } catch (e) {
      this.settingsSvc.initializePrefChanges(environment.production)
      this.updateNavConfig()
      this.logger.info('Not Authenticated')
      // window.location.reload() // can do this
      return false

    }
    try {
      // this.logger.info('User Authenticated', authenticated)
      // const userPrefPromise = await this.userPreference.fetchUserPreference() // pref: depends on rootOrg
      // this.configSvc.userPreference = userPrefPromise
      // this.reloadAccordingToLocale()
      // if (this.configSvc.userPreference.pinnedApps) {
      // const pinnedApps = this.configSvc.userPreference.pinnedApps.split(',')
      // this.configSvc.pinnedApps.next(new Set(pinnedApps))
      // }
      // if (this.configSvc.userPreference.profileSettings) {
      // this.configSvc.profileSettings = this.configSvc.userPreference.profileSettings
      // }
      // await this.fetchUserProfileV2()
      const appsConfigPromise = this.fetchAppsConfig()
      const instanceConfigPromise = this.fetchInstanceConfig() // config: depends only on details
      const widgetStatusPromise = this.fetchWidgetStatus() // widget: depends only on details & feature
      await this.fetchFeaturesStatus() // feature: depends only on details

      /**
       * Wait for the widgets and get the list of restricted widgets
       */
      const widgetConfig = await widgetStatusPromise
      this.processWidgetStatus(widgetConfig)
      this.widgetResolverService.initialize(
        this.configSvc.restrictedWidgets,
        this.configSvc.userRoles,
        this.configSvc.userGroups,
        this.configSvc.restrictedFeatures,
      )
      /**
       * Wait for the instance config and after that
       */
      await instanceConfigPromise
      /*
       * Wait for the apps config and after that
       */
      const appsConfig = await appsConfigPromise
      this.configSvc.appsConfig = this.processAppsConfig(appsConfig)
      if (this.configSvc.instanceConfig) {
        this.configSvc.instanceConfig.featuredApps = this.configSvc.instanceConfig.featuredApps.filter(
          id => appsConfig.features[id],
        )
      }

      // Apply the settings using settingsService
      this.settingsSvc.initializePrefChanges(environment.production)
      this.userPreference.initialize()
    } catch (e) {
      this.logger.warn(
        'Initialization process encountered some error. Application may not work as expected',
        e,
      )
      this.settingsSvc.initializePrefChanges(environment.production)
    }
    this.updateNavConfig()
    // await this.widgetContentSvc
    //   .setS3ImageCookie()
    //   .toPromise()
    //   .catch(() => {
    //     // throw new DataResponseError('COOKIE_SET_FAILURE')
    //   })
    return true
  }

  // private reloadAccordingToLocale() {
  //   if (window.location.origin.indexOf('http://localhost:') > -1) {
  //     return
  //   }
  //   let pathName = window.location.href.replace(window.location.origin, '')
  //   const runningAppLang = this.locale
  //   if (pathName.startsWith(`//${runningAppLang}//`)) {
  //     pathName = pathName.replace(`//${runningAppLang}//`, '/')
  //   }
  //   const instanceLocales = this.configSvc.instanceConfig && this.configSvc.instanceConfig.locals
  //   if (Array.isArray(instanceLocales) && instanceLocales.length) {
  //     const foundInLocales = instanceLocales.some(locale => {
  //       return locale.path !== runningAppLang
  //     })
  //     if (foundInLocales) {
  //       if (
  //         this.configSvc.userPreference &&
  //         this.configSvc.userPreference.selectedLocale &&
  //         runningAppLang !== this.configSvc.userPreference.selectedLocale
  //       ) {
  //         let languageToLoad = this.configSvc.userPreference.selectedLocale
  //         languageToLoad = `\\${languageToLoad}`
  //         if (this.configSvc.userPreference.selectedLocale === 'en') {
  //           languageToLoad = ''
  //         }
  //         location.assign(`${location.origin}${languageToLoad}${pathName}`)
  //       }
  //     }
  //   }
  // }

  private async fetchDefaultConfig(): Promise<NsInstanceConfig.IConfig> {
    const publicConfig: NsInstanceConfig.IConfig = await this.http
      .get<NsInstanceConfig.IConfig>(`${this.baseUrl}/host.config.json`)
      .toPromise()
    this.configSvc.instanceConfig = publicConfig
    this.configSvc.rootOrg = publicConfig.rootOrg
    this.configSvc.org = publicConfig.org
    // TODO: set one org as default org :: use user preference
    this.configSvc.activeOrg = publicConfig.org[0]
    this.configSvc.appSetup = publicConfig.appSetup
    return publicConfig
  }

  get locale(): string {
    return this.baseHref && this.baseHref.replace(/\//g, '')
      ? this.baseHref.replace(/\//g, '')
      : 'en'
  }

  private async fetchAppsConfig(): Promise<NsAppsConfig.IAppsConfig> {
    const appsConfig = await this.http
      .get<NsAppsConfig.IAppsConfig>(`${this.baseUrl}/feature/apps.json`)
      .toPromise()
    return appsConfig
  }

  private async fetchStartUpDetails(): Promise<any> {
    // let userRoles: string[] = []

    if (this.configSvc.instanceConfig && !Boolean(this.configSvc.instanceConfig.disablePidCheck)) {
      let completeProdata: any | null = null
      try {
        completeProdata = await this.http
          .get<any>(endpoint.profilePid)
          .pipe(map((res: any) => {
            // const roles = _.map(_.get(res, 'result.response.roles'), 'role')
            // _.set(res, 'result.response.roles', roles)
            return _.get(res, 'result.response')
          }))
          .toPromise()
        if (completeProdata && completeProdata.roles && completeProdata.roles.length > 0 &&
          this.hasRole(completeProdata.roles)) {
          if (localStorage.getItem('telemetrySessionId')) {
            localStorage.removeItem('telemetrySessionId')
          }
          localStorage.setItem('telemetrySessionId', uuid())
          this.configSvc.unMappedUser = completeProdata
          const profileV2 = _.get(completeProdata, 'profileDetails')
          this.configSvc.userProfile = {
            country: _.get(profileV2, 'personalDetails.countryCode') || null,
            email: _.get(completeProdata, 'profileDetails.personalDetails.primaryEmail ') || completeProdata.email,
            givenName: completeProdata.firstName,
            userId: completeProdata.userId,
            firstName: completeProdata.firstName,
            lastName: completeProdata.lastName,
            userName: completeProdata.userName,
            // tslint:disable-next-line: max-line-length
            // userName: `${completeProdata.firstName ? completeProdata.firstName : ' '}${completeProdata.lastName ? completeProdata.lastName : ' '}`,
            profileImage: completeProdata.thumbnail || _.get(profileV2, 'photo'),
            dealerCode: null,
            isManager: false,
            departmentName: completeProdata.channel,
            rootOrgId: completeProdata.rootOrgId,
            // unit: completeProdata.user.unit_name,
            // tslint:disable-next-line:max-line-length
            // source_profile_picture: completeProdata.source_profile_picture || '',
            // dealerCode:
            //   userPidProfile &&
            //     userPidProfile.user.json_unmapped_fields &&
            //     userPidProfile.user.json_unmapped_fields.dealer_code
            //     ? userPidProfile.user.json_unmapped_fields.dealer_code
            //     : null,
            // isManager:
            //   userPidProfile &&
            //     userPidProfile.user.json_unmapped_fields &&
            //     userPidProfile.user.json_unmapped_fields.is_manager
            //     ? userPidProfile.user.json_unmapped_fields.is_manager
            //     : false,
            // userName: `${userPidProfile.user.first_name} ${userPidProfile.user.last_name}`,
          }
          this.configSvc.userProfileV2 = {
            userId: _.get(profileV2, 'userId') || completeProdata.userId,
            email: _.get(profileV2, 'personalDetails.primaryEmail') || completeProdata.email,
            firstName: _.get(profileV2, 'personalDetails.firstname') || completeProdata.firstName,
            surName: _.get(profileV2, 'personalDetails.surname') || completeProdata.lastName,
            middleName: _.get(profileV2, 'personalDetails.middlename') || '',
            departmentName: _.get(profileV2, 'employmentDetails.departmentName') || completeProdata.channel,
            // tslint:disable-next-line: max-line-length
            // userName: `${_.get(profileV2, 'personalDetails.firstname') ? _.get(profileV2, 'personalDetails.firstname') : ''}${_.get(profileV2, 'personalDetails.surname') ? _.get(profileV2, 'personalDetails.surname') : ''}`,
            userName: _.get(profileV2, 'personalDetails.userName') || completeProdata.userName,
            profileImage: _.get(profileV2, 'photo') || completeProdata.thumbnail,
            dealerCode: null,
            isManager: false,
          }
          if (completeProdata.rootOrg && completeProdata.rootOrg.isInstitute) {
            // console.log('inside is institute ---- calling org profile')
            try {
              const orgProfile = await this.http
                .get<any>(endpoint.orgProfile(completeProdata.rootOrgId))
                .pipe(map((res: any) => {
                  return _.get(res, 'result.result')
                }))
                .toPromise()
              this.configSvc.unMappedUser.orgProfile = orgProfile
            } catch {
              this.configSvc.unMappedUser.orgProfile = null
            }
          } else {
            // console.log('outside is institute ---- NOT calling org profile')
            this.configSvc.unMappedUser.orgProfile = null
          }

        } else {
          this.authSvc.force_logout()
        }
        const details = {
          group: [],
          // profileDetailsStatus: completeProdata.profileDetailStatus,
          profileDetailsStatus: !!_.get(completeProdata, 'profileDetails.mandatoryFieldsExists'),
          roles: (completeProdata.roles || []).map((v: any) => v.toLowerCase()),
          tncStatus: !completeProdata.promptTnC,
          isActive: !!!completeProdata.isDeleted,
        }
        this.configSvc.hasAcceptedTnc = details.tncStatus
        this.configSvc.profileDetailsStatus = details.profileDetailsStatus
        this.configSvc.isActive = details.isActive

        // const roledetails: IDetailsResponse = await this.http
        //   .get<IDetailsResponse>(endpoint.details).pipe(retry(3))
        //   .toPromise()

        this.configSvc.userGroups = new Set(details.group)
        this.configSvc.userRoles = new Set((details.roles || []).map((v: string) => v.toLowerCase()))

        // This is for showing side menu based on loggged in user's root org
        // since we dont have new role for such users, we'll add a role 'isInstuteOrg'
        // so that this role check can be used to show side menu items based on this condition
        if (completeProdata.rootOrg && completeProdata.rootOrg.isInstitute) {
          this.configSvc.userRoles.add('isInstuteOrg')
        }
        return details
      } catch (e) {
        this.configSvc.userProfile = null
        throw new Error('Invalid user')
      }
    } else {
      return { group: [], profileDetailsStatus: true, roles: new Set(['Public']), tncStatus: true, isActive: true }
      // if (this.configSvc.userProfile && this.configSvc.userProfile.isManager) {
      //   this.configSvc.userRoles.add('is_manager')
    }
  }

  // private async fetchUserProfileV2(): Promise<any> {
  //   // const userRoles: string[] = []
  //   if (this.configSvc.instanceConfig && !Boolean(this.configSvc.instanceConfig.disablePidCheck)) {
  //     let userPidProfileV2: NsUser.IUserPidProfileVer2 | null = null
  //     try {
  //       userPidProfileV2 = await this.http
  //         .get<NsUser.IUserPidProfileVer2>(endpoint.profileV2)
  //         .toPromise()
  //     } catch (e) {
  //       this.configSvc.userProfileV2 = null
  //       throw new Error('Invalid user')
  //     }
  //     if (userPidProfileV2) {
  //       const userData: any = _.first(_.get(userPidProfileV2, 'result.UserProfile'))
  //       this.configSvc.userProfileV2 = {
  //         userId: _.get(userData, 'userId'),
  //         firstName: _.get(userData, 'personalDetails.firstname'),
  //         surName: _.get(userData, 'personalDetails.surname'),
  //         middleName: _.get(userData, 'personalDetails.middlename'),
  //         departmentName: _.get(userData, 'employmentDetails.departmentName'),
  //         // tslint:disable-next-line: max-line-length
  //         userName: `${_.get(userData,
  //  'personalDetails.firstname') ? _.get(userData, 'personalDetails.firstname') : ''}$
  // {_.get(userData, 'personalDetails.surname') ? _.get(userData, 'personalDetails.surname') : ''}`,
  //         profileImage: _.get(userData, 'photo'),
  //         dealerCode: null,
  //         isManager: false,
  //       }
  //       // if (this.configSvc.userProfile) {
  //       // tslint:disable-next-line: max-line-length
  //       // this.configSvc.userProfile.departmentName = (_.get(userData,
  // 'employmentDetails.departmentName')) ? _.get(userData, 'employmentDetails.departmentName') : null
  //       // }

  //     }
  //   }
  //   // const details: IDetailsResponse = await this.http
  //   //   .get<IDetailsResponse>(endpoint.details).pipe(retry(3))
  //   //   .toPromise()
  //   // this.configSvc.userGroups = new Set(details.group)
  //   // this.configSvc.userRoles = new Set(details.roles)
  //   // if (this.configSvc.userProfile && this.configSvc.userProfile.isManager) {
  //   //   this.configSvc.userRoles.add('is_manager')
  //   // }
  //   // tslint:disable-next-line: max-line-length
  //   // const details = { group: [], profileDetailsStatus: true, roles: userRoles, tncStatus: true }
  //   // this.configSvc.hasAcceptedTnc = details.tncStatus
  //   // this.configSvc.profileDetailsStatus = details.profileDetailsStatus
  //   // this.configSvc.userRoles = new Set(userRoles)
  //   // return details
  // }

  private async fetchInstanceConfig(): Promise<NsInstanceConfig.IConfig> {
    // TODO: use the rootOrg and org to fetch the instance
    const publicConfig = await this.http
      .get<NsInstanceConfig.IConfig>(`${this.configSvc.sitePath}/site.config.json`)
      .toPromise()
    this.configSvc.instanceConfig = publicConfig
    this.configSvc.rootOrg = publicConfig.rootOrg
    this.configSvc.org = publicConfig.org
    this.configSvc.activeOrg = publicConfig.org[0]
    this.updateAppIndexMeta()
    return publicConfig
  }

  private async fetchFeaturesStatus(): Promise<Set<string>> {
    // TODO: use the rootOrg and org to fetch the features
    const featureConfigs = await this.http
      .get<IFeaturePermissionConfigs>(`${this.baseUrl}/features.config.json`)
      .toPromise()
    this.configSvc.restrictedFeatures = new Set(
      Object.entries(featureConfigs)
        .filter(
          ([_k, v]) => !hasPermissions(v, this.configSvc.userRoles, this.configSvc.userGroups),
        )
        .map(([k]) => k),
    )
    return this.configSvc.restrictedFeatures
  }
  private async fetchWidgetStatus(): Promise<NsWidgetResolver.IRegistrationsPermissionConfig[]> {
    const widgetConfigs = await this.http
      .get<NsWidgetResolver.IRegistrationsPermissionConfig[]>(`${this.baseUrl}/widgets.config.json`)
      .toPromise()
    return widgetConfigs
  }

  private processWidgetStatus(widgetConfigs: NsWidgetResolver.IRegistrationsPermissionConfig[]) {
    this.configSvc.restrictedWidgets = new Set(
      widgetConfigs
        .filter(u =>
          hasPermissions(
            u.widgetPermission,
            this.configSvc.userRoles,
            this.configSvc.userGroups,
            this.configSvc.restrictedFeatures,
          ),
        )
        .map(u => WidgetResolverService.getWidgetKey(u)),
    )
    return this.configSvc.restrictedWidgets
  }

  private processAppsConfig(appsConfig: NsAppsConfig.IAppsConfig): NsAppsConfig.IAppsConfig {
    const tourGuide = appsConfig.tourGuide
    const features: { [id: string]: NsAppsConfig.IFeature } = Object.values(
      appsConfig.features,
    ).reduce((map1: { [id: string]: NsAppsConfig.IFeature }, feature: NsAppsConfig.IFeature) => {
      if (hasUnitPermission(feature.permission, this.configSvc.restrictedFeatures, true)) {
        map1[feature.id] = feature
      }
      return map1
      // tslint:disable-next-line: align
    }, {})
    const groups = appsConfig.groups
      .map((group: NsAppsConfig.IGroup) => ({
        ...group,
        featureIds: group.featureIds.filter(id => Boolean(features[id])),
      }))
      .filter(group => group.featureIds.length)
    return { features, groups, tourGuide }
  }
  private updateNavConfig() {
    if (this.configSvc.instanceConfig) {
      const background = this.configSvc.instanceConfig.backgrounds
      if (background.primaryNavBar) {
        this.configSvc.primaryNavBar = background.primaryNavBar
      }
      if (background.pageNavBar) {
        this.configSvc.pageNavBar = background.pageNavBar
      }
      if (this.configSvc.instanceConfig.primaryNavBarConfig) {
        this.configSvc.primaryNavBarConfig = this.configSvc.instanceConfig.primaryNavBarConfig
      }
    }
  }

  private updateAppIndexMeta() {
    if (this.configSvc.instanceConfig) {
      document.title = this.configSvc.instanceConfig.details.appName
      try {
        if (this.configSvc.instanceConfig.indexHtmlMeta.description) {
          const manifestElem = document.getElementById('id-app-description')
          if (manifestElem) {
            // tslint:disable-next-line: semicolon // tslint:disable-next-line: whitespace
            ; (manifestElem as HTMLMetaElement).setAttribute(
              'content',
              this.configSvc.instanceConfig.indexHtmlMeta.description,
            )
          }
        }
        if (this.configSvc.instanceConfig.indexHtmlMeta.webmanifest) {
          const manifestElem = document.getElementById('id-app-webmanifest')
          if (manifestElem) {
            // tslint:disable-next-line: semicolon // tslint:disable-next-line: whitespace
            ; (manifestElem as HTMLLinkElement).setAttribute(
              'href',
              this.configSvc.instanceConfig.indexHtmlMeta.webmanifest,
            )
          }
        }
        if (this.configSvc.instanceConfig.indexHtmlMeta.pngIcon) {
          const pngIconElem = document.getElementById('id-app-fav-icon')
          if (pngIconElem) {
            // tslint:disable-next-line: semicolon // tslint:disable-next-line: whitespace
            ; (pngIconElem as HTMLLinkElement).href = this.configSvc.instanceConfig.indexHtmlMeta.pngIcon
          }
        }
        if (this.configSvc.instanceConfig.indexHtmlMeta.xIcon) {
          const xIconElem = document.getElementById('id-app-x-icon')
          if (xIconElem) {
            // tslint:disable-next-line: semicolon // tslint:disable-next-line: whitespace
            ; (xIconElem as HTMLLinkElement).href = this.configSvc.instanceConfig.indexHtmlMeta.xIcon
          }
        }
      } catch (error) {
        this.logger.error('Error updating index html meta >', error)
      }
    }
  }
  hasRole(role: string[]): boolean {
    let returnValue = false
    const rolesForCBP = environment.portalRoles
    role.forEach(v => {
      if ((rolesForCBP).includes(v)) {
        returnValue = true
      }
    })
    return returnValue
  }
}
