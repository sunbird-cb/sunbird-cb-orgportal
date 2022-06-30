export const environment = {
  production: true,
  name: (window as { [key: string]: any })['env']['name'] || '',
  sitePath: 'mdo.karmayogiprod.nic.in',
  karmYogiPath: 'https://karmayogiprod.nic.in',
  cbpPath: 'https://cbp.karmayogiprod.nic.in',
  portalRoles: (((window as { [key: string]: any })['env']['portalRoles'] || '').split(',')) || [],
  contentHost: (window as { [key: string]: any })['env']['contentHost'] || '',
  contentBucket: (window as { [key: string]: any })['env']['azureBucket'] || '',
}
