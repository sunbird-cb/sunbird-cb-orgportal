export namespace WOT {

  export interface IActivity {
    activityName: string
    activityDescription: string
  }
  // In UI it's Role
  export interface IActivityGroup {
    groupName: string
    activities: IActivity[]
  }
}