import { DataNodeType } from "./types"

// util functions for graph nodes
export const getColor = (dataType: DataNodeType) => {
    switch(dataType) {
        case 'normal': return "#2b00ff"
        case '1&e': return '#d9ffa3'
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