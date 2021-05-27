import Graph from './Graph';
import Vec2D from '../Utils/Vec2D';
export default class GraphLayout {

    private _nodes = new Map<string, FlatNode>();
    private _edges = new Map<string, FlatEdge>();
    private _graph: Graph;

    /* 
        ITERATION
    */
    private static readonly MAX_ITER: number = 100;
    private static readonly MIN_ITER: number = 3;

    /* 
        FORCES
    */  
    // Equilibrium distance between two nodes
    private static readonly SPACING: number = 100;
    // Relative strength parameter (r vs a)
    private static readonly C: number = 0.75;
    // "Ideal spring length"
    private static readonly K: number = GraphLayout.SPACING / Math.cbrt(GraphLayout.C);
    // Precompute for the sake of efficiency
    private static readonly K_SQUARED: number = GraphLayout.K * GraphLayout.K;

    /* 
        COOLING
    */
    private static readonly INIT_COOLING_FACTOR: number = 0.85;
    private static readonly MAX_COOLING_EPOCHS: number = 5;

    /* 
        STALENESS
    */
    private static readonly MAX_STALE_ITER: number = GraphLayout.MAX_COOLING_EPOCHS + 2;
    private static readonly STALE_THRESHOLD: number = 0.02;

    /* 
        LIMITING
    */
    private static readonly MIN_DIST: number = GraphLayout.SPACING / 10;

    private static readonly TRANSITION: number = 80;

    // Graph Energy
    private E = 0;
    // Last run's energy
    private E_0 = this.E;
    // Position update scaling factor
    private STEP_SIZE = GraphLayout.INIT_COOLING_FACTOR;
    

    constructor(graph: Graph){
        this._graph = graph;
        this.initializeInteralGraph();
    }

    public run(): Graph {
        // Main physics loop
        for (let t = 0; t < GraphLayout.MAX_ITER; t++) {
            if (this._nodes.size > GraphLayout.TRANSITION) {
                this.computeAllBHForces();
            } else {
                this.computeAllFRGForces();
            }

            if (this.shouldEndLayout()) {
                break;
            }
            this.updatePositions();
        }
        console.log(this._nodes);

        this.writeToGraph();

        return this._graph;
    }

    private initializeInteralGraph(): void {
        
    }

    private computeAllFRGForces(): void {

    }

    private computeAllBHForces(): void {
        for(let node of this._nodes.values()) {
            //Compute repulsive forces with quadtree

            //Compute attractive forces
        }
    }

    private adaptiveCool(): void {

    }

    private shouldEndLayout(): boolean {
        // TODO
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