import { forwardRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { cn } from '@/shared/lib/utils'
import { inputVariants } from './input'
import type { VariantProps } from 'class-variance-authority'

function formatCentsToDisplay(cents: number): string {
  const reais = Math.floor(cents / 100)
  const centavos = cents % 100
  const reaisStr = reais.toLocaleString('pt-BR')
  const centavosStr = centavos.toString().padStart(2, '0')
  return `${reaisStr},${centavosStr}`
}

interface CurrencyInputProps
  extends VariantProps<typeof inputVariants> {
  id?: string
  className?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  name?: string
  disabled?: boolean
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, state, onChange, value, name, ...props }, ref) => {
    const [cents, setCents] = useState(0)

    const displayValue = formatCentsToDisplay(cents)

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      const key = e.key

      if (key === 'Backspace') {
        e.preventDefault()
        const newCents = Math.floor(cents / 10)
        setCents(newCents)
        fireChange(newCents)
        return
      }

      if (/^[0-9]$/.test(key)) {
        e.preventDefault()
        const newCents = cents * 10 + parseInt(key, 10)
        if (newCents > 99999999) return
        setCents(newCents)
        fireChange(newCents)
        return
      }
    }

    const handleChange = (_e: ChangeEvent<HTMLInputElement>) => {
      // controlled via keyDown
    }

    const fireChange = (newCents: number) => {
      if (!onChange) return
      const decimal = (newCents / 100).toFixed(2)
      const syntheticEvent = {
        target: { value: decimal, name: name ?? '' },
      } as ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }

    return (
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-surface-400">
          R$
        </span>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          className={cn(inputVariants({ state, className }), 'pl-11 text-right font-semibold tabular-nums')}
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          name={name}
          {...props}
        />
      </div>
    )
  },
)
CurrencyInput.displayName = 'CurrencyInput'

export { CurrencyInput, formatCentsToDisplay }
