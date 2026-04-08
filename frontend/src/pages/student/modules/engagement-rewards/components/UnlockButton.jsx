import { KeyRound } from "lucide-react";

export default function UnlockButton({ onClick, disabled = false }) {
  return (
    <section className="mx-auto w-full max-w-3xl text-center pt-2">
      <button
        onClick={onClick}
        disabled={disabled}
        className="rewards-primary-btn w-full px-8 py-3.5 text-base font-bold active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none disabled:brightness-100 disabled:hover:scale-100"
      >
        <span className="inline-flex items-center gap-2">
          <KeyRound size={18} />
          Unlock FlowFree
        </span>
      </button>
      <p className="mt-3 text-xs font-medium text-gray-500">
        Cost increases with usage today. Perform better in quizzes to reduce cost.
      </p>
    </section>
  );
}
