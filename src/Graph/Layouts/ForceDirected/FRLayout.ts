import { ForceDirectedLayout } from './ForceDirectedLayout';
import { Graph, FlatGraph, FlatNode } from '../../Graphs';

export class FRLayout extends ForceDirectedLayout {

    protected flatGraph: FlatGraph;

    /* 
        FORCES
    */
    /**
     * Parameter governing relative strength of attractive and repulsive force. 
     * Increasing this parameter makes repulsive force stronger
     */
    protected _C: number = 1;
    /**
     * 
     */
    get C() {
        return this._C;
    }
    set C(val: number) {
        if (val <= 0) {
            throw new RangeError("C must be greater than 0");
        }
        this._C = val;
        this._K = this.produceK();
        this._K_squared = this._K * this._K;
    }

    // override set spacing(val: number) {
    //     this._spacing = val;
    //     this._K = this.produceK();
    //     this._K_squared = this._K * this._K;
    // }

    protected _K: number = this.produceK();
    protected produceK(): number {
        return this._spacing / Math.cbrt(this._C);
    }
    protected _K_squared: number = this._K * this._K;

    /* 
        COOLING
    */
    protected _initStepSize: number = 1;
    get initStepSize() {
        return this._initStepSize;
    }
    set initStepSize(val: number) {
        if (val <= 0) {
            throw new RangeError('initStepSize must be greater than 0');
        }
    }

    protected _coolingFactor: number = 0.9;
    get coolingFactor() {
        return this._coolingFactor;
    }
    set coolingFactor(val: number) {
        if (val > 1 || val < 0) {
            throw new RangeError('coolingFactor must be between 0 and 1');
        }
    }

    protected _maxCoolingExponent: number = 5;
    get maxCoolingExponent() {
        return this._maxCoolingExponent;
    }
    set maxCoolingExponent(val: number) {
        if (val <= 0) {
            throw new RangeError('maxCoolingExponent must be greater than 0');
        }
        this._maxCoolingExponent = val;
    }

    /* 
        STALENESS
    */
    protected _maxStaleIterations: number = this._maxCoolingExponent + 5;
    get maxStaleIterations() {
        return this._maxStaleIterations;
    }
    set maxStaleIterations(val: number) {
        if (val <= 0) {
            throw new RangeError('maxStaleIterations must be greater than 0');
        }
        this._maxStaleIterations = val;
    }

    protected _staleThreshold: number = 0.02;
    get staleThreshold() {
        return this._staleThreshold;
    }
    set staleThreshold(val: number) {
        if (val <= 0) {
            throw new RangeError('staleThreshold must be greater than 0');
        }
        this._staleThreshold = val;
    }

    /* 
        LIMITING
    */
    protected _minDist: number = this._spacing / 40;
    get minDist() {
        return this._minDist;
    }
    set minDist(val: number) {
        if (val < 0) {
            throw new RangeError('minDist cannot be less than 0');
        }
        this._minDist = val;
    }


    protected _energy = 0;
    protected _energy_0 = this._energy;
    protected _step_size = this._initStepSize;
    protected _progress = 0;
    protected _stale = 0;
    

    constructor(graph: Graph) {
        super(graph);
        this.flatGraph = new FlatGraph(graph);
    }

    public compute(): Graph {
        // TODO
        return new Graph();
    }

    protected doSomething(): number {
        return this._minIterations;
    }

    public step(): Graph {
        // TODO
        return new Graph();
    }
}

