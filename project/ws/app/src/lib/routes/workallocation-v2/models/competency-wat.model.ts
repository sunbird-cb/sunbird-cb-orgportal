export namespace NSWatCompetency {
  export interface ICompActivity {
    compName: string
    compDescription: string
    compLevel?: string
    compType?: string
    compArea?: string
    // assignedTo: string
  }
  // In UI it's Role
  export interface ICompActivityGroup {
    roleName: string
    roleDescription: string
    competincies: ICompActivity[]
  }
}
