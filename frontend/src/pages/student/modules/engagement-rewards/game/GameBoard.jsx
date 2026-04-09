import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '@/api/api';
import puzzles from '@/data/puzzles';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import axios from 'axios';

/**
 * Helper to convert "M:SS" string to total seconds.
 */
function convertTimeToSeconds(timeStr) {
    if (!timeStr || !timeStr.includes(':')) return 0;
    const [min, sec] = timeStr.split(":").map(Number);
    return min * 60 + (sec || 0);
}


const HudBar = ({ time, coverage, onUndo, onClear }) => {
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
    <div className="flex items-center justify-between mb-6 px-5 py-4 bg-white rounded-xl border border-gray-100 shadow-sm w-full" style={{ maxWidth: 'min(90vw, 500px)' }}>
        <div className="flex gap-8">
            <div>
                <span className="text-gray-500 text-sm block font-medium">Time</span>
                <span className="text-2xl font-bold text-gray-900">{formatTime(time)}</span>
            </div>
            <div>
                <span className="text-gray-500 text-sm block font-medium">Coverage</span>
                <span className="text-2xl font-bold text-gray-900">{coverage}%</span>
            </div>
        </div>
        <div className="flex gap-3">
            <button onClick={onUndo} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm transition-colors border border-gray-200 font-semibold shadow-sm">Undo</button>
            <button onClick={onClear} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm transition-colors border border-red-200 font-semibold shadow-sm">Clear</button>
        </div>
    </div>
    );
};

const ResultScreen = ({ finalTime, gpEarned, onBackToGame, isSubmitting }) => {
    if (finalTime == null) return null;

    const minutes = Math.floor(finalTime / 60);
    const seconds = finalTime % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="max-w-sm w-full rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100 bounce-in">
                <div className="bg-gradient-to-br from-orange-500 via-amber-400 to-pink-500 px-8 py-7 text-center text-white">
                    <h2 className="text-2xl font-extrabold mb-1">🎉 You&apos;re crushing it!</h2>
                    <p className="text-sm opacity-90 font-medium">FlowFree Challenge Completed</p>
                </div>
                <div className="bg-white px-8 py-8 text-center">
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">
                                Final Time
                            </p>
                            <p className="text-4xl font-black text-gray-900">
                                {formattedTime}
                            </p>
                        </div>

                        <div className="py-4 border-y border-gray-50">
                            <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">
                                GP Earned
                            </p>
                            {isSubmitting ? (
                                <div className="flex items-center justify-center space-x-2 text-blue-600">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            ) : (
                                <p className="text-4xl font-black text-blue-600">
                                    {gpEarned !== null ? `${gpEarned} GP` : "---"}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onBackToGame}
                        disabled={isSubmitting}
                        className={`mt-8 w-full inline-flex items-center justify-center px-8 py-4 rounded-2xl text-white text-base font-bold shadow-lg transition-all ${
                            isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-95'
                        }`}
                    >
                        {isSubmitting ? 'Calculating GP...' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const cellToKey = (r, c) => `${r},${c}`;
const keyToCell = (key) => {
    const [r, c] = key.split(',').map(Number);
    return { r, c };
};

const isAdjacent = (cell1, cell2) => {
    const { r: r1, c: c1 } = keyToCell(cell1);
    const { r: r2, c: c2 } = keyToCell(cell2);
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
};

const COLOR_MAP = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#facc15',
    cyan: '#06b6d4',
    purple: '#a855f7',
    pink: '#e879f9',
    orange: '#f97316',
    white: '#f8fafc',
    peach: '#fdba74',
    teal: '#0f766e',
    beige: '#d6c7a1',
    lime: '#84cc16',
};

const buildPlayerGrid = (gridSize, occupied) => {
    const playerGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    Object.entries(occupied).forEach(([key, pairId]) => {
        const { r, c } = keyToCell(key);
        playerGrid[r][c] = pairId;
    });
    return playerGrid;
};

const areAllCellsFilled = (playerGrid) =>
    playerGrid.every((row) => row.every((cell) => cell !== null));

const GRID_SIZE = 5;

const GameBoard = () => {
    const navigate = useNavigate();
    const { attempt } = useParams();
    const level = useMemo(() => {
        const selected = puzzles[String(attempt)];
        if (!selected) return null;

        return {
            id: Number(attempt),
            size: GRID_SIZE,
            pairs: selected.pairs.map((pair) => ({
                pairId: pair.color,
                color: COLOR_MAP[pair.color] || '#94a3b8',
                start: { r: pair.a[0], c: pair.a[1] },
                end: { r: pair.b[0], c: pair.b[1] },
            })),
        };
    }, [attempt]);

    const [paths, setPaths] = useState({});
    const [activePairId, setActivePairId] = useState(null);
    const [history, setHistory] = useState([]);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [finalTime, setFinalTime] = useState(null);
    const [backtracks, setBacktracks] = useState(0);
    const [hasSubmittedCompletion, setHasSubmittedCompletion] = useState(false);
    const [gpEarned, setGpEarned] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user } = useAuth();
    const { fetchWallet, setSessionGP } = useWallet();

    useEffect(() => {
        setPaths({});
        setHistory([]);
        setTime(0);
        setIsRunning(true);
        setFinalTime(null);
        setBacktracks(0);
        setHasSubmittedCompletion(false);
    }, [level]);

    useEffect(() => {
        let intervalId;

        if (isRunning) {
            intervalId = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning]);

    const dots = useMemo(() => {
        const map = new Map();
        if (!level) return map;
        level.pairs.forEach(p => {
            map.set(cellToKey(p.start.r, p.start.c), { pair: p, type: 'start' });
            map.set(cellToKey(p.end.r, p.end.c), { pair: p, type: 'end' });
        });
        return map;
    }, [level]);

    const occupied = useMemo(() => {
        const map = {};
        Object.entries(paths).forEach(([pairId, path]) => {
            path.forEach(key => {
                map[key] = pairId;
            });
        });
        return map;
    }, [paths]);

    const coverage = useMemo(() => {
        const filledCells = Object.keys(occupied).length;
        return Math.round((filledCells / (GRID_SIZE * GRID_SIZE)) * 100);
    }, [occupied]);

    const completed = useMemo(() => {
        const set = new Set();
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

    const playerGrid = useMemo(() => buildPlayerGrid(GRID_SIZE, occupied), [occupied]);
    const isLevelComplete = useMemo(() => {
        if (!level) return false;
        return completed.size === level.pairs.length && areAllCellsFilled(playerGrid);
    }, [completed, level, playerGrid]);

    useEffect(() => {
        if (!isLevelComplete) return;

        setIsRunning(false);
        setFinalTime((prevFinalTime) => {
            const timeToUse = time;
            if (prevFinalTime !== null) {
                return prevFinalTime;
            }
            return timeToUse;
        });
    }, [isLevelComplete, time]);

    useEffect(() => {
        if (!isLevelComplete || hasSubmittedCompletion || finalTime == null || !user?._id) return;

        const attemptId = localStorage.getItem('currentGameAttemptId');
        
        const submitScore = async () => {
            if (isSubmitting) return;
            setIsSubmitting(true);

            try {
                // Formatting time for submission logic if needed
                const timeStr = formatTime(finalTime);
                const timeInSeconds = convertTimeToSeconds(timeStr);

                console.log("Submitting score:", { 
                    userId: user._id, 
                    time: timeInSeconds, 
                    gridSize: `${GRID_SIZE}x${GRID_SIZE}` 
                });

                // 1. Submit to the new GP system
                const gpRes = await api.post("/game/submit", {
                    userId: user._id,
                    time: timeInSeconds,
                    gridSize: `${GRID_SIZE}x${GRID_SIZE}`
                });

                if (gpRes.data.success) {
                    setGpEarned(gpRes.data.gp);
                    setSessionGP(prev => prev + gpRes.data.gp);
                    // Refresh total wallet balance from server
                    await fetchWallet();
                }

                // 2. Original system completion (if attemptId exists)
                if (attemptId) {
                    await api.post('/game/complete', {
                        attemptId,
                        time: finalTime,
                    });
                }

                setHasSubmittedCompletion(true);
            } catch (error) {
                console.error("Error submitting game results:", error);
                // Fail gracefully
                setHasSubmittedCompletion(true);
            } finally {
                setIsSubmitting(false);
            }
        };

        const formatTime = (totalSeconds) => {
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };

        submitScore();
    }, [isLevelComplete, finalTime, hasSubmittedCompletion, user, isSubmitting]);

    const saveHistory = useCallback(() => {
        setHistory(prev => [...prev.slice(-19), { paths: { ...paths } }]);
    }, [paths]);

    const handlePointerDown = (key) => {
        if (isLevelComplete) return;
        const dot = dots.get(key);
        if (dot) {
            saveHistory();
            setActivePairId(dot.pair.pairId);
            setPaths(prev => {
                return {
                    ...prev,
                    [dot.pair.pairId]: [key],
                };
            });
        } else if (occupied[key]) {
            const pairId = occupied[key];
            saveHistory();
            setActivePairId(pairId);
            setPaths(prev => {
                const path = prev[pairId] || [];
                const index = path.indexOf(key);
                return { ...prev, [pairId]: path.slice(0, index + 1) };
            });
        }
    };

    const handlePointerEnter = (key) => {
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
            if (index < currentPath.length - 1) {
                setBacktracks((prev) => prev + 1);
            }
            setPaths(prev => {
                return {
                    ...prev,
                    [activePairId]: currentPath.slice(0, index + 1),
                };
            });
            return;
        }

        if (occupied[key] && occupied[key] !== activePairId) return;

        const pair = level?.pairs.find(p => p.pairId === activePairId);
        if (pair) {
            const startKey = cellToKey(pair.start.r, pair.start.c);
            const endKey = cellToKey(pair.end.r, pair.end.c);
            if (currentPath.includes(startKey) && currentPath.includes(endKey)) return;
        }

        setPaths(prev => {
            return {
                ...prev,
                [activePairId]: [...currentPath, key],
            };
        });
    };

    const handlePointerUp = () => {
        setActivePairId(null);
    };

    const handleUndo = () => {
        if (history.length > 0) {
            const lastState = history[history.length - 1];
            setPaths(lastState.paths);
            setHistory(prev => prev.slice(0, -1));
        }
    };

    const handleClear = () => {
        setPaths({});
        setHistory([]);
        setActivePairId(null);
        setTime(0);
        setIsRunning(false);
        setFinalTime(null);
        setBacktracks(0);
    };

    const handleBackToGame = () => {
        setPaths({});
        setHistory([]);
        setActivePairId(null);
        setTime(0);
        setIsRunning(false);
        setFinalTime(null);
        setBacktracks(0);
        setHasSubmittedCompletion(false);
        localStorage.removeItem('currentGameAttemptId');
        localStorage.removeItem('currentPuzzleId');
        navigate('/student/rewards/game', { replace: true });
    };

    if (!level) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-md border border-gray-100 max-w-md mx-auto text-center mt-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Level Not Found</h1>
                <p className="text-gray-500 mb-6">The requested level could not be found.</p>
                <Link to={`/student/rewards/game`} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-full shadow-sm hover:bg-blue-700 transition">Back to Puzzles</Link>
            </div>
        );
    }

    return (
        <div
            className="relative flex flex-col items-center justify-start pb-16"
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">FlowFree Challenge</h1>
                    <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-semibold">Standalone Test Mode</p>
                </div>

                <Link to={`/student/rewards/game`} className="mb-6 inline-block text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    ← Back to Rewards
                </Link>

                <HudBar
                    time={time}
                    coverage={coverage}
                    onUndo={handleUndo}
                    onClear={handleClear}
                />

                <div
                    className="grid gap-1 bg-[#1a1f3c] p-3 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1),_inset_0_0_20px_rgba(168,85,247,0.1)] border border-gray-800"
                    style={{
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        width: 'min(90vw, 500px)',
                        height: 'min(90vw, 500px)',
                        touchAction: 'none'
                    }}
                >
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                        const r = Math.floor(index / GRID_SIZE);
                        const c = index % GRID_SIZE;
                        const key = cellToKey(r, c);
                        const dot = dots.get(key);
                        const pairId = occupied[key];
                        const isPathCell = !!pairId;
                        const pair = isPathCell ? level.pairs.find(p => p.pairId === pairId) : undefined;

                        return (
                            <div
                                key={key}
                                className="relative aspect-square bg-[#0f172a] rounded-lg flex items-center justify-center cursor-pointer transition-colors border border-white/5 hover:bg-[#1e293b]"
                                onPointerDown={() => handlePointerDown(key)}
                                onPointerEnter={() => handlePointerEnter(key)}
                                style={{
                                    backgroundColor: isPathCell ? `${pair?.color}33` : undefined,
                                }}
                            >
                                {dot && (
                                    <div
                                        className="w-[70%] h-[70%] rounded-full shadow-[0_0_15px_currentColor] z-10"
                                        style={{ backgroundColor: dot.pair.color, color: dot.pair.color }}
                                    />
                                )}
                                {isPathCell && !dot && (
                                    <div
                                        className="w-[35%] h-[35%] rounded-full opacity-80 shadow-[0_0_8px_currentColor] z-0"
                                        style={{ backgroundColor: pair?.color, color: pair?.color }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <ResultScreen
                    finalTime={finalTime}
                    gpEarned={gpEarned}
                    onBackToGame={handleBackToGame}
                    isSubmitting={isSubmitting}
                />

                <style
                    dangerouslySetInnerHTML={{
                        __html: `
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
