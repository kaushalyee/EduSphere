import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLevelsBySize } from '../levels/levels';

const PuzzleList: React.FC = () => {
    const { size } = useParams<{ size: string }>();
    const navigate = useNavigate();
    const gridSize = parseInt(size || '5', 10);
    const levels = getLevelsBySize(gridSize);

    const handleLevelSelect = (levelId: string) => {
        navigate(`/game/${gridSize}/${levelId}`);
    };

    return (
        <div className="game-container">
            <Link to="/levels" className="back-link" style={{ marginBottom: '2rem', display: 'inline-block' }}>
                ← Back to Sizes
            </Link>

            <div className="card puzzle-list-card">
                <h1 className="puzzle-list-title">{gridSize} X {gridSize}</h1>

                <div className="puzzle-grid">
                    {[1, 2, 3, 4, 5].map((num) => {
                        const level = levels[num - 1];
                        const isDisabled = !level;

                        return (
                            <button
                                key={num}
                                className={`puzzle-btn ${isDisabled ? 'disabled' : ''}`}
                                onClick={() => !isDisabled && handleLevelSelect(level.id)}
                                disabled={isDisabled}
                            >
                                {num}
                            </button>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .puzzle-list-card {
                    text-align: center;
                    padding: 3rem;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-radius: 12px;
                }
                .puzzle-list-title {
                    font-size: 3rem;
                    color: #fff;
                    margin-bottom: 2rem;
                    font-family: 'Outfit', sans-serif;
                }
                .puzzle-grid {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }
                .puzzle-btn {
                    width: 70px;
                    height: 70px;
                    background: #000;
                    border: 3px solid #ffcc00;
                    color: #ffcc00;
                    font-size: 1.8rem;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border-radius: 8px;
                }
                .puzzle-btn:hover:not(:disabled) {
                    background: #ffcc00;
                    color: #000;
                    transform: scale(1.1);
                    box-shadow: 0 0 15px rgba(255, 204, 0, 0.4);
                }
                .puzzle-btn.disabled {
                    border-color: #333;
                    color: #333;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default PuzzleList;
