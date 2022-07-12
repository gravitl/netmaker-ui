import { MutableRequired } from "../acls"

export type UserGroups =  MutableRequired<{ [groupName: string] : void}>

export interface UserGroupsPayload {
    Request: void
    Response: UserGroups
}

export interface UserGroupDelorCreate {
    Request: { groupName: string }
    Response: { groupName: string }
}
