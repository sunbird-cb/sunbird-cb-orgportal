export namespace NSWatCompetency {
  export interface ICompActivity {
    compName: string
    compDescription: string
    // assignedTo: string
  }
  // In UI it's Role
  export interface ICompActivityGroup {
    roleName: string
    roleDescription: string
    competincies: ICompActivity[]
  }
}
