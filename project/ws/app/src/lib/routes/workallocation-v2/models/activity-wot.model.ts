export namespace NSWatActivity {

  export interface IActivity {
    localId?: string
    activityId: string
    activityName: string
    activityDescription: string
    assignedTo: string
    assignedToId: string
    assignedToEmail: string
    submissionFrom: string
    submissionFromId: string
    submissionFromEmail: string
  }
  // In UI it's Role
  export interface IActivityGroup {
    localId?: number
    groupId: string
    groupName: string
    groupDescription: string
    activities: IActivity[]
  }
}
