import styled from "@emotion/styled";
import { useState, useRef, useEffect } from "react";
export interface Point {
    x: number;
    y: number;
}
export interface DrawStyle {
    strokeStyle: string;
    lineWidth: number;
}
export const DrawingPane = () => {
    const DrawingCanvas = styled.canvas`
        color: turquoise;
        width: 100%;
        height: 85%;
        background: white;
    `;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrwaing] = useState(false);
    const [clientBoundBox, setClientBoundBox] = useState<DOMRect | undefined>(
        undefined
    );
    const [prevPoint, setPrevPoint] = useState<Point | undefined>(undefined);
    const [curPoint, setCurPoint] = useState<Point | undefined>(undefined);

    function draw(
        context: CanvasRenderingContext2D,
        startPoint: Point,
        endPoint: Point,
        drawStyle: DrawStyle
    ) {
        const startX = startPoint.x;
        const startY = startPoint.y;
        const endX = endPoint.x;
        const endY = endPoint.y;

        const { strokeStyle = "black", lineWidth = 1 } = drawStyle;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = strokeStyle;
        context.lineWidth = 10;
        context.stroke();
        context.closePath();
    }

    function getOffseetPoint(clientPoint: Point) {
        if (clientBoundBox)
            return {
                x: clientPoint.x - clientBoundBox.left,
                y: clientPoint.y - clientBoundBox.top,
            };
    }

    const mouseDown = (e: any) => {
        setIsDrwaing(true);
        const offsetPoint = getOffseetPoint({ x: e.clientX, y: e.clientY });
        setPrevPoint(offsetPoint);
    };

    const mouseMove = (e: any) => {
        // if (!isDrawing) return;
        const offsetPoint = getOffseetPoint({ x: e.clientX, y: e.clientY });
        setCurPoint(offsetPoint);
        const context = canvasRef.current?.getContext("2d");
        if (context && prevPoint && curPoint) {
            console.log("draw!!!", prevPoint, curPoint);

            draw(context, prevPoint, curPoint, {
                strokeStyle: "red",
                lineWidth: 2,
            });
        }
        setPrevPoint(offsetPoint);
    };
    const mouseUp = (e: any) => {
        setIsDrwaing(false);
    };

    useEffect(() => {
        const box = canvasRef.current?.getBoundingClientRect();
        if (box) setClientBoundBox(box);
    }, []);

    return (
        <DrawingCanvas
            ref={canvasRef}
            onMouseUp={mouseUp}
            onMouseDown={mouseDown}
            onMouseMove={mouseMove}
        />
    );
};
