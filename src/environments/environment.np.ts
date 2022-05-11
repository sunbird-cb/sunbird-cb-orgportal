export const environment = {
  production: true,
  name: (window as { [key: string]: any })['env']['name'] || '',
  sitePath: 'mdo.karmayogiprod.nic.in',
  karmYogiPath: 'https://karmayogiprod.nic.in',
  cbpPath: 'https://cbp.karmayogiprod.nic.in',
  AdminRole: (window as { [key: string]: any })['env']['AdminRole'] || 'MDO_ADMIN',
  portalRoles: (((window as { [key: string]: any })['env']['portalRoles'] || '').split(',')) || [],

}
