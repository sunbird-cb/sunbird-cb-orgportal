export const environment = {
  production: true,
  sitePath: 'mdo.karmayogiprod.nic.in',
  karmYogiPath: 'https://karmayogiprod.nic.in',
  cbpPath: 'https://cbp.karmayogiprod.nic.in',
  portalRoles: (((window as { [key: string]: any })['env']['portalRoles'] || '').split(',')) || [],

}
