import cytoscape from 'cytoscape';
import styled from '@emotion/styled';
import { usePrevious } from 'Utils';
import { useEffect, useState } from 'react'; 
import GraphGen from 'Graph/GraphGen';
import GraphLayout from 'Graph/GraphLayout';
import Vec2D from 'Utils/Vec2D';

interface Props {

}

const Graph = styled.div`
    width: 100%;
    height: 100%;
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

    useEffect(() => {
        setEl(document.getElementById('graph-target'));
    }, []);

    useEffect(() => {
        if (!cy && el) {
            const graph = GraphGen.dandelion(50, 500);
            // const graph = GraphGen.grid(1, 20);
            // const graph = GraphGen.dense(20);

            const layout = new GraphLayout(graph);

            // const data = graph.serialize();
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
    }, [cy, el])

    const refreshClick = () => {
        setCy(null);
    }
    
    return (
        <>
            <ButtonRow onClick={refreshClick}>
                <HotBoibutton>refresh</HotBoibutton>
            </ButtonRow>
            <Graph id='graph-target'>

            </Graph>
        </>
    )
}

export default GraphVisualizer;