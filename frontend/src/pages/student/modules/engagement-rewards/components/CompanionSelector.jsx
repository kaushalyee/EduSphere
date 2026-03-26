import { useState } from "react";
import { useGLTF } from "@react-three/drei";

import drStrange from "@/assets/avatars/Dr.strange.glb?url";
import homelander from "@/assets/avatars/homelander.glb?url";
import invincible from "@/assets/avatars/invincible.glb?url";
import layla from "@/assets/avatars/layla.glb?url";
import lesley from "@/assets/avatars/lesley.glb?url";
import mummy from "@/assets/avatars/mummy.glb?url";
import namor from "@/assets/avatars/namor.glb?url";
import superman from "@/assets/avatars/SuperMan.glb?url";
import thor from "@/assets/avatars/thor.glb?url";
import uglyman from "@/assets/avatars/UglyMan.glb?url";

useGLTF.preload(drStrange);
useGLTF.preload(homelander);
useGLTF.preload(invincible);
useGLTF.preload(layla);
useGLTF.preload(lesley);
useGLTF.preload(mummy);
useGLTF.preload(namor);
useGLTF.preload(superman);
useGLTF.preload(thor);
useGLTF.preload(uglyman);

const companions = [
  { id: 1, name: "Dr Strange", model: drStrange, unlocked: true },
  { id: 2, name: "Homelander", model: homelander, unlocked: true },
  { id: 3, name: "Invincible", model: invincible, unlocked: true },
  { id: 4, name: "Layla",  model: layla,  unlocked: true, cameraOffset: 1.8, heightOffset: 1.2 },
  { id: 5, name: "Lesley", model: lesley, unlocked: true, cameraOffset: 1.8, heightOffset: 1.2 },
  { id: 6, name: "Mummy", model: mummy, unlocked: true },
  { id: 7, name: "Namor", model: namor, unlocked: true },
  { id: 8, name: "Superman", model: superman, unlocked: true },
  { id: 9, name: "Thor", model: thor, unlocked: true },
  { id: 10, name: "Ugly Man", model: uglyman, unlocked: true },
];

export default function CompanionSelector({ children }) {
  const [index, setIndex] = useState(0);

  const next = () =>
    setIndex((prev) => (prev + 1) % companions.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + companions.length) % companions.length);

  const currentCompanion = companions[index];

  return children({
    currentCompanion,
    next,
    prev,
    companions,
    index,
  });
}
