import * as React from 'react';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import { red, orange, green } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Node } from '~store/types';
import { Collapse, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { ArrowRightAlt, Close, DeleteForever, Edit } from '@mui/icons-material';


interface NodeDetailsProps {
    data: Node;
    handleClose: () => void;
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }
  
const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));

const NodeDetails: React.FC<NodeDetailsProps> = ({ data, handleClose }) => {

  const { t } = useTranslation()
  const [expanded, setExpanded] = React.useState(false);


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
      !!data.id ? 
    <Card sx={{ width: '100%', height: '100%' }}>
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
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show legend"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Legend:</Typography>
        </CardContent>
      </Collapse>
    </Card> :
    <Card sx={{ width: '100%', height: '100%' }}>
    <CardHeader
      title={t('common.legend')}
    />
    <CardContent>
      <List dense>
          <ListItem>
              <ListItemIcon>
                  <ArrowRightAlt />
              </ListItemIcon>
              <ListItemText
              primary={'something'}
              secondary={'ID'}
              />
          </ListItem>
      </List>
    </CardContent>
  </Card>

  );
}

export default NodeDetails
