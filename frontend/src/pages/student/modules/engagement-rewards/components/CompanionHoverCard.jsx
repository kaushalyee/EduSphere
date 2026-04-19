import React from 'react';
import avatarConfig from '@/assets/avatars/avatarConfig';

/**
 * CompanionHoverCard
 * A premium floating card that shows the equipped companion of a leaderboard user.
 * 
 * @param {string} companionId - The ID of the companion (robot, layla, etc.)
 * @param {boolean} visible - Whether the card is currently visible
 */
const CompanionHoverCard = ({ companionId, visible }) => {
  const companion = avatarConfig.find(c => c.id === (companionId || 'robot')) || avatarConfig[0];
  
  // Custom rarity colors for labels
  const rarityColors = {
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
    common: 'text-gray-400'
  };

  // 🧩 Rarity Glow Mapping (Visual Logic)
  const getGlowColor = () => {
    const id = companion.id.toLowerCase();
    if (id === 'robot') return 'rgba(139, 92, 246, 0.4)'; // Purple
    
    // Legendary (Gold)
    if (['superman', 'hulk', 'batman'].includes(id)) {
      return 'rgba(251, 191, 36, 0.5)';
    }
    
    // Epic (Red)
    if (['gwen', 'layla', 'lesley', 'iron_spider'].includes(id)) {
      return 'rgba(239, 68, 68, 0.5)';
    }

    return 'rgba(139, 92, 246, 0.4)'; // Default Purple
  };

  const glowColor = getGlowColor();

  // Previews should be in /assets/avatars/previews/ as JPG files
  const previewImage = `/assets/avatars/previews/${companion.id}.jpg`;

  return (
    <div className={`companion-hover-card ${visible ? 'visible' : ''}`}>
      <div className="chc-content">
        {/* Placeholder Icon/Image Container */}
        <div className="chc-image-container">
           <img 
            src={previewImage} 
            alt={companion.name} 
            onError={(e) => {
              if (e.target.src.includes('robot.jpg')) {
                e.target.src = ''; // Stop loop if fallback also fails
                e.target.style.display = 'none';
              } else {
                e.target.src = '/assets/avatars/previews/robot.jpg';
              }
            }}
            className="chc-image"
           />
           <div 
            className="chc-image-glow" 
            style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
           />
        </div>

        <div className="chc-info-container">
          <h4 className="chc-name">{companion.name}</h4>
          <p className="chc-rarity">
            Equipped <span className={rarityColors[companion.rarity] || 'text-gray-400'}>
              {companion.rarity}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanionHoverCard;
