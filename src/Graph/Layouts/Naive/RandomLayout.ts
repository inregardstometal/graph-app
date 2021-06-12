import { GraphLayout } from '../GraphLayout';
import { Graph, FlatGraph } from '../../Graphs';
import { Vec2D } from 'Utils';

export class RandomLayout extends GraphLayout {

    constructor(graph: Graph) {
        super(graph);
    }

    public compute(): Graph {
        const size = Math.sqrt(this._graph.nodes.length);
        for(let node of this._graph.nodes) {
            const x = Math.random() * this._spacing  * size;
            const y = Math.random() * this._spacing * size;
            node.position = {
                x: x,
                y: y
            }
        }

        return this._graph;
    } 

    public computeFromFlatGraph(flatGraph: FlatGraph): FlatGraph {
        const size = Math.sqrt(flatGraph.nodeMap.size);
        for(let node of flatGraph.nodeMap.values()) {
            node.r = new Vec2D([
                Math.random() * this._spacing  * size, 
                Math.random() * this._spacing * size
            ]);
        }

        return flatGraph;
    }

}