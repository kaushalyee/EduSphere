import { useState, useEffect } from "react";

export default function CompanionSelector({ children, companionsList = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (companionsList.length > 0 && index >= companionsList.length) {
      setIndex(Math.max(0, companionsList.length - 1));
    }
  }, [companionsList, index]);

  const next = () => {
    if (index < companionsList.length - 1) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const currentCompanion = companionsList[index];

  return children({
    currentCompanion,
    next,
    prev,
    companions: companionsList,
    index,
  });
}
