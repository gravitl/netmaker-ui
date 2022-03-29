import React, { useState, useEffect } from 'react'
// import { Node } from '~store/types'
import { Node } from '~store/types'
import Graph from "graphology";
import { Attributes } from "graphology-types";
import circular from "graphology-layout/circular";
import {
  useSigma,
  useRegisterEvents,
  useLoadGraph,
  useSetSettings,
} from "react-sigma-v2";
import forceAtlas2 from "graphology-layout-forceatlas2";
import "react-sigma-v2/lib/react-sigma-v2.css";
import { AltDataNode, DataNode } from './types';
import { getColor } from './util';

interface IJSONData {
  nodes: Node[];
  edges: {
    from: string
    to: string
  }[]
  nodeTypes: DataNode[]
}

interface IGraphHoverState {
  hoverNode: string | undefined;
  hoverNeighbours: string[] | undefined;
}

interface ICustomGraphProps {
  data: IJSONData;
  handleViewNode: (viewNode: Node) => void;
  handleViewAlt: (viewAlt: AltDataNode) => void
}

const NodeGraph: React.FC<ICustomGraphProps> = ({ data, handleViewNode, handleViewAlt }) => {
  // const networks = useSelector(networkSelectors.getNetworks)
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();

  const [hoveredNode, setHoveredNode] = useState<IGraphHoverState>({
    hoverNode: undefined,
    hoverNeighbours: undefined
  });

  useEffect(() => {
    const graph = new Graph()
    const { nodeTypes, edges } = data

    for (let i = 0; i < nodeTypes.length; i++) {
        // Create all nodes
        try {
          graph.addNode(nodeTypes[i].id, {
            nodeType: "image",
            label: nodeTypes[i].name,
            // type: 'image',
            size: nodeTypes[i].type === 'cidr' || nodeTypes[i].type === 'extclient' ? 15 : 20,
            color: getColor(nodeTypes[i].type, nodeTypes[i].lastCheckin),
            url: './icons/up.png',
            labelColor: '#ffffff',
          })
        } catch (err) {
          // ignore repeats
        }
    }
    // Create All Edges
    for (let i = 0; i < edges.length; i++) {
      try {
        graph.addEdge(edges[i].from,edges[i].to, {
            weight: Math.floor(Math.random() * 100),
            type: "arrow",
            size: 5,
            label: "connection",
        })
      } catch (err) {
        // ignore repeats
      }
    }

    circular.assign(graph);
    const settings = forceAtlas2.inferSettings(graph);
    forceAtlas2.assign(graph, { settings, iterations: 600 });
    loadGraph(graph);
  }, [loadGraph, data]);

  useEffect(() => {
    // Register Sigma events
    registerEvents({
      enterNode: ({ node }) => {
        setHoveredNode({
          hoverNode: node,
          hoverNeighbours: data.edges
            .filter((edge) => edge.from === node || edge.to === node)
            .map((edge) => {
              const idToGet = edge.from === node ? edge.to : edge.from;
              return data.nodeTypes.find((x) => x.id === idToGet)?.id ?? "";
            })
        });
      },
      leaveNode: () => {
        setHoveredNode({
          hoverNode: undefined,
          hoverNeighbours: undefined
        });
      },
      clickNode: ({ node }) => { 
        const filtered = data.nodeTypes.filter(n => n.id === node)  
        if (filtered[0].type === 'cidr' || filtered[0].type === 'extclient') {
          handleViewAlt(filtered[0] as AltDataNode)
        } else {
          const filteredNode = data.nodes.filter(n => n.id === node)[0]
          handleViewNode(filteredNode)
        }
      }
    });
  }, [sigma, registerEvents, data, handleViewNode, handleViewAlt]);

  useEffect(() => {
    setSettings({
      nodeReducer: (node: string, data: { [key: string]: unknown }) => {
        const newData: Attributes = { ...data };
        if (
          hoveredNode.hoverNeighbours &&
          !hoveredNode.hoverNeighbours.includes(node) &&
          hoveredNode.hoverNode !== node
        ) {
          newData.label = "";
          newData.color = "#f6f6f6";
        }
        return newData;
      },
      edgeReducer: (edge: string, data: { [key: string]: unknown }) => {
        const graph = sigma.getGraph();
        const newData = { ...data, hidden: false };
        if (
          hoveredNode.hoverNode &&
          !graph.hasExtremity(edge, hoveredNode.hoverNode)
        ) {
          newData.hidden = true;
        }
        return newData;
      },
    });
  }, [sigma, setSettings, hoveredNode]);

  return null;
}

export default NodeGraph
