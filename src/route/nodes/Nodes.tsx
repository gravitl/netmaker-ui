import {
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { nodeSelectors } from '~store/selectors'
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NodeTable } from './components/NodeTable'
import { NetworkSelect } from '../../components/NetworkSelect'
import { Search, Sync } from '@mui/icons-material'
import { NetworkNodes } from './netid/NetworkNodes'
import { Tablefilter } from '~components/filter/Tablefilter'
import { setNodeSort } from '~store/modules/node/actions'

export const Nodes: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const listOfNodes = useSelector(nodeSelectors.getNodes)
  const nodeSort = useSelector(nodeSelectors.getNodeSort)
  const [filterNodes, setFilterNodes] = React.useState(listOfNodes)
  const history = useHistory()
  const dispatch = useDispatch()

  const syncNodes = () => {
    history.push('/nodes')
  }

  const handleFilter = (event: { target: { value: string } }) => {
    const { value } = event.target
    const searchTerm = value.trim()
    if (!!!searchTerm) {
      setFilterNodes(listOfNodes)
    } else {
      setFilterNodes(
        listOfNodes.filter((node) =>
          `${node.name}${node.address}${node.network}`.includes(searchTerm)
        )
      )
    }
  }

  const handleNodeSortSelect = (selection: string) => {
    if (
      selection === 'address' ||
      selection === 'name' ||
      selection === 'network'
    ) {
      dispatch(
        setNodeSort({
          ...nodeSort,
          value: selection,
        })
      )
    }
  }

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <Grid container justifyContent="space-around" alignItems="center">
            <Grid item xs={3} md={3}>
              <h2>{t('node.nodes')}</h2>
            </Grid>
            <Grid item xs={10} md={7}>
              <Grid container justifyContent="space-around" alignItems="center">
                <Grid item xs={10} md={3.5}>
                  <Tablefilter
                    values={['address', 'name', 'network']}
                    ascending={nodeSort.ascending}
                    onSelect={handleNodeSortSelect}
                    onAscendClick={() => {
                      dispatch(
                        setNodeSort({
                          ...nodeSort,
                          ascending: !nodeSort.ascending,
                        })
                      )
                    }}
                    currentValue={nodeSort.value}
                  />
                </Grid>
                <Grid item xs={10} md={3} display="flex">
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    label={`${t('common.search')} ${t('node.nodes')}`}
                    onChange={handleFilter}
                  />
                </Grid>
                <Grid item xs={8} md={3} display="flex" paddingBottom="1rem">
                  <NetworkSelect />
                </Grid>
                <Grid item xs={1} md={1} display="flex">
                  <Tooltip title={t('node.sync') as string} placement="top">
                    <IconButton color="primary" onClick={syncNodes}>
                      <Sync />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <NodeTable
            nodes={
              filterNodes.length && filterNodes.length < listOfNodes.length
                ? filterNodes
                : listOfNodes
            }
          />
        </Route>

        <Route path={`${path}/:netid`}>
          <NetworkNodes />
        </Route>
      </Switch>
    </Container>
  )
}
