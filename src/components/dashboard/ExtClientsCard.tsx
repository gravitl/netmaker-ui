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

import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next'

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

    const actions = [
        { icon: <Link to='/ext-clients' ><PreviewIcon /></Link>, name: t('common.view')},
        { icon: <Link to='/ext-clients/create' ><CreateIcon /></Link>, name: t('common.create')},
    ];

    return (
        <Card sx={{ minWidth: 275 }} variant='outlined' style={cardStyle}>
            <CardContent>
                <Typography variant="h5" component="div">
                {t('breadcrumbs.extClients')}
                </Typography>
                <Typography variant="body2">
                    {`${t('common.manage')} ${t('breadcrumbs.extClients')}`}
                <br />
                </Typography>
            </CardContent>
            <CardActions>
                <StyledSpeedDial
                ariaLabel={`${t('common.manage')} ${t('breadcrumbs.extClients')}`}
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