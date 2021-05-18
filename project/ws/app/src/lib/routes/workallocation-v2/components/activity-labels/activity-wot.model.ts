export namespace NSWat {

  export interface IActivity {
    activityName: string
    activityDescription: string
    assignedTo: string
  }
  // In UI it's Role
  export interface IActivityGroup {
    groupName: string
    groupDescription: string
    activities: IActivity[]
  }
}