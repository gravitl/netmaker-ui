// window.REACT_APP_BACKEND for container usage
// if running locally or statically, change the 'http://localhost:8081' to desired backend URL and then build
export const BACKEND_URL = (window as any).REACT_APP_BACKEND || 'http://192.168.0.152:8081'

export const NETWORK_DETAIL_TAB_NAME = 'networks'
export const NODE_DETAIL_TAB_NAME = 'nodes'
export const OTK_DETAIL_TAB_NAME = 'access keys'
export const DNS_DETAIL_TAB_NAME = 'dns'
export const EXTERNAL_CLIENTS_TAB_NAME = 'external clients'
// == set UI version here ==
export const UI_VERSION = "0.8.0"

// == local storage keys == 
export const USER_KEY = "netmaker-user"