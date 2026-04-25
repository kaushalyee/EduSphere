import React from 'react';

/**
 * CompanionRarityBadge
 * Displays a premium rarity tag (LEGENDARY, EPIC) for companions.
 * 
 * @param {string} companionId - The ID of the companion
 */
const CompanionRarityBadge = ({ companionId }) => {
  const id = companionId?.toLowerCase();

  // Mapping logic
  const isLegendary = ['superman', 'hulk', 'batman'].includes(id);
  const isEpic = ['gwen', 'layla', 'lesley', 'iron_spider'].includes(id);

  if (!isLegendary && !isEpic) return null; // Robot (Default) gets no badge

  const config = isLegendary 
    ? { label: 'LEGENDARY', styles: 'legendary-badge' }
    : { label: 'EPIC', styles: 'epic-badge' };

  return (
    <div className={`rarity-badge ${config.styles}`}>
      {config.label}
    </div>
  );
};

export default CompanionRarityBadge;
