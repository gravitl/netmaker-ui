import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { LinearProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'

//write component that shows a loding screen that can be used in other components
export interface LoadingProps {
  loading: boolean
}

export default function Loading(Props: LoadingProps) {
  const { t } = useTranslation()

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">{`${t('common.loading')}`}</Typography>
        </div>
      </Grid>
      <Grid item xs={10} sx={{ marginTop: '3em' }}>
        <LinearProgress />
      </Grid>
    </Grid>
  )
}
