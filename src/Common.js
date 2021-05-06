// window.REACT_APP_BACKEND for container usage
// if running locally or statically, change the 'http://localhost:8081' to desired backend URL and then build
export default {
    BACKEND_URL : window.REACT_APP_BACKEND || 'http://localhost:8081'
    MASTER_KEY : window.REACT_APP_KEY || 'secretkey'
}
