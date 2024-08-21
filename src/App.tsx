import styled from '@emotion/styled';
import GraphVisualizer from './Components/GraphVisualizer/GraphVisualizer'
import { GraphRenderTest } from 'Components/GraphVisualizer/GraphRenderTest';

const Body = styled.div`
    width: 100%;
    height: 100%;
    background-color: #2C365E;
    overflow: hidden;
    padding: 15px;
`;  

function App() {
    return(
        <Body>
            <GraphRenderTest />
        </Body>
    )
}

export default App;
