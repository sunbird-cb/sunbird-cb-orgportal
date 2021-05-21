export namespace NSWatCompetency {
  export interface ICompActivity {
    activityName: string
    activityDescription: string
    assignedTo: string
  }
  // In UI it's Role
  export interface ICompActivityGroup {
    groupName: string
    groupDescription: string
    activities: ICompActivity[]
  }
}