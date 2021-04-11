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
    springConstant?: number;
}

export default class GraphLayout {

    private _nodes = new Map<string, FlatNode>();
    private _edges = new Map<string, FlatEdge>();
    private _graph: Graph;

    private readonly DEFAULT_MAX_ITERATIONS = 15;
    private readonly DEFAULT_SPRING_CONSTANT = 0.25;
    private readonly DEFAULT_SPRING_LENGTH = 400;
    private readonly DEFAULT_DAMPING_COEFFICIENT = 0.25;

    constructor(graph: Graph){
        this._graph = graph;
        this.initializeInteralGraph();
    }

    public run(options?: LayoutOptions): Graph {
        const maxIterations = options?.maxIterations ?? this.DEFAULT_MAX_ITERATIONS;
        const springLength = options?.springLength ?? this.DEFAULT_SPRING_LENGTH;
        const springConstant = options?.springConstant ?? this.DEFAULT_SPRING_CONSTANT;

        // Main physics loop
        for (let t=0; t<maxIterations; t++) {

            // Compute updates to velocity
            this.springForce(springLength, springConstant);
            
            this.damping();

            // Propagate new velocities to position
            this.updatePositions();

        }
        console.log(this._nodes);

        this.writeToGraph();

        return this._graph;
    }

    private initializeInteralGraph(): void {
        this._graph.forNodes(node => {
            const x = node.position?.x ?? Math.random() * this.DEFAULT_SPRING_LENGTH;
            const y = node.position?.y ?? Math.random() * this.DEFAULT_SPRING_LENGTH;
            const payload = {
                r: new Vec2D([x, y]), 
                v: new Vec2D()
            }
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
    private springForce(springLength: number, springConstant: number): void {
        try {
            this._edges.forEach((edge, key) => {
                const source = this._nodes.get(edge.source);
                const target = this._nodes.get(edge.target);

                if (!source || !target) {
                    throw new Error(`couldn't compute spring forces: edge ${key} was missing a source or target`);
                }

                //Vector pointing from source to target
                const displacement = Vec2D.displacement(source.r, target.r);
                //Distance between source and target
                const distance = displacement.norm();
                //Compare distance to ideal distance
                const forceScale = springLength - distance;
                //Compute force
                const forceVec = displacement.normalize().scale(springConstant * forceScale);
                
                source.v.add(forceVec);
                target.v.add(forceVec.negate());
            });
        } catch (err) {
            console.error(err);
        }
    }

    private damping(): void {
        try {
            this._nodes.forEach(node => {
                const drag = node.v.negate().scale(this.DEFAULT_DAMPING_COEFFICIENT);
                node.v.add(drag);
            });
        } catch (err) {

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