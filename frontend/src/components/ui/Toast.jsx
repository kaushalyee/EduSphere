import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

export default function Toast({ type = "success", message, onClose }) {
  const styles = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white min-w-[280px] max-w-sm ${
          styles[type] || styles.error
        }`}
      >
        {type === "success" && <CheckCircle2 className="w-5 h-5 shrink-0" />}
        {type === "error" && <XCircle className="w-5 h-5 shrink-0" />}
        {type === "warning" && <AlertTriangle className="w-5 h-5 shrink-0" />}
        {type === "info" && <Info className="w-5 h-5 shrink-0" />}

        <span className="text-sm font-medium flex-1">{message}</span>

        <button
          type="button"
          onClick={onClose}
          className="text-white/80 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}