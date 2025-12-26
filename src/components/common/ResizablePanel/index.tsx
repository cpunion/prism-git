import { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import './index.css';

interface ResizablePanelProps {
    /** Direction of the split */
    direction: 'horizontal' | 'vertical';
    /** Initial size of the first panel (px or %) */
    initialSize?: number;
    /** Minimum size of the first panel (px) */
    minSize?: number;
    /** Maximum size of the first panel (px) */
    maxSize?: number;
    /** First panel content */
    first: ReactNode;
    /** Second panel content */
    second: ReactNode;
    /** Storage key for persisting size */
    storageKey?: string;
    /** Callback when size changes */
    onSizeChange?: (size: number) => void;
    /** Class name for the container */
    className?: string;
}

export function ResizablePanel({
    direction,
    initialSize = 250,
    minSize = 100,
    maxSize = 800,
    first,
    second,
    storageKey,
    onSizeChange,
    className = '',
}: ResizablePanelProps) {
    // Load persisted size or use initial
    const getInitialSize = () => {
        if (storageKey) {
            const saved = localStorage.getItem(`panel-size-${storageKey}`);
            if (saved) {
                const parsed = parseInt(saved, 10);
                if (!isNaN(parsed)) return parsed;
            }
        }
        return initialSize;
    };

    const [size, setSize] = useState(getInitialSize);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const startPosRef = useRef(0);
    const startSizeRef = useRef(0);

    // Persist size changes
    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(`panel-size-${storageKey}`, size.toString());
        }
        onSizeChange?.(size);
    }, [size, storageKey, onSizeChange]);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            setIsDragging(true);
            startPosRef.current = direction === 'horizontal' ? e.clientX : e.clientY;
            startSizeRef.current = size;
        },
        [direction, size]
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging) return;

            const delta =
                direction === 'horizontal'
                    ? e.clientX - startPosRef.current
                    : e.clientY - startPosRef.current;

            let newSize = startSizeRef.current + delta;
            newSize = Math.max(minSize, Math.min(maxSize, newSize));
            setSize(newSize);
        },
        [isDragging, direction, minSize, maxSize]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Add/remove global mouse listeners
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp, direction]);

    const isHorizontal = direction === 'horizontal';

    return (
        <div
            ref={containerRef}
            className={`resizable-panel ${isHorizontal ? 'resizable-panel--horizontal' : 'resizable-panel--vertical'} ${className}`}
        >
            <div
                className="resizable-panel__first"
                style={isHorizontal ? { width: size } : { height: size }}
            >
                {first}
            </div>
            <div
                className={`resizable-panel__divider ${isDragging ? 'resizable-panel__divider--dragging' : ''}`}
                onMouseDown={handleMouseDown}
            />
            <div className="resizable-panel__second">{second}</div>
        </div>
    );
}
