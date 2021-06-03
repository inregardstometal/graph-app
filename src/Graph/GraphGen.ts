import Graph from './Graph';
interface GenerationOptions {

}

export default class GraphGen {
    
    /**
     * Creates a maximally sparse connected graph; i.e. a graph where each node has only one edge,
     * and there exists a path between any two nodes in the graph (connectedness not guaranteed)
     * @param size how many nodes the graph should have 
     * @param options optional properties of the graph
     * @returns {Graph} an instance of a graph class
     */
    public static weakSparse(size: number, options?: GenerationOptions): Graph {

        const graph = new Graph();

        try {
            // Create node up to size
            for (let i=0; i<size; i++) {
                const node = Graph.node(i.toString(), {x: Math.random() * 1000, y: Math.random() * 1000});
                graph.addNode(node);
            }
            
            // For each node, connect it to a random other node
            graph.forNodes(node => {
                let index = GraphGen.getRandomInt(size);
    
                while (index.toString() === node.data.id) {
                    index = GraphGen.getRandomInt(size);
                }
    
                const edge = Graph.edge(`${node.data.id}_${index}`, node.data.id, index.toString());

                graph.addEdge(edge);
            });
        } catch (err) {
            console.error(err);
        }

        return graph;
    }  

    public static dense(size: number, options?: GenerationOptions): Graph {
        const graph = new Graph();

        try {
            for (let i=0; i<size; i++) {
                const node = Graph.node(i.toString(), {x: Math.random() * 100, y: Math.random() * 100});
                graph.addNode(node);

                for(let j=0; j<size; j++) {
                    if (i !== j) {
                        const edge = Graph.edge(`${i}_${j}`, i.toString(), j.toString());
                        graph.addEdge(edge);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }

        return graph;
    }

    public static debug(): Graph {
        const graph = new Graph();
        try {
            const node1 = Graph.node('1', {x: 250, y: 250});
            const node2 = Graph.node('2', {x: -250, y: -250});
            graph.addNode(node1);
            graph.addNode(node2);

            const edge = Graph.edge('1_2', '1', '2');
            graph.addEdge(edge);
            
        } catch (err) {
            console.error(err);
        }
        return graph;
    }

    public static grid(width: number, height: number, options?: GenerationOptions): Graph {
        const graph = new Graph();

        const nodeName = (x: number, y: number) => `${x}_${y}`;
        const edgeName = (n1: string, n2: string) => `${n1}_${n2}`;

        try {
            // Generate the columns
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    // Construct a new node named after its starting position
                    const name = nodeName(i, j);
                    const node = Graph.node(name, {x: i, y: j});
                    graph.addNode(node);
                    
                    // Check left and up for existing nodes to connect to
                    const upNode = graph.hasNode(nodeName(i-1, j));
                    if (typeof upNode === 'object') {
                        const edge = Graph.edge(edgeName(node.data.id, upNode.data.id), node.data.id, upNode.data.id);
                        graph.addEdge(edge);
                    }
                    const leftNode = graph.hasNode(nodeName(i, j-1));
                    if (typeof leftNode === 'object') {
                        const edge = Graph.edge(edgeName(node.data.id, leftNode.data.id), node.data.id, leftNode.data.id);
                        graph.addEdge(edge);
                    }
                    console.log(`Added node`)
                }
            }
        }
        catch (err) {
            console.error(err);
        }

        return graph;
    }

    public static dandelion(nodes: number, edgeLength: number): Graph {
        const graph = new Graph();
        
        try {
            const nodeName = (x: number, y: number) => `${x.toPrecision(2)}_${y.toPrecision(2)}`;
            const edgeName = (n1: string, n2: string) => `${n1}_${n2}`;

            // Add the center node
            const centerNode = Graph.node(nodeName(0, 0));
            graph.addNode(centerNode);

            // We don't want to divide by zero later.
            if (nodes === 1) {
                return graph;
            }

            // Get the number of degrees between each of the petal nodes.
            // This will be 360 degrees divided by the number of nodes-1.
            const radsBetweenNodes = (2 * Math.PI) / (nodes - 1);
            for (let i = 1; i <= nodes; i++) {
                const x = edgeLength * Math.cos(radsBetweenNodes * i);
                const y = edgeLength * Math.sin(radsBetweenNodes * i);

                // Create a node and add it to the graph.
                const node = Graph.node(nodeName(x, y), {x, y});
                graph.addNode(node);

                // Create an edge and add it to the graph.
                const edge = Graph.edge(edgeName(centerNode.data.id, node.data.id), centerNode.data.id, node.data.id);
                graph.addEdge(edge);
            }
        }
        catch (err) {
            console.error(err);
        }

        return graph;
    }

    public static wagonWheel(nodes: number, edgeLength: number): Graph {
        const graph = new Graph();
        
        try {
            const nodeName = (x: number, y: number) => `${x.toPrecision(2)}_${y.toPrecision(2)}`;
            const edgeName = (n1: string, n2: string) => `${n1}_${n2}`;

            // Add the center node
            const centerNode = Graph.node(nodeName(0, 0));
            graph.addNode(centerNode);

            // We don't want to divide by zero later.
            if (nodes === 1) {
                return graph;
            }

            // Get the number of degrees between each of the petal nodes.
            // This will be 360 degrees divided by the number of nodes-1.
            const radsBetweenNodes = (2 * Math.PI) / (nodes - 1);
            let lastNode = null;
            for (let i = 1; i <= nodes; i++) {
                const x = edgeLength * Math.cos(radsBetweenNodes * i);
                const y = edgeLength * Math.sin(radsBetweenNodes * i);

                // Create a node and add it to the graph.
                const node = Graph.node(nodeName(x, y), {x, y});
                graph.addNode(node);

                // Create an edge and add it to the graph.
                const spokeEdge = Graph.edge(edgeName(centerNode.data.id, node.data.id), centerNode.data.id, node.data.id);
                graph.addEdge(spokeEdge);

                if (lastNode !== null) {
                    const wheelEdge = Graph.edge(edgeName(lastNode.data.id, node.data.id), lastNode.data.id, node.data.id);
                    graph.addEdge(wheelEdge);
                }
                lastNode = node;
            }
        }
        catch (err) {
            console.error(err);
        }

        return graph;
    }

    private static getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }
}
