// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvironment = {
  production: false,
  name: (window as { [key: string]: any })['env']['name'] || '',
  sitePath: (window as { [key: string]: any })['env']['sitePath'] || '',
  karmYogiPath: (window as { [key: string]: any })['env']['karmYogiPath'] || '',
  cbpPath: (window as { [key: string]: any })['env']['cbpPath'] || '',
  portalRoles: (((window as { [key: string]: any })['env']['portalRoles'] || '').split(',')) || [],
  contentHost: (window as { [key: string]: any })['env']['contentHost'] || '',
  contentBucket: (window as { [key: string]: any })['env']['azureBucket'] || '',
  userBucket: (window as { [key: string]: any })['env']['userBucket'] || '',
  domainName: (window as { [key: string]: any })['env']['domainName'] || '',
  mdoPath: (window as { [key: string]: any })['env']['mdoPath'] || '',
  resendOTPTIme: (window as { [key: string]: any })['env']['resendOTPTIme'] || 120,
}
interface IEnvironment {
  name: null | string
  production: boolean
  sitePath: null | string
  karmYogiPath: string
  cbpPath: string
  portalRoles: string[]
  contentHost: string
  contentBucket?: string
  userBucket?: string
  domainName?: string
  mdoPath: string,
  resendOTPTIme: number,
}

/*
 * For easier debugging in development mode, you can import the    file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error' // Included with Angular CLI.x
