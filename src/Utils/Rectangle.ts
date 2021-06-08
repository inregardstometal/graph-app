
/**
 * VERY OOP
 */
export class Rectangle {
    private _minX: number;
    get minX(): number {
        return this._minX;
    }
    set minX(val: number) {
        if (val > this._maxX) {
            throw new RangeError('minX too large');
        }
        this._minX = val;
    }

    private _maxX: number;
    get maxX(): number {
        return this._maxX;
    }
    set maxX(val: number) {
        if (val < this._minX) {
            throw new RangeError('maxX too small');
        }
        this._maxX = val;
    }

    private _minY: number;
    get minY(): number {
        return this._minY;
    }
    set minY(val: number) {
        if (val > this._maxY) {
            throw new RangeError('minY too large');
        }
        this._minY = val;
    }

    private _maxY: number;
    get maxY(): number {
        return this._maxY;
    }
    set maxY(val: number) {
        if (val < this._minY) {
            throw new RangeError('maxY too small');
        }
        this._maxY = val;
    }

    constructor(
        x: [number, number], 
        y: [number, number]
    ) {
        this._minX = x[0];
        this._maxX = x[1];
        this._minY = y[0];
        this._maxY = y[1];
    }

    public static clone(rect: Rectangle): Rectangle { 
        return new Rectangle(rect.getXs(), rect.getYs());
    }

    public getXs(): [number, number] {
        return [this._minX, this._maxX];
    }

    public getYs(): [number, number] {
        return [this._minY, this._maxY];
    }

    public getWidth(): number {
        return this._maxX - this.minX;
    }

    public getHeight(): number {
        return this._maxY - this.minY;
    }

    public squarify(): void {
        let diff = this.getWidth() - this.getHeight();

        if (diff === 0) {
            return;
        } 
        
        let halfDiff = diff / 2;

        if (diff > 0) {
            this._minY = this._minY - halfDiff; 
            this._maxY = this._maxY + halfDiff;
        } else {
            halfDiff = -halfDiff;
            this._minX = this._minX - halfDiff;
            this._maxX = this._maxX + halfDiff;
        }
    }

    public isSquare(): boolean {
        if (this.getHeight() === this.getWidth()) {
            return true;
        } else {
            return false;
        }
    }
}