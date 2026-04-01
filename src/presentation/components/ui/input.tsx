import { forwardRef, type InputHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const inputVariants = cva(
  'flex h-11 w-full rounded-lg border bg-elevated px-3.5 py-2 text-sm text-surface-900 shadow-[var(--shadow-xs)] transition-all duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-surface-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-0 focus-visible:border-brand-500 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-surface-200 hover:border-surface-300',
        error: 'border-danger-500 focus-visible:ring-danger-500/40 focus-visible:border-danger-500',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
)

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ state, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input, inputVariants, type InputProps }
