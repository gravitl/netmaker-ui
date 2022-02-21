import { version } from '../package.json'
// window.REACT_APP_BACKEND for container usage
// if running locally or statically, change the 'http://localhost:8081' to desired backend URL and then build
export const BACKEND_URL =
  (window as any).REACT_APP_BACKEND || 'http//localhost:8081'

export const DEBUG = BACKEND_URL.includes('localhost')


const extractVersion = (v: string | undefined) => {
  if (!!!v) {
    return 'latest'
  }
  if (v.charAt(0) === 'v' || v.charAt(0) === 'V') {
    return v
  }
  return `v${v}`
}

// == set UI version here ==
export const UI_VERSION = extractVersion(version)

// == local storage keys ==
export const USER_KEY = 'netmaker-user'
export const SETTINGS_KEY = 'netmaker-settings'
