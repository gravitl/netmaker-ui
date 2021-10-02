import { RootState } from "../../reducers"

export const getApi = (state: RootState) => state.api.axios
