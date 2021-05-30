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
            const layout = new GraphLayout(GraphGen.weakSparse(20));
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

    return (
        <Graph id='graph-target'>

        </Graph>
    )
}

export default GraphVisualizer;