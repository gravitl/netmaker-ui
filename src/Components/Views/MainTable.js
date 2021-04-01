import React from 'react'
import { Grid, Container, Tabs, Tab } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GroupDetails from './GroupDetails'
import AccessKeys from './AccessKeys'
import AllNodes from './AllNodes'
import AllGroups from './AllGroups'

const styles = {
    vertTabs: {
        position: 'relative',
    },
    dataColumn: {
        marginTop: '1em'
    },
    customTab: {
        '&:hover': {
            backgroundColor: '#d3d3d3'
        }
    }
}

const useStyles = makeStyles(styles)

export default function MainTable ({ setGroupData, setNodeData, setGroupSelection, groupData, nodeData, dataSelection, groupSelection, setSuccess }) {

    const [value, setValue] = React.useState(0)
    const [currentGroupTabs, setCurrentGroupTabs] = React.useState([])
    const [shouldUpdate, setShouldUpdate] = React.useState(true)
    const classes = useStyles()

    const generateGroups = () => {
        let tempGroupTabs = []
        for(let i = 0; i < groupData.length; i++) {
            tempGroupTabs.push(
                <Tab className={classes.customTab} disabled={(i+1 === value)} label={groupData[i].displayname} key={groupData[i].displayname} tabIndex={i+1}/>
            )
        }
        setCurrentGroupTabs(tempGroupTabs)
    }

    const handleTabChange = (event, newValue) => {
        // based on selection set the group to parse data for
        setGroupSelection(newValue - 1)
        setValue(newValue)
    }

    React.useEffect(() => {
        if (currentGroupTabs.length === 0 && shouldUpdate) {
            generateGroups()
            setShouldUpdate(false)
        }
    }, [currentGroupTabs.length, shouldUpdate, generateGroups])

    return (
        <Container justify='center'>
            <Grid 
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                >
                <Grid item xs={2}
                    justify='flex-start'
                    alignItems='center'
                    direction='column'
                    className={classes.vertTabs}
                > 
                    <Tabs
                        orientation="vertical"
                        value={value}
                        textColor='primary'
                        indicatorColor='primary'
                        onChange={handleTabChange}
                    >
                        <Tab className={classes.customTab} label='ALL NETWORKS' tabIndex={0}/>
                        {
                            currentGroupTabs.map(groupTab => groupTab)
                        }   
                    </Tabs>
                </Grid>
                <Grid item xs={10} 
                    justify='flex-start'
                    alignItems='center'
                    direction='column'
                    className={classes.dataColumn} >
                    { 
                        groupSelection >= 0 && dataSelection === 0 ? <GroupDetails groupData={groupData[groupSelection]} back={false} setShouldUpdate={setShouldUpdate} setSuccess={setSuccess} setGroupData={setGroupData}/> : 
                        groupSelection >= 0 && dataSelection === 1 ? <AllNodes setNodeData={setNodeData} nodes={nodeData} groupName={groupData[groupSelection].nameid} setSuccess={setSuccess}/> : 
                        groupSelection >= 0 && dataSelection === 2 ? <AccessKeys data={groupData[groupSelection]} /> :
                        groupSelection < 0 && dataSelection === 2 ? <AccessKeys data={null} /> :
                        dataSelection === 1 ? <AllNodes setNodeData={setNodeData} nodes={nodeData} groupName={groupData[groupSelection] ? groupData[groupSelection].nameid : ''} isAllGroups setSuccess={setSuccess} /> :
                        <AllGroups groups={groupData} setSuccess={setSuccess} setGroupData={setGroupData}/>
                    }
                </Grid>
            </Grid>
        </Container>
    )
}
