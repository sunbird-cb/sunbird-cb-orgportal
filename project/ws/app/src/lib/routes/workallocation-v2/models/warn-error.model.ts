export interface IWarnError {
  _type: 'error' | 'warning'
  counts: number,
  label: string,
  type: string,
}
