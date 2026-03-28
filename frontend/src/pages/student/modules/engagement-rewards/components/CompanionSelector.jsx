import { useState, useEffect } from "react";
import avatarConfig from "../../../../../assets/avatars/avatarConfig";

const companions = avatarConfig.map(({ name, file }, index) => ({
  id: index + 1,
  name,
  model: file,
  unlocked: true,
}));

export default function CompanionSelector({ children }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= companions.length) {
      setIndex(Math.max(0, companions.length - 1));
    }
  }, [companions]);

  const next = () => {
    if (index < companions.length - 1) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const currentCompanion = companions[index];

  return children({
    currentCompanion,
    next,
    prev,
    companions,
    index,
  });
}
