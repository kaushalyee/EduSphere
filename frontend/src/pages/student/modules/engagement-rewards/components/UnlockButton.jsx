import { KeyRound } from "lucide-react";

export default function UnlockButton() {
  return (
    <section className="mx-auto w-full max-w-3xl text-center">
      <button className="w-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-red-500 px-8 py-3 text-base font-bold text-white shadow-[0_0_40px_rgba(239,68,68,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 animate-[pulse_3s_infinite]">
        <span className="inline-flex items-center gap-2">
          <KeyRound size={18} />
          Unlock FlowFree
        </span>
      </button>
      <p className="mt-2 text-xs text-gray-400">
        Unlocking will deduct 10 R-Points and grant one attempt.
      </p>
    </section>
  );
}
