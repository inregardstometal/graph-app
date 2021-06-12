import { Graph } from '../Graphs';

export abstract class GraphLayout {
    private graph: Graph;

    constructor(graph: Graph) {
        this.graph = graph;
    }

    public abstract compute(): Graph;
}
