export type UserGroups = Set<string> | undefined

export interface UserGroupsPayload {
    Request: void
    Response: UserGroups
}

export interface UserGroupDelorCreate {
    Request: { groupName: string }
    Response: { groupName: string }
}
