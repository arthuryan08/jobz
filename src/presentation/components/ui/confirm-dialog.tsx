import { type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-surface-950/40 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl bg-elevated p-6 shadow-lg animate-scale-in">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning-50">
          <AlertTriangle className="h-6 w-6 text-warning-500" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
        <div className="mt-1 text-sm text-surface-500">{description}</div>
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button className="flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? 'Processando...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
