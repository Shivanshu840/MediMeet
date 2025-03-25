// use-toast.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "destructive";

interface Toast {
  id: number;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (options: {
    title: string;
    description?: string;
    variant?: ToastType;
  }) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  // Correctly named useToast hook
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({
      title,
      description,
      variant = "info",
    }: {
      title: string;
      description?: string;
      variant?: ToastType;
    }) => {
      setToasts((prevToasts) => [
        ...prevToasts,
        { id: Date.now(), title, description, type: variant },
      ]);
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast: React.FC<Toast & { onClose: () => void }> = ({
  id,
  title,
  description,
  type,
  onClose,
}) => {
  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error" || type === "destructive"
        ? "bg-red-500"
        : "bg-blue-500";

  return (
    <div
      className={`${bgColor} text-white px-4 py-2 rounded-md shadow-md mb-2 flex items-center justify-between`}
    >
      <div>
        <span className="font-semibold">{title}</span>
        {description && <p className="text-sm">{description}</p>}
      </div>
      <button onClick={onClose} className="ml-4 focus:outline-none">
        <X size={18} />
      </button>
    </div>
  );
};
