interface Node {
    data: {
        id: string;
    };
    position?: {
        x: number;
        y: number;
    };
}

interface Edge {
    data: {
        id: string;
        source: string;
        target: string;
    };
}

export interface SerialGraph {
    nodes: Node[];
    edges: Edge[];
}

export default class Graph {
    public nodes: Node[];
    public edges: Edge[];

    constructor(graph?: SerialGraph){
        this.nodes = graph?.nodes ?? [];
        this.edges = graph?.edges ?? [];
    }

    /**
     * Check that all edges in the graph are well defined
     * @returns {boolean} indicating whether the graph is valid or not
     */
    public isValid(): boolean {
        try {
            if (this.edges.length === 0) {
                return true;
            }

            for (let edge of this.edges) {
                const sourceIndex = this.nodes.findIndex(
                    (node) => node.data.id === edge.data.source
                );
                if (sourceIndex === -1) {
                    throw new Error(
                        `source of edge: ${edge.data.id} was not in the graph`
                    );
                }
                const targetIndex = this.nodes.findIndex(
                    (node) => node.data.id === edge.data.target
                );
                if (sourceIndex === -1) {
                    throw new Error(
                        `target of edge: ${edge.data.id} was not in the graph`
                    );
                }
            }

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * Add a new node to the graph
     * @param node the node to be added
     */
    public addNode(node: Node): void {
        this.nodes.push(node);
    }

    /**
     * Add a ner edge to the graph
     * @param edge the edge to be added
     */
    public addEdge(edge: Edge): void {
        this.edges.push(edge);
    }

    /**
     * Serialize this class instance to a javascript object
     * @returns {SerialGraph} this serialized using JSON.parse and JSON.stringify
     */
    public serialize(): SerialGraph {
        const graph = {
            nodes: JSON.parse(JSON.stringify(this.nodes)) as Node[],
            edges: JSON.parse(JSON.stringify(this.edges)) as Edge[],
        };

        return graph;
    }

    /**
     * Iterate over the nodes of this graph
     * @param fn callback invoked per node
     */
    public forNodes(fn: (node: Node) => void): void {
        for (let node of this.nodes) {
            fn(node);
        }
    }

    /**
     * Iterate over the edges of this graph
     * @param fn callback invoked per edge
     */
    public forEdges(fn: (edge: Edge) => void): void {
        for (let edge of this.edges) {
            fn(edge);
        }
    }

    /**
     * Static method for creating a new node
     * @param id the id of the new node
     * @param position optional position
     * @returns {Node} a node object
     */
    public static node(id: string, position?: Node['position']): Node {
        return {
            data: {
                id: id
            },
            position: position
        }
    }

    /**
     * Static method for creation a new edge
     * @param id the id of the new edge
     * @param source id of source node
     * @param target id of target node
     * @returns {Edge} an edge object
     */
    public static edge(id: string, source: string, target: string): Edge {
        return {
            data: {
                id: id,
                source: source,
                target: target
            }
        }
    }
}  