import { useToastStore } from "@/store/useToastStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/utils/cn";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-slide-up",
              isSuccess && "bg-emerald-50/90 border-emerald-100 text-emerald-800",
              isError && "bg-rose-50/90 border-rose-100 text-rose-800",
              !isSuccess && !isError && "bg-blue-50/90 border-blue-100 text-blue-800"
            )}
            role="alert"
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}

            <div className="flex-1 text-sm font-medium leading-5">{toast.message}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className={cn(
                "p-1 rounded-lg transition-colors flex-shrink-0",
                isSuccess && "hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800",
                isError && "hover:bg-rose-100 text-rose-600 hover:text-rose-800",
                !isSuccess && !isError && "hover:bg-blue-100 text-blue-600 hover:text-blue-800"
              )}
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
