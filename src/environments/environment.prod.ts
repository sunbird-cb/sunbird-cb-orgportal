export const environment = {
  production: true,
  name: (window as { [key: string]: any })['env']['name'] || '',
  sitePath: (window as { [key: string]: any })['env']['sitePath'] || '',
  karmYogiPath: (window as { [key: string]: any })['env']['karmYogiPath'] || '',
  cbpPath: (window as { [key: string]: any })['env']['cbpPath'] || '',
  portalRoles: (((window as { [key: string]: any })['env']['portalRoles'] || '').split(',')) || [],
  contentHost: (window as { [key: string]: any })['env']['contentHost'] || '',
  contentBucket: (window as { [key: string]: any })['env']['azureBucket'] || '',
}
