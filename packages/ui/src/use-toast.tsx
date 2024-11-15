import React, { createContext, useContext, useState, useCallback } from 'react'
import { X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { id: Date.now(), message, type },
    ])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const Toast: React.FC<Toast & { onClose: () => void }> = ({ id, message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'

  return (
    <div className={`${bgColor} text-white px-4 py-2 rounded-md shadow-md mb-2 flex items-center justify-between`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 focus:outline-none">
        <X size={18} />
      </button>
    </div>
  )
}

export default function Component() {
  const { addToast } = useToast()

  return (
    <div className="p-4">
      <button
        onClick={() => addToast('This is a success message', 'success')}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      >
        Show Success Toast
      </button>
      <button
        onClick={() => addToast('This is an error message', 'error')}
        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
      >
        Show Error Toast
      </button>
      <button
        onClick={() => addToast('This is an info message', 'info')}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Show Info Toast
      </button>
    </div>
  )
}