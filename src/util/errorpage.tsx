import { Button, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Logo from '../netmaker-logo.png'
import DarkLogo from '../netmaker-logo-2.png'
import { useSelector } from 'react-redux'
import { authSelectors } from '~store/selectors'
import WarningIcon from '@mui/icons-material/Warning'
import { Link } from 'react-router-dom'

export const NotFound: React.FC = () => {
  const { t } = useTranslation()
  const inDarkMode = useSelector(authSelectors.isInDarkMode)

  const styles = {
    logo: {
      objectFit: 'cover',
      // height: 70,
      maxWidth: '40%',
      height: 'auto',
      width: 'auto',
      minWidth: '8em',
    } as React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    center: {
      textAlign: 'center'
    } as React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
  }

  return (
    <div style={styles.center}>
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={10} sx={{ marginTop: '1em' }}>
        <WarningIcon style={{ fontSize: '2em' }} />
      </Grid>
      <Grid item xs={10}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '1em',
          }}
        >
          <Typography variant="h4">{`${t('error.notfound')}`}</Typography>
        </div>
      </Grid>
      <Grid item xs={10} sx={{ marginTop: '3em' }}>
        <Button component={Link} to='/'>
          <img
            style={styles.logo}
            src={inDarkMode ? DarkLogo : Logo}
            alt="Netmaker makes networks."
          />
        </Button>
      </Grid>
    </Grid>
    </div>
  )
}
