import React from 'react';
import { useNavigate } from 'react-router-dom';


const LevelSelect: React.FC = () => {
    const navigate = useNavigate();
    const gridSizes = [5, 6, 7, 8, 9, 10];

    const handleSizeSelect = (size: number) => {
        navigate(`/levels/${size}`);
    };

    return (
        <div className="card">
            <h1>Select Grid Size</h1>
            <div className="level-grid">
                {gridSizes.map((size) => (
                    <button
                        key={size}
                        className="btn btn-primary"
                        onClick={() => handleSizeSelect(size)}
                        id={`level-${size}x${size}`}
                    >
                        {size} x {size}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LevelSelect;
