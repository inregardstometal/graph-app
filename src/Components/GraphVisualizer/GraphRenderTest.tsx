import { useState, useEffect, useRef } from 'react';
import { GraphGen, FlatGraph } from 'Graph';
import { GraphRenderer } from 'Render';


export function GraphRenderTest(): JSX.Element {
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const [renderer, setRenderer] = useState<GraphRenderer | null>(null);

    useEffect(() => {
        try {
            const graph = GraphGen.grid(3, 3);
            const flatGraph = new FlatGraph(graph);
            if (anchorRef.current) {
                const renderer = new GraphRenderer(anchorRef.current);
                renderer.graph = flatGraph;
                renderer.render();
                setRenderer(renderer);
            }
        } catch (err) {
            console.error(err);
        }
    }, [])

    return (
        <div 
            style={{
                width: "100%",
                height: "100%",
                position: "relative"
            }}
            ref={anchorRef}
        > 
            <button
                style={{
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                    zIndex: 1000
                }}
                disabled={!renderer}
                onClick={() => renderer && (renderer.rendering ? renderer.stop() : renderer.render())}
            >
                Toggle Render
            </button>
        </div>
    )

}   