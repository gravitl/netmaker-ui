import { DataNodeType } from "./types"
import { isNodeHealthy } from "~util/fields"
import { NodeConnectivityStatus } from "~store/types"

// util functions for graph nodes
export const getNodeColor = (dataType: DataNodeType, lastcheckin: number | undefined) => {
    if (!!lastcheckin) {
        switch(isNodeHealthy(lastcheckin)) {
            case 1: return "#ff9800"
            case 2: return "#f44336"
        }
    }
    switch(dataType) {
        case 'normal': return "#2b00ff"
        case '1&e': return '#d9ffa3'
        case 'e&r': return '#19ffb2'
        case 'i&r': return '#d5db8a'
        case 'egress': return '#6bdbb6'
        case 'ingress': return '#ebde34'
        case 'extclient': return '#26ffff'
        case 'relay': return '#a552ff'
        case 'relayed': return '#639cbf'
        case 'cidr': return '#6fa397'
        case 'i&e&r': return '#f2c7ff'
        default: return "#2b00ff"
    }
}

/**
 * Get edge color based on edge connectivity status.
 * 
 * @param {NodeConnectivityStatus} status status of the edge
 * @returns hex color code
 */
export const getEdgeColor = (status: NodeConnectivityStatus): string => {
    const RED_COLOR = '#CC0000'
    const YELLOW_COLOR = '#CCCC00'
    const GREEN_COLOR = '#00CC00'
    const WHITE_COLOR = '#FFFFFF'

    switch (status) {
        case 'healthy':
            return GREEN_COLOR
        case 'warning':
            return YELLOW_COLOR
        case 'error':
            return RED_COLOR
        default:
            return WHITE_COLOR
    }
}
