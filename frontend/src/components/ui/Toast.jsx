import { CheckCircle2, XCircle } from "lucide-react";

export default function Toast({ type = "success", message, onClose }) {
  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white
        ${type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
      >
        {type === "success" ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <XCircle className="w-5 h-5" />
        )}

        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}