import { Graph } from '../Graph';
import Vec2D from '../Utils/Vec2D';

interface FlatNode {
    r: Vec2D;
    v: Vec2D;
}

interface FlatEdge {
    source: string;
    target: string;
}

interface LayoutOptions {
    maxIterations?: number;
    springLength?: number;
}

export default class GraphLayout {

    private _nodes = new Map<string, FlatNode>();
    private _edges = new Map<string, FlatEdge>();
    private _graph: Graph;

    private readonly DEFAULT_MAX_ITERATIONS = 5;
    private readonly DEFAULT_SPRING_LENGTH = 800;

    constructor(graph: Graph){
        this._graph = graph;
        this.initializeInteralGraph();
        console.log(this._nodes);
    }

    public run(options?: LayoutOptions): Graph {
        const maxIterations = options?.maxIterations ?? this.DEFAULT_MAX_ITERATIONS;
        const springLength = options?.springLength ?? this.DEFAULT_SPRING_LENGTH;

        // // Main physics loop
        // for (let t=0; t<maxIterations; t++) {
        //     // Compute updates to velocity
        //     this.springForce(springLength);

        //     // Propagate new velocities to position
        //     this.updatePositions();
        // }

        this.writeToGraph();

        return this._graph;
    }

    private initializeInteralGraph(): void {
        this._graph.forNodes(node => {
            const x = node.position?.x ?? Math.random() * this.DEFAULT_SPRING_LENGTH;
            const y = node.position?.y ?? Math.random() * this.DEFAULT_SPRING_LENGTH;
            console.log([x, y]);
            const pos = new Vec2D([x, y])
            const zero = new Vec2D();
            console.log(pos, zero);
            const payload = {
                r: pos, 
                v: zero
            }
            console.log(payload);
            this._nodes.set(
                node.data.id, 
                payload
            );

            console.log(this._nodes.get(node.data.id));
        });

        this._graph.forEdges(edge => {
            this._edges.set(edge.data.id, {source: edge.data.source, target: edge.data.target})
        });
    }

    private centralizingForce(): void {
        //TODO
    }

    /**
     * Compute the force on each node due to its edges, and update the velocity appropriately
     * @param springLength the rest length of each spring
     */
    private springForce(springLength: number): void {
        try {
            this._edges.forEach((edge, key) => {
                const source = this._nodes.get(edge.source);
                const target = this._nodes.get(edge.target);

                if (!source || !target) {
                    throw new Error(`couldn't compute spring forces: edge ${key} was missing a source or target`);
                }

                const displacement = Vec2D.displacement(source.r, target.r);
                const distance = displacement.norm();
                const forceMagnitude = springLength - distance;
                const forceVec = displacement.normalize().scale(forceMagnitude);
                
                source.v.add(forceVec);
                target.v.add(forceVec.negate());
            });
        } catch (err) {
            console.error(err);
        }
    }

    private naiveElectricForce(): void {
        //TODO
    }

    private Barnes_HutElectricForce(): void {
        //TODO
    }

    /**
     * Update the positions of all nodes but summing in their velocity
     */
    private updatePositions(): void {
        try {
            this._nodes.forEach((node, key) => {
                node.r.add(node.v);
            }); 
        } catch (err) {
            console.error(err);
        }
    }

    private writeToGraph(): void {
        try {
            this._graph.forNodes(node => {
                const ref = this._nodes.get(node.data.id);

                if (!ref) {
                    throw new Error(`Couldn't write new positions to graph because node ${node.data.id} was ill defined`);
                }

                const positions = {x: ref.r.x, y: ref.r.y}
                node.position = positions;
            })
        } catch (err) {

        }
    }

    

}