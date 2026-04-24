import React from "react";
import PuzzleChallengeCard from "@/components/rewards/PuzzleChallengeCard";

const GameCard = (props) => {
  return <PuzzleChallengeCard {...props} />;
};

export default React.memo(GameCard);

