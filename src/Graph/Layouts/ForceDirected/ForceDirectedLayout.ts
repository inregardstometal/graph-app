import { GraphLayout } from '../GraphLayout';
import { Graph } from '../../Graphs';

export abstract class ForceDirectedLayout extends GraphLayout {
    private static readonly ITERATION_FLOOR = 3;
    /**
     * The maximum number of iterations that this layout will run for
     */
    protected _maxIterations: number = 1000;
    get maxIterations(): number {
        return this._maxIterations;
    }

    set maxIterations(val: number) {
        this._maxIterations = val;
    }

    /**
     * The minimum number of iterations that this layout will run for
     */
    protected _minIterations: number = 3;
    get minIterations(): number {
        return this._minIterations;
    } 

    set minIterations(val: number) {
        if (val < ForceDirectedLayout.ITERATION_FLOOR) {
            throw new RangeError("Cannot set minIterations to less than " + ForceDirectedLayout.ITERATION_FLOOR);
        }
        this._minIterations = val;
    }
    /**
     * Advance the physics loop by one time unit.
     */
    public abstract step(): Graph;
} 
