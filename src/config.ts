import { version } from '../package.json'
// window.REACT_APP_BACKEND for container usage
// if running locally or statically, change the 'http://localhost:8081' to desired backend URL and then build
export const BACKEND_URL =
  (window as any).REACT_APP_BACKEND || 'https://api.nm1.204-48-24-21.nip.io'

export const DEBUG = BACKEND_URL.includes('localhost')

// == set UI version here ==
export const UI_VERSION = version

// == local storage keys ==
export const USER_KEY = 'netmaker-user'
export const SETTINGS_KEY = 'netmaker-settings'
