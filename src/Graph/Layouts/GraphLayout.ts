import { Graph } from '../Graphs';

export abstract class GraphLayout {
    protected _graph: Graph;

    /**
     * Quantity determining the space between nodes in the final layout
     */
    protected _spacing: number = 100;
    get spacing() {
        return this._spacing;
    }
    set spacing(val: number) {
        this._spacing = val;
    }

    constructor(graph: Graph) {
        this._graph = graph;
    }

    public abstract compute(): Graph;
}
