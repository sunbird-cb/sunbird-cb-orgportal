export const environment = {
  production: true,
  name: (window as { [key: string]: any })['env']['name'] || '',
  sitePath: (window as { [key: string]: any })['env']['sitePath'] || '',
  karmYogiPath: (window as { [key: string]: any })['env']['karmYogiPath'] || '',
  cbpPath: (window as { [key: string]: any })['env']['cbpPath'] || '',
  AdminRole: (window as { [key: string]: any })['env']['AdminRole'] || 'MDO_ADMIN',
  portalRoles: (((window as { [key: string]: any })['env']['portalRoles'] || '').split(',')) || [],
}
