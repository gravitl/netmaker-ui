import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import { red, orange, green, grey } from '@mui/material/colors';
import { Node } from '~store/types';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ArrowRightAlt, Circle, Close, DeleteForever, Edit } from '@mui/icons-material';


interface NodeDetailsProps {
    data: Node | undefined;
    handleClose: () => void;
    altData: {
        id: string
        name: string
        type: 'extclient' | 'cidr' 
    } | undefined
}
  
const NodeDetails: React.FC<NodeDetailsProps> = ({ data, handleClose, altData }) => {

  const { t } = useTranslation()

  const legendData = [
      { label: t('node.nodes'), color: '#2b00ff' },
      { label: t('node.isegressgateway'), color: '#6bdbb6' },
      { label: t('node.isingressgateway'), color: '#ebde34' },
      { label: t('node.isingressegress'), color: '#d9ffa3'},
      { label: t('extclient.extclient'), color: '#26ffff'},
      { label: t('node.isrelay'), color: '#a552ff' },
      { label: t('node.isrelayed'), color: '#639cbf'},
      { label: t('common.cidr'), color: '#6fa397' },
  ]

  return (
    !!data && !!data.id ? 
    <Card sx={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: () => {
            const time = Date.now() / 1000
            if (time - data.lastcheckin >= 1800)
              return red[500]
            if (time - data.lastcheckin >= 300)
              return orange[500]
            return green[500]
          }}} aria-label="node-status">
              {data.name.substring(0, 1)}
          </Avatar>
        }
        action={
          <IconButton aria-label="close node details" onClick={handleClose}>
            <Close />
          </IconButton>
        }
        title={data.name}
        subheader={data.address}
      />
      <CardContent>
        <List dense>
            <ListItem>
                <ListItemIcon>
                    <ArrowRightAlt />
                </ListItemIcon>
                <ListItemText
                primary={data.id}
                secondary={'ID'}
                />
            </ListItem>
            <ListItem>
                <ListItemIcon>
                    <ArrowRightAlt />
                </ListItemIcon>
                <ListItemText
                primary={data.address}
                secondary={t('node.address')}
                />
            </ListItem>
            <ListItem>
                <ListItemIcon>
                    <ArrowRightAlt />
                </ListItemIcon>
                <ListItemText
                primary={data.endpoint}
                secondary={t('node.endpoint')}
                />
            </ListItem>
            <ListItem>
                <ListItemIcon>
                    <ArrowRightAlt />
                </ListItemIcon>
                <ListItemText
                primary={data.os || 'N/A'}
                secondary={t('node.os')}
                />
            </ListItem>
        </List>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="edit node">
          <Edit />
        </IconButton>
        <IconButton aria-label="delete node">
          <DeleteForever />
        </IconButton>
      </CardActions>
    </Card> : !!altData && !!altData.id ? 
    <Card sx={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }}>
        <CardHeader
        avatar={
            <Avatar sx={{ bgcolor: grey[500]}} aria-label={`${altData.type}-status`}>
                {altData.name.substring(0, 3)}
            </Avatar>
        }
        action={
            <IconButton aria-label="close node details" onClick={handleClose}>
            <Close />
            </IconButton>
        }
        title={altData.name}
        subheader={altData.type}
        />
        <CardContent>
        <List dense>
            <ListItem>
                <ListItemIcon>
                    <ArrowRightAlt />
                </ListItemIcon>
                <ListItemText
                primary={altData.id}
                secondary={'ID'}
                />
            </ListItem>
            <ListItem>
                <ListItemIcon>
                    <ArrowRightAlt />
                </ListItemIcon>
                <ListItemText
                primary={altData.type}
                secondary={t('common.type')}
                />
            </ListItem>
        </List>
        </CardContent>
    </Card> :
    <Card sx={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }}>
    <CardContent>
      <List dense>
          {legendData.map(indicator =>
          <ListItem key={indicator.label}>
              <ListItemIcon>
                  <Circle htmlColor={indicator.color}/>
              </ListItemIcon>
              <ListItemText
                primary={indicator.label}
              />
          </ListItem>)}
      </List>
    </CardContent>
  </Card>

  );
}

export default NodeDetails
