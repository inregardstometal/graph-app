import cytoscape from 'cytoscape';
import styled from '@emotion/styled';
import { usePrevious } from 'Utils';
import { ChangeEvent, useEffect, useState } from 'react'; 
import GraphGen from 'Graph/GraphGen';
import GraphLayout from 'Graph/GraphLayout';
import Vec2D from 'Utils/Vec2D';

interface Props {

}

const Graph = styled.div`
    width: 100%;
    height: calc(100% - 50px);
    border-radius: 10px;
    border: 2px solid white;
    overflow: hidden;
`;

const ButtonRow = styled.div`
    background: white;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    border: 2px solid white;
    overflow: hidden;
    display: flex;
    align-items: center;
`;

const HotBoibutton = styled.button`
    padding: 12px;
    background: white;
    color: slategray;
    font-weight: bolder;
    border: none;
    border-radius: 6px;
    box-shadow: 0px 0px 5px 1px rgba(127,127,127,0.5);
    margin: 0 10px;
    cursor: pointer;
`;

const HotBoiInput = styled.input`
    padding: 12px;
    background: #F0F0F4;
    color: slategray;
    font-weight: bolder;
    border: none;
    border-radius: 6px;
    box-shadow: 0px 0px 5px 1px rgba(127,127,127,0.5);
    margin: 0 10px;
`;

const HotBoiSelect = styled.select`
    padding: 12px;
    background: #F0F0F4;
    color: slategray;
    font-weight: bolder;
    border: none;
    border-radius: 6px;
    box-shadow: 0px 0px 5px 1px rgba(127,127,127,0.5);
    margin: 0 10px;
`;

const gridLayout: cytoscape.LayoutOptions = {
    name: 'grid',
    avoidOverlapPadding: 10
}

const coseLayout: cytoscape.LayoutOptions = {
    name: 'cose',
    animate: false
}

const presetLayout: cytoscape.LayoutOptions = {
    name: 'preset'
}

const circleLayout: cytoscape.LayoutOptions = {
    name: 'circle'
}

const stylesheet: cytoscape.Stylesheet[] = [
    {
        selector: 'node',
        style: {
          'background-color': '#ff04ea',
          'label': 'data(id)'
        }
    },
    {
        selector: 'node:selected',
        style: {
            'border-width': 5,
            'border-color': 'cyan'
        }
    },
    {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'haystack'
        }
      }
]

const GraphVisualizer = ({}: Props) => {
    const [cy, setCy] = useState<cytoscape.Core | null>(null);
    const [el, setEl] = useState<HTMLElement | null>(null);
    const [numNodes, setNumNodes] = useState<number>(10);
    const [edgeLength, setEdgeLength] = useState<number>(1);
    const [graphType, setGraphType] = useState<string>("weakSparse");

    useEffect(() => {
        setEl(document.getElementById('graph-target'));
    }, []);

    useEffect(() => {
        if (!cy && el) {
            let graph;

            switch (graphType) {
                case "weakSparse":
                    graph = GraphGen.weakSparse(numNodes);
                    break;

                case "dense":
                    graph = GraphGen.dense(numNodes);
                    break;
            
                case "dandelion":
                    graph = GraphGen.dandelion(numNodes, edgeLength);        
                    break;    
            
                case "wagonWheel":
                    graph = GraphGen.wagonWheel(numNodes, edgeLength);        
                    break;

                case "grid":
                default:
                    const width = Math.floor(Math.sqrt(numNodes));
                    const height = numNodes - width;
                    graph = GraphGen.grid(width, height);
                    break;
            }

            const layout = new GraphLayout(graph);

            const data = layout.adaptiveForceDirected().serialize();

            console.log(data);

            setCy(cytoscape({
                container: el,
                elements: data,
                style: stylesheet,
                layout: presetLayout
            }));
        }

        if (cy) {
            cy.fit();
        }
    }, [cy, el, edgeLength, graphType, numNodes]);

    const refreshClick = () => {
        setCy(null);
    }

    const numNodesChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const val = Number.parseInt(event.target.value);
        if (val !== numNodes) {
            setNumNodes(val);
            setCy(null);
        }
    }

    const edgeLengthChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const val = Number.parseInt(event.target.value);
        if (val !== edgeLength) {
            setEdgeLength(val);
            setCy(null);
        }
    }

    const graphTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        const val = event.target.value;
        if (val !== graphType){
            setGraphType(val);
            setCy(null);
        }
    }

    return (
        <>
            <ButtonRow>
                <HotBoibutton onClick={refreshClick}>refresh</HotBoibutton>
                <label htmlFor="graphType">graph type</label>
                <HotBoiSelect onChange={graphTypeChange} id="graphType">
                    <option value="weakSparse">weakSparse</option>
                    <option value="dense">dense</option>
                    <option value="grid">grid</option>
                    <option value="dandelion">dandelion</option>
                    <option value="wagonWheel">wagonWheel</option>
                </HotBoiSelect>
                <label htmlFor="numNodes"># nodes</label>
                <HotBoiInput placeholder="# of nodes" type="number" value={numNodes} onChange={numNodesChange} title="Number of nodes in this graph" id="numNodes"/>
                <label htmlFor="edgeLength">edge length</label>
                <HotBoiInput placeholder="edge length" type="number" value={edgeLength} onChange={edgeLengthChange} title="Initial edge length of the graph" id="edgeLength"/>
            </ButtonRow>
            <Graph id='graph-target'>

            </Graph>
        </>
    )
}

export default GraphVisualizer;