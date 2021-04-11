type TupleVec2D = [number, number];

export default class Vec2D {
    private _x: number;
    private _y: number;

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    /**
     * Creates a new 2 dimensional vector
     * @param vec tuple of numbers, where the first is x, and the second is y
     */
    constructor(vec?: TupleVec2D) {
        if (vec) {
            this._x = vec[0];
            this._y = vec[1];
        } else {
            this._x = 0;
            this._y = 0;
        }
    }

    /**
     * Set the value of this vector to the value of another vector
     * @param vec the reference vector
     */
    public set(vec: Vec2D): Vec2D {
        this._x = vec.x;
        this._y = vec.y;
        return this;
    }

    /**
     * Add another vector to this vector
     * @param vec the vector to be added
     */
    public add(vec: Vec2D): Vec2D {
        this._x += vec.x;
        this._y += vec.y;
        return this;
    }

    /**
     * Subtract a vector from this one
     * @param vec the vector to subtract from this one
     */
    public sub(vec: Vec2D): Vec2D {
        this._x -= vec.x;
        this._y -= vec.y;
        return this;
    }

    /**
     * Scale this vector by the number passed in
     * @param scalar scaling factor
     */
    public scale(scalar: number): Vec2D {
        this._x = this._x * scalar;
        this._y = this._y * scalar;
        return this;
    }

    /**
     * Get the magnitude of this vector
     * @returns the norm of this vector
     */
    public norm(): number {
        return Math.sqrt(this._y * this._y + this._x * this._x);
    }

    /**
     * Make this vector a unit vector in the same direction it was originally
     * @returns this vector
     */
    public normalize(): Vec2D {
        const norm = this.norm();
        this._x = this._x / norm;
        this._y = this._y / norm;
        return this;
    }

    /**
     * @returns a new vector that is opposite this vector 
     */
    public negate(): Vec2D {
        return new Vec2D([-this._x, -this._y])
    }

    /**
     * Get a unit vector version of any vector passed in (non-mutative)
     * @param vec vector to normalize
     * @returns a new normalized vector
     */
    public static unit(vec: Vec2D): Vec2D {
        const norm = vec.norm();
        return new Vec2D([vec.x / norm, vec.y / norm]);
    }

    /**
     * Project the first argument onto the second argument and returns the projection as a new vector
     * @param vec1 vector to be projected
     * @param vec2 projection target
     * @returns a new projected vector
     */
    public static proj(vec1: Vec2D, vec2: Vec2D): Vec2D {
        const unit2 = Vec2D.unit(vec2);
        const scalarProjection = Vec2D.dot(vec1, unit2);
        unit2.scale(scalarProjection);
        return unit2;
    }

    /**
     * Compute the distance between two vectors
     * @param vec1 first vector
     * @param vec2 second vector
     * @returns the distance between the two vectors
     */
    public static distance(vec1: Vec2D, vec2: Vec2D): number {
        return Math.sqrt(((vec1.x-vec2.x) * (vec1.x-vec2.x)) + (vec1.y-vec2.y) * (vec1.y-vec2.y));
    }

    /**
     * Compute the displacement vector between two vectors
     * @param vec1 the first vector
     * @param vec2 the second vector
     * @returns a new vector representing the displacement between the arguments
     */
    public static displacement(vec1: Vec2D, vec2: Vec2D): Vec2D {
        return new Vec2D([vec1.x - vec2.x, vec1.y - vec2.y]);
    }

    /**
     * Compute the inner product of two vectors
     * @param vec1 first vector
     * @param vec2 second vector
     * @returns the inner product of two vectors
     */
    public static dot(vec1: Vec2D, vec2: Vec2D): number {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }
}
