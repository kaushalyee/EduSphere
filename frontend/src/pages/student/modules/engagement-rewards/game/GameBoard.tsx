import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLevel, type Cell, type Pair } from './levels';

// Inline HudBar as it's missing from the specified directory
const HudBar: React.FC<{ 
    moves: number; 
    coverage: number; 
    onUndo: () => void; 
    onClear: () => void; 
}> = ({ moves, coverage, onUndo, onClear }) => (
    <div className="flex items-center justify-between mb-6 px-4 py-3 bg-[#111827] rounded-xl border border-white/5">
        <div className="flex gap-6">
            <div>
                <span className="text-gray-400 text-sm block">Moves</span>
                <span className="text-xl font-bold">{moves}</span>
            </div>
            <div>
                <span className="text-gray-400 text-sm block">Coverage</span>
                <span className="text-xl font-bold">{coverage}%</span>
            </div>
        </div>
        <div className="flex gap-3">
            <button onClick={onUndo} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors ring-1 ring-white/10">Undo</button>
            <button onClick={onClear} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm transition-colors border border-red-500/20">Clear</button>
        </div>
    </div>
);

const cellToKey = (r: number, c: number) => `${r},${c}`;
const keyToCell = (key: string): Cell => {
    const [r, c] = key.split(',').map(Number);
    return { r, c };
};

const isAdjacent = (cell1: string, cell2: string) => {
    const { r: r1, c: c1 } = keyToCell(cell1);
    const { r: r2, c: c2 } = keyToCell(cell2);
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
};

interface GameState {
    paths: Record<string, string[]>;
    moves: number;
}

const GameBoard: React.FC = () => {
    const { size, levelId } = useParams<{ size: string; levelId: string }>();
    const gridSize = parseInt(size || '5', 10);
    const level = useMemo(() => getLevel(gridSize, levelId), [gridSize, levelId]);

    const [paths, setPaths] = useState<Record<string, string[]>>({});
    const [moves, setMoves] = useState(0);
    const [activePairId, setActivePairId] = useState<string | null>(null);
    const [history, setHistory] = useState<GameState[]>([]);

    // Reset game state when level changes
    useEffect(() => {
        setPaths({});
        setMoves(0);
        setHistory([]);
    }, [level]);

    const dots = useMemo(() => {
        const map = new Map<string, { pair: Pair; type: 'start' | 'end' }>();
        if (!level) return map;
        level.pairs.forEach(p => {
            map.set(cellToKey(p.start.r, p.start.c), { pair: p, type: 'start' });
            map.set(cellToKey(p.end.r, p.end.c), { pair: p, type: 'end' });
        });
        return map;
    }, [level]);

    const occupied = useMemo(() => {
        const map: Record<string, string> = {};
        Object.entries(paths).forEach(([pairId, path]) => {
            path.forEach(key => {
                map[key] = pairId;
            });
        });
        return map;
    }, [paths]);

    const coverage = useMemo(() => {
        const filledCells = Object.keys(occupied).length;
        return Math.round((filledCells / (gridSize * gridSize)) * 100);
    }, [occupied, gridSize]);

    const completed = useMemo(() => {
        const set = new Set<string>();
        if (!level) return set;
        level.pairs.forEach(pair => {
            const path = paths[pair.pairId] || [];
            const startKey = cellToKey(pair.start.r, pair.start.c);
            const endKey = cellToKey(pair.end.r, pair.end.c);
            if (path.includes(startKey) && path.includes(endKey)) {
                set.add(pair.pairId);
            }
        });
        return set;
    }, [paths, level]);

    const isLevelComplete = level && completed.size === level.pairs.length && coverage === 100;

    const saveHistory = useCallback(() => {
        setHistory(prev => [...prev.slice(-19), { paths: { ...paths }, moves }]);
    }, [paths, moves]);

    const handlePointerDown = (key: string) => {
        if (isLevelComplete) return;
        const dot = dots.get(key);
        if (dot) {
            saveHistory();
            setActivePairId(dot.pair.pairId);
            setPaths(prev => ({
                ...prev,
                [dot.pair.pairId]: [key]
            }));
            setMoves(prev => prev + 1);
        } else if (occupied[key]) {
            const pairId = occupied[key];
            saveHistory();
            setActivePairId(pairId);
            setPaths(prev => {
                const path = prev[pairId] || [];
                const index = path.indexOf(key);
                return { ...prev, [pairId]: path.slice(0, index + 1) };
            });
            setMoves(prev => prev + 1);
        }
    };

    const handlePointerEnter = (key: string) => {
        if (!activePairId || isLevelComplete) return;

        const currentPath = paths[activePairId] || [];
        if (currentPath.length === 0) return;

        const lastKey = currentPath[currentPath.length - 1];
        if (lastKey === key) return;

        if (!isAdjacent(lastKey, key)) return;

        const targetDot = dots.get(key);
        if (targetDot && targetDot.pair.pairId !== activePairId) return;

        if (currentPath.includes(key)) {
            const index = currentPath.indexOf(key);
            setPaths(prev => ({
                ...prev,
                [activePairId]: currentPath.slice(0, index + 1)
            }));
            return;
        }

        // If target cell is occupied by another pair, block
        if (occupied[key] && occupied[key] !== activePairId) return;

        // If current path already connects both dots, block further expansion
        const pair = level?.pairs.find(p => p.pairId === activePairId);
        if (pair) {
            const startKey = cellToKey(pair.start.r, pair.start.c);
            const endKey = cellToKey(pair.end.r, pair.end.c);
            if (currentPath.includes(startKey) && currentPath.includes(endKey)) return;
        }

        setPaths(prev => ({
            ...prev,
            [activePairId]: [...currentPath, key]
        }));
    };

    const handlePointerUp = () => {
        setActivePairId(null);
    };

    const handleUndo = () => {
        if (history.length > 0) {
            const lastState = history[history.length - 1];
            setPaths(lastState.paths);
            setMoves(lastState.moves);
            setHistory(prev => prev.slice(0, -1));
        }
    };

    const handleClear = () => {
        setPaths({});
        setMoves(0);
        setHistory([]);
    };

    if (!level) {
        return (
            <div className="game-container">
                <div className="card">
                    <h1>Level Not Found</h1>
                    <p style={{ color: '#888', marginBottom: '1.5rem' }}>The requested level could not be found.</p>
                    <Link to={`/levels/${gridSize}`} className="btn btn-primary">Back to Puzzles</Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="game-container relative"
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Game Page</h1>
                <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Standalone Test Mode</p>
            </div>

            <Link to={`/student/game`} className="back-link mb-4 inline-block text-blue-400 hover:text-blue-300 transition-colors" id="back-to-levels">
                ← Back to {gridSize}x{gridSize} Puzzles
            </Link>

            <HudBar
                moves={moves}
                coverage={coverage}
                onUndo={handleUndo}
                onClear={handleClear}
            />

            {isLevelComplete && (
                <div className="win-banner">
                    ✅ Level Complete!
                </div>
            )}

            <div
                className="game-grid"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    width: 'min(90vw, 500px)',
                    height: 'min(90vw, 500px)',
                    touchAction: 'none'
                }}
            >
                {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                    const r = Math.floor(index / gridSize);
                    const c = index % gridSize;
                    const key = cellToKey(r, c);
                    const dot = dots.get(key);
                    const pairId = occupied[key];
                    const isPathCell = !!pairId;
                    const pair = isPathCell ? level.pairs.find(p => p.pairId === pairId) : undefined;

                    return (
                        <div
                            key={key}
                            className="grid-cell"
                            onPointerDown={() => handlePointerDown(key)}
                            onPointerEnter={() => handlePointerEnter(key)}
                            id={`cell-${key}`}
                            style={{
                                backgroundColor: isPathCell ? `${pair?.color}33` : undefined,
                            }}
                        >
                            {dot && (
                                <div
                                    className="cell-dot"
                                    style={{ backgroundColor: dot.pair.color }}
                                />
                            )}
                            {isPathCell && !dot && (
                                <div
                                    className="path-dot"
                                    style={{ backgroundColor: pair?.color }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
            .game-container {
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              padding: 2rem;
              background-color: #0a0e19;
              color: white;
              font-family: sans-serif;
            }
            .game-grid {
              display: grid;
              gap: 4px;
              background-color: #1a1f3c;
              padding: 12px;
              border-radius: 16px;
              box-shadow: 0 0 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(168,85,247,0.1);
              border: 1px solid rgba(255,255,255,0.05);
            }
            .grid-cell {
              position: relative;
              aspect-ratio: 1/1;
              background-color: #0f172a;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s;
              border: 1px solid rgba(255,255,255,0.03);
            }
            .grid-cell:hover {
              background-color: #1e293b;
              border-color: rgba(255,255,255,0.1);
            }
            .cell-dot {
              width: 70%;
              height: 70%;
              border-radius: 50%;
              box-shadow: 0 0 15px currentColor;
              z-index: 2;
            }
            .path-dot {
              width: 35%;
              height: 35%;
              border-radius: 50%;
              opacity: 0.8;
              box-shadow: 0 0 8px currentColor;
              z-index: 1;
            }
            .win-banner {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(16, 185, 129, 0.95);
              padding: 1.5rem 3rem;
              border-radius: 20px;
              font-size: 1.5rem;
              font-weight: 800;
              color: white;
              z-index: 100;
              box-shadow: 0 0 40px rgba(16, 185, 129, 0.4);
              backdrop-blur: 10px;
              animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            @keyframes bounceIn {
              0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
              100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
          `,
                }}
            />
        </div>
    );
};

export default GameBoard;
