import * as React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PreviewIcon from '@mui/icons-material/Preview';
import CreateIcon from '@mui/icons-material/AddBox';
import { grey } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';

import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next'
import { Language } from '@mui/icons-material';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    '&.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
}));

export default function NodeCard() {
    const { t } = useTranslation()
    
    const cardStyle = {
        marginBottom: '1em',
        marginTop: '1em',
    }

    const cardContentStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    } as any

    const actions = [
        { icon: <Link to='/dns' ><PreviewIcon /></Link>, name: t('common.view')},
        { icon: <Link to='/dns/create' ><CreateIcon /></Link>, name: t('common.create')},
    ];

    return (
        <Card sx={{ minWidth: 275, backgroundColor: grey[200] }} variant='outlined' style={cardStyle}>
            <CardContent>
                <Avatar sx={{ bgcolor: grey[900] }} aria-label={t('breadcrumbs.dns')} >
                    <Language />
                </Avatar>
                <div style={cardContentStyle}>
                    <Typography variant="h5" component="div">
                    {t('breadcrumbs.dns')}
                    </Typography>
                    <Typography variant="body2">
                        {`${t('common.manage')} ${t('breadcrumbs.dns')}`}
                    </Typography>
                </div>
            </CardContent>
            <CardActions>
                <StyledSpeedDial
                ariaLabel={`${t('common.manage')} ${t('breadcrumbds.dns')}`}
                icon={<SpeedDialIcon />}
                direction={"right"}
                >
                {actions.map((action) => (
                    <SpeedDialAction
                    color='primary'
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    />
                ))}
                </StyledSpeedDial>
            </CardActions>
        </Card>
    );
}