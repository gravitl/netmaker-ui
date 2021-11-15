import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { LocationListener } from 'history'
import { routerActions } from './actions'

export const RouterState = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const historyListener = useCallback<LocationListener>(
    (location, action) => {
      dispatch(
        routerActions[action]({
          location,
          history,
        })
      )
    },
    [dispatch, history]
  )

  useEffect(() => {
    historyListener(history.location, 'POP')
    return history.listen(historyListener)
  }, [history, historyListener])

  return null
}
