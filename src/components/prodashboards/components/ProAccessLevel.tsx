import { Grid, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { proSelectors } from '~store/selectors'
import Loading from '~components/Loading'
import { useParams } from 'react-router-dom'

export const ProAccessLvl: React.FC = () => {
  const { netid } = useParams<{ netid: string }>()
  const userData = useSelector(proSelectors.networkUserData)
  const data = userData[netid]
  const isProcessing = useSelector(proSelectors.isProcessing)

  // useEffect for if networkUsers is processing then show loading then dispatch isprocessing
  if (isProcessing || !data) {
    return <Loading />
  }

  return (
    <Grid container justifyContent="space-around" alignItems="center">
      <Grid item xs={12}>
        <div style={{ textAlign: 'center', margin: '1em 0 1em 0' }}>
          <Typography variant="h5">{`Your Access Level for this network is: ${data.user.accesslevel}`}</Typography>
        </div>
      </Grid>
    </Grid>
  )
}
