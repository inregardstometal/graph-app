import { Graph } from "Graph";
import * as THREE from "three";
import * as d3zoom from "d3-zoom";
import * as d3sel from "d3-selection";
import { v4 } from "uuid";
import { FlatGraph } from "../Graph";

export class GraphRenderer {
    public readonly rendererId: string = v4();
    protected anchor: HTMLElement;

    protected _rendering: boolean = false;
    public get rendering() {
        return this._rendering;
    }

    get height() {
        return this.anchor.clientHeight;
    }
    get width() {
        return this.anchor.clientWidth;
    }

    protected renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
        alpha: true,
    });
    protected camera: THREE.PerspectiveCamera;
    protected scene: THREE.Scene = new THREE.Scene();

    protected info: HTMLElement | null = null;

    protected _resizeObserver: ResizeObserver;
    protected get resizeObserver(): ResizeObserver {
        return this._resizeObserver;
    }
    protected set resizeObserver(val: ResizeObserver) {
        this._resizeObserver.disconnect();
        this._resizeObserver = val;
        this.observeResize();
    }

    protected static readonly defaults = {
        fov: 40,
        nearPlane: 0.1,
        farPlane: 2000,
        panSens: 0.01,
        zoomSens: 0.1,
    };

    protected _fov = GraphRenderer.defaults.fov;
    get fov() {
        return this._fov;
    }
    set fov(val: number) {
        this._fov = val;
    }

    protected _graph: FlatGraph | null = null;
    public get graph() {
        return this._graph;
    }
    public set graph(val: FlatGraph | null) {
        this._graph = val;
    }

    constructor(anchor: HTMLElement) {
        this.anchor = anchor;
        this.camera = this.createCamera();
        this._resizeObserver = this.observeResize();
        this.listenForZoom();
        this.listenForPan();
        this.initializeRenderer();
    }

    public render(): void {
        this._rendering = true;
        console.log("rendering");
        if (!this.graph) throw new Error("Graph was null");
        this._render();
    }

    protected _render = (): void => {
        if (this._rendering) {
            this.renderNodes();

            requestAnimationFrame(this._render);
            const pos = this.camera.position;
            if (this.info) this.info.innerText = `Camera Position: (${pos.x.toFixed(4)}, ${pos.y.toFixed(4)}, ${pos.z.toFixed(4)})`;
            this.renderer.render(this.scene, this.camera);
        }
    };

    public listenForZoom(): void {
        this.renderer.domElement.addEventListener("wheel", (event) => {
            const pos = this.camera.position;
            this.camera.position.set(
                pos.x,
                pos.y,
                pos.z +
                    this.getZFromScale(event.deltaY) *
                        GraphRenderer.defaults.zoomSens
            );
        });
    }

    public listenForPan(): void {
        let shouldUpdate = false;
        const callback = (ev: MouseEvent) => {
            if (shouldUpdate) {
                const pos = this.camera.position;
                this.camera.position.set(
                    pos.x - GraphRenderer.defaults.panSens * ev.movementX,
                    pos.y + GraphRenderer.defaults.panSens * ev.movementY,
                    pos.z
                );
            }
        };

        this.renderer.domElement.addEventListener("mousemove", callback);

        this.renderer.domElement.addEventListener("mousedown", () => {
            shouldUpdate = true;
        });

        this.renderer.domElement.addEventListener("mouseup", () => {
            shouldUpdate = false;
        });
    }

    public stop(): void {
        this._rendering = false;
        console.log("stopping render");
    }

    protected renderNodes(): void {
        const geometry = new THREE.BufferGeometry();
        const vertices: THREE.Vector3[] = [];

        for (const node of this.graph!.nodeMap.values()) {
            const vert = new THREE.Vector3(node.r.x, node.r.y, 0);
            vertices.push(vert);
        }

        const array = GraphRenderer.vertsToArray(vertices);
        geometry.setAttribute("position", new THREE.BufferAttribute(array, 3));

        const material = new THREE.PointsMaterial({
            color: new THREE.Color(0xff0000),
        });

        const points = new THREE.Points(geometry, material);
        this.scene.background = new THREE.Color(0xefefef);
        this.scene.add(points);
    }

    protected static vertsToArray(verts: THREE.Vector3[]): Float32Array {
        const length = verts.length * 3;
        const array = new Float32Array(length);

        for (const [index, vert] of verts.entries()) {
            const arrayIdx = index * 3;
            array[arrayIdx] = vert.x;
            array[arrayIdx + 1] = vert.y;
            array[arrayIdx + 2] = vert.z;
        }

        return array;
    }

    protected renderEdges(): void {
        // TODO
    }

    protected observeResize(): ResizeObserver {
        const ob = new ResizeObserver((entries, observer) => {
            // assume only a single element is being observed
            const target = entries[0].target;
            const size = [target.clientWidth, target.clientHeight];
            this.renderer.setSize(size[0], size[1]);
            this.camera.position.set(0, 0, 1);
        });

        ob.observe(this.anchor);
        return ob;
    }

    protected createCamera(): THREE.PerspectiveCamera {
        return new THREE.PerspectiveCamera(
            this.fov,
            this.aspect(this.anchor),
            GraphRenderer.defaults.nearPlane,
            GraphRenderer.defaults.farPlane + 1
        );
    }

    protected initializeRenderer(): void {
        this.anchor.appendChild(this.renderer.domElement);
        const el = document.createElement("p");
        el.style.setProperty("position", "absolute");
        el.style.setProperty("top", "5px");
        el.style.setProperty("right", "5px");
        this.info = el;
        this.anchor.appendChild(el)
    }

    protected aspect(el: Element): number {
        return el.clientWidth / el.clientHeight;
    }

    protected getScaleFromZ(cameraZ: number): number {
        const halfFovRadians = GraphRenderer.radians(this.fov / 2);
        const fovHeight = Math.tan(halfFovRadians) * cameraZ * 2;
        return fovHeight / this.height;
    }

    protected getZFromScale(scale: number): number {
        const halfFovRadians = GraphRenderer.radians(this.fov / 2);
        return this.height / scale / (2 * Math.tan(halfFovRadians));
    }

    protected static radians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}
