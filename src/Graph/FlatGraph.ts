import Vec2D from '../Utils/Vec2D';
import Graph, { SerialGraph } from './Graph';

export class FlatNode {
    public id: string;
    public r: Vec2D = new Vec2D();
    public v: Vec2D = new Vec2D();

    constructor(id: string) {
        this.id = id;
    }
}

export class FlatEdge {
    public id: string;
    public source: string;
    public target: string;

    constructor(id: string, source: string, target: string) {
        this.id = id;
        this.source = source;
        this.target = target;
    }
}

export default class FlatGraph {
    // Stores node information
    private nodeMap: Map<FlatNode['id'], FlatNode> = new Map<FlatNode['id'], FlatNode>();
    // Stores edge information in a way that preserves direction (for reconstruction only)
    private edgeMap: Map<FlatEdge['id'], FlatEdge> = new Map<FlatEdge['id'], FlatEdge>();
    // Stores edge information in a way that is easy to iterate through when iterating through nodes
    private adjacencyMap: Map<FlatNode['id'], FlatNode['id'][]> = new Map<FlatNode['id'], FlatNode['id'][]>();

    constructor(graph: Graph) {
        this.buildNodeMap(graph);
        this.buildEdgeMap(graph);
        this.buildAdjacencyMap(graph);
    }

    private buildNodeMap(graph: Graph): void {
        for(let node of graph.nodes) {
            this.nodeMap.set(node.data.id, new FlatNode(node.data.id));
        }
    }  

    private buildEdgeMap(graph: Graph): void {
        for(let edge of graph.edges) {
            this.edgeMap.set(edge.data.id, new FlatEdge(edge.data.id, edge.data.source, edge.data.target));
        }
    }

    private buildAdjacencyMap(graph: Graph): void {
        for(let edge of graph.edges) {
            if (this.adjacencyMap.has(edge.data.source)) {
                this.adjacencyMap.get(edge.data.source)?.push(edge.data.target);
            } else {
                this.adjacencyMap.set(edge.data.source, [edge.data.target]);
            }

            if (this.adjacencyMap.has(edge.data.target)) {
                this.adjacencyMap.get(edge.data.target)?.push(edge.data.source);
            } else {
                this.adjacencyMap.set(edge.data.target, [edge.data.source]);
            }
        }
    }

    public mapToGraph(): Graph {
        const serialGraph: SerialGraph = {
            nodes: [],
            edges: [],
        }

        for(let node of this.nodeMap.values()) {
            serialGraph.nodes.push(Graph.node(node.id, {x: node.r.x, y: node.r.y}));
        }

        for (let edge of this.edgeMap.values()) {
            serialGraph.edges.push(Graph.edge(edge.id, edge.source, edge.target));
        }

        return new Graph(serialGraph);
    }
}