import { GraphLayout } from '../GraphLayout';
import { Graph, FlatGraph } from '../../Graphs';
import { Vec2D } from 'Utils';

export class GridLayout extends GraphLayout {

    constructor(graph: Graph) {
        super(graph);
    }

    public compute(): Graph {
        const side = Math.ceil(Math.sqrt(this._graph.nodes.length));
        let i = 0;
        for(let node of this._graph.nodes) {
            const x = (i % side) * this._spacing;
            const y = Math.floor(i / side) * this._spacing;
            node.position = {
                x: x,
                y: y
            }
            i++;
        }

        return this._graph;
    } 

    public computeFromFlatGraph(flatGraph: FlatGraph): FlatGraph {
        const side = Math.ceil(Math.sqrt(flatGraph.nodeMap.size));
        let i = 0;
        for(let node of flatGraph.nodeMap.values()) {
            const x = (i % side) * this._spacing;
            const y = Math.floor(i / side) * this._spacing;
            node.r = new Vec2D([x, y]);
            i++;
        }

        return flatGraph;
    }

}