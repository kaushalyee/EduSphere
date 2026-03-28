import { Flame } from "lucide-react";

export default function RewardsHero({ studentName, gameAttempts }) {
  const formatName = (name) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1) : "Student";

  return (
    <div className="group relative flex min-h-[300px] flex-col justify-center overflow-hidden rounded-[2rem] bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-8 shadow-2xl">
      <div className="pointer-events-none absolute top-0 right-0 h-full w-3/4 opacity-40 mix-blend-color-dodge transition-transform duration-1000 group-hover:scale-105">
        <div className="h-full w-full bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.8)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:30px_30px] [mask-image:radial-gradient(ellipse_60%_100%_at_right_center,black_40%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 flex h-full max-w-xl flex-col justify-center">
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/20 px-4 py-2 text-xs font-bold text-white shadow-sm backdrop-blur-md">
          <Flame
            size={16}
            className="fill-orange-400 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]"
          />
          <span className="tracking-wide">YOU HAVE {gameAttempts} GAME ATTEMPTS</span>
        </div>

        <h1 className="mb-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-5xl">
          Welcome back, {formatName(studentName)}!
        </h1>

        <p className="max-w-sm text-sm font-medium leading-relaxed text-indigo-100/90">
          Every step you take today builds your future success. Stay consistent and keep progressing.
        </p>
      </div>
    </div>
  );
}
