import Graph from './Graph';
import Vec2D from '../Utils/Vec2D';
import FlatGraph, { FlatNode, FlatEdge } from './FlatGraph';
export default class GraphLayout {

    private graph: FlatGraph;

    /* 
        ITERATION
    */
    private static readonly MAX_ITER: number = 1000;
    private static readonly MIN_ITER: number = 3;

    /* 
        FORCES
    */  
    // Equilibrium distance between two nodes
    private static readonly SPACING: number = 100;
    // Relative strength parameter (r vs a)
    private static readonly C: number = 1;
    // "Ideal spring length"
    private static readonly K: number = GraphLayout.SPACING / Math.cbrt(GraphLayout.C);
    // Precompute for the sake of efficiency
    private static readonly K_SQUARED: number = GraphLayout.K * GraphLayout.K;

    /* 
        COOLING
    */
    private static readonly INIT_STEP_SIZE: number = 1;
    private static readonly INIT_COOLING_FACTOR: number = 0.9;
    private static readonly MAX_COOLING_EXP: number = 5;

    /* 
        STALENESS
    */
    private static readonly MAX_STALE_ITER: number = GraphLayout.MAX_COOLING_EXP + 5;
    private static readonly STALE_THRESHOLD: number = 0.02;

    /* 
        LIMITING
    */
    private static readonly MIN_DIST: number = GraphLayout.SPACING / 10;

    /* 
        BARNES-HUT    
    */
    private static readonly TRANSITION: number = Number.MAX_VALUE;
    private static readonly THETA: 1.4;

    // Graph Energy
    private E = 0;
    // Last run's energy
    private E_0 = this.E;
    // Position update scaling factor
    private STEP_SIZE = GraphLayout.INIT_STEP_SIZE;
    private PROGRESS = 0;
    private STALE = 0;
    

    constructor(graph: Graph){
        this.graph = new FlatGraph(graph);
    }

    public adaptiveForceDirected(): Graph {
        const start = Date.now();

        // Main physics loop
        this.initGrid();

        for (let t = 0; t < GraphLayout.MAX_ITER; t++) {
            if (this.graph.nodeMap.size > GraphLayout.TRANSITION) {
                this.computeAllBHForces();
            } else {
                this.computeAllFRGForces();
            }
            this.adaptiveCool();
            // this.logEnergy(t);
            if (this.shouldEndLayout(t)) {
                break;
            }
            this.updateEnergy();
            this.updatePositions();
        }

        console.log("took " + (Date.now() - start) + " ms to run on graph of size " + this.graph.nodeMap.size);

        return this.graph.mapToGraph();
    }

    private initGrid(): void {
        const side = Math.ceil(Math.sqrt(this.graph.nodeMap.size));
        let i = 0;
        for(let node of this.graph.nodeMap.values()) {
            const x = (i % side) * GraphLayout.SPACING;
            const y = Math.floor(i / side) * GraphLayout.SPACING;
            node.r = new Vec2D([x, y]);
            i++;
        }
    }

    private initRandom(): void {
        const size = Math.sqrt(this.graph.nodeMap.size);
        for(let node of this.graph.nodeMap.values()) {
            node.r = new Vec2D([Math.random() * GraphLayout.SPACING  * size, Math.random() * GraphLayout.SPACING * size]);
        }
    }

    public grid(): Graph {
        this.initGrid();
        return this.graph.mapToGraph();
    }

    private logEnergy(iter: number): void {
        console.log("\n Iteration " + iter);
        console.log("Energy: " + this.E);
        console.log("ΔE: " + (this.E - this.E_0));
        console.log("Step Size: " + this.STEP_SIZE);
        console.log("Is stale: " + (this.STALE !== 0) + "\n");
    }

    /**
     * Compute forces using Fruchterman-Reingold approach 
     */
    private computeAllFRGForces(): void {
        for(let node of this.graph.nodeMap.values()) {
            let force = this.computeFRGElectricForce(node);
            force.add(this.computeSpringForce(node));
            this.sumEnergy(force);
            this.applyForce(node, force);
        }
    }   

    /**
     * Compute the FRG force on a single node
     * @param node 
     */
    private computeFRGElectricForce(node: FlatNode): Vec2D {
        let force = new Vec2D();
        for(let body of this.graph.nodeMap.values()) {
            if(node === body) {
                continue;
            }

            const disp = Vec2D.displacement(node.r, body.r);
            let len = disp.norm();

            if (len < GraphLayout.MIN_DIST) {
                len = GraphLayout.MIN_DIST;
            }

            disp.normalize();
            const scalar = ((GraphLayout.C * GraphLayout.K_SQUARED) / (len * len));
            force.add(disp.scale(scalar));
        }
        return force;
    }

    /**
     * Compute the spring force on a single node
     * @param node 
     */
    private computeSpringForce(node: FlatNode): Vec2D {
        const map = this.graph.adjacencyMap.get(node.id)!;
        let force = new Vec2D();

        if (!map) {
            return force;
        }

        for(let nodeRef of map) {
            const body = this.graph.nodeMap.get(nodeRef)!;

            const disp = Vec2D.displacement(node.r, body.r);
            let len = disp.norm();

            if (len < GraphLayout.MIN_DIST) {
                len = GraphLayout.MIN_DIST;
            }

            disp.normalize();
            const scalar = -len / GraphLayout.K;
            force.add(disp.scale(scalar));
        }
        return force;
    }

    /**
     * Compute forces using Barnes-Hut approach
     */
    private computeAllBHForces(): void {
        // TODO
    }

    /**
     * Sum in the energy contributed by a net force vector
     * @param {Vec2D} force net force applied to a node
     */
    private sumEnergy(force: Vec2D): void {
        const len = force.norm();
        this.E += len * len;
    }

    private updateEnergy(): void {
        this.E_0 = this.E;
        this.E = 0;
    }

    /**
     * Apply a given force to this node
     * @param {FlatNode} node node to which force will be applied
     * @param {Vec2D} force applied force
     */
    private applyForce(node: FlatNode, force: Vec2D): void {
        node.v.add(force);
    }

    /**
     * Adaptively change the step-size of the simulation
     */
    private adaptiveCool(): void {
        if (this.E < this.E_0) {
            this.PROGRESS++;
            if (this.PROGRESS >= GraphLayout.MAX_COOLING_EXP) {
                this.PROGRESS = 0;
                this.STEP_SIZE = this.STEP_SIZE / GraphLayout.INIT_COOLING_FACTOR;
            }
        } else {
            this.PROGRESS = 0;
            this.STEP_SIZE = this.STEP_SIZE * GraphLayout.INIT_COOLING_FACTOR;
        }
    }

    /**
     * Determine whether the layout has finished
     */
    private shouldEndLayout(iter: number): boolean {
        if (iter < GraphLayout.MIN_ITER || this.E === 0 || this.E_0 === 0) {
            return false;
        }

        const delta = Math.abs((this.E - this.E_0) / (this.E_0));

        if (delta < GraphLayout.STALE_THRESHOLD) {
            this.STALE++;
            if (this.STALE > GraphLayout.MAX_STALE_ITER) {
                return true;
            }
        } else {
            this.STALE = 0;
        }

        return false;
    }

    /**
     * Update the positions of all nodes but summing in their velocity
     */
    private updatePositions(): void {
        for(let node of this.graph.nodeMap.values()) {
            node.r.add(node.v.scale(this.STEP_SIZE));
        }
    }
}