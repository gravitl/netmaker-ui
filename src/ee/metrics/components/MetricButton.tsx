import { Button } from '@mui/material'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCurrentMetrics } from '~store/modules/server/actions'

type Props = {
    link: string
    text: string | undefined
    sx?: any
    logic?: () => void
}

export default function MetricButton(props: Props) {
    const dispatch = useDispatch()
    const history = useHistory()

    return (<Button 
        color='primary'
        variant='text'
        sx={{ ...props.sx }} 
        onClick={() => {
            if (!!props.logic) {
                props.logic()
            }
            dispatch(clearCurrentMetrics())
            history.push(props.link)
        }}>
        {props.text}
    </Button>)
}
