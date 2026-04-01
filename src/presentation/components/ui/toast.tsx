import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, X, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  leaving?: boolean
}

let addToastFn: ((message: string, type?: ToastType) => void) | null = null

export function toast(message: string, type: ToastType = 'success') {
  addToastFn?.(message, type)
}

const icons = {
  success: CheckCircle,
  error: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: 'bg-success-50 text-success-600 border-success-100',
  error: 'bg-danger-50 text-danger-600 border-danger-100',
  warning: 'bg-warning-50 text-warning-500 border-warning-400/30',
  info: 'bg-brand-50 text-brand-600 border-brand-100',
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      )
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 250)
    }, 4000)
  }, [])

  useEffect(() => {
    addToastFn = addToast
    return () => {
      addToastFn = null
    }
  }, [addToast])

  const dismiss = (id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    )
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 250)
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
      {toasts.map((t) => {
        const Icon = icons[t.type]
        return (
          <div
            key={t.id}
            className={cn(
              'flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm',
              styles[t.type],
              t.leaving ? 'animate-toast-out' : 'animate-toast-in'
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="ml-2 shrink-0 rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100"
              aria-label="Fechar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
