import { ForceDirectedLayout } from './ForceDirectedLayout';
import { Graph } from '../../Graphs';

export class SpringLayout extends ForceDirectedLayout {

    constructor(graph: Graph) {
        super(graph);
    }

    public compute(): Graph {
        // TODO
        return new Graph();
    }

    private doSomething(): number {
        return this._minIterations;
    }

    public step(): Graph {
        // TODO
        return new Graph();
    }
}

