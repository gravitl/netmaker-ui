import { History, Location } from 'history'

export interface RouterState {
  history?: History
  location?: Location
  prevLocation?: Location
}

export interface RouterAction {
  history: History
  location: Location
}
