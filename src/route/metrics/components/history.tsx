import createHistory from 'history/createBrowserHistory'
import { useDispatch } from 'react-redux'
import { clearCurrentMetrics } from '~store/modules/server/actions'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

// Get the current location.

// Listen for changes to the current location.
const unlisten = history.listen((location, action) => {
  // location is an object like window.location
  console.log(action, location.pathname, location.state)
})

// Use push, replace, and go to navigate around.
history.push('/home', { some: 'state' })

// To stop listening, call the function returned from listen().
unlisten()
