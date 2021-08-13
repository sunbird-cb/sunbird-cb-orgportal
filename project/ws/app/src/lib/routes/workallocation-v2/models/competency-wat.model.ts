export namespace NSWatCompetency {
  export interface ICompActivity {
    localId: number
    compId: string
    compName: string
    compDescription: string
    compLevel?: string
    compType?: string
    compArea?: string
    levelList?: any[]
    compSource?: string
    // assignedTo: string
  }
  // In UI it's Role
  export interface ICompActivityGroup {
    localId: number
    roleId: string
    roleName: string
    roleDescription: string
    competincies: ICompActivity[]
  }
}
