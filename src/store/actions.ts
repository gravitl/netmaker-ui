
import { ActionType } from "typesafe-actions"

import { actions as auth } from "./modules/auth"
import { actions as api } from "./modules/api"
import { actions as network } from "./modules/network"
import { actions as node } from "./modules/node"
import { actions as server } from "./modules/server"

export const actions = {
    auth,
    api,
    network,
    node,
    server
}

export type RootAction = ActionType<typeof actions>