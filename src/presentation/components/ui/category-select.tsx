import { useState, useRef, useEffect, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { inputVariants } from './input'
import { transferCategories, type TransferCategory } from '@/shared/lib/categories'
import type { VariantProps } from 'class-variance-authority'

interface CategorySelectProps extends VariantProps<typeof inputVariants> {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  name?: string
  id?: string
  className?: string
  placeholder?: string
}

const CategorySelect = forwardRef<HTMLButtonElement, CategorySelectProps>(
  ({ value, onChange, onBlur, name, id, state, className, placeholder = 'Selecione a categoria' }, ref) => {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selected = transferCategories.find((c) => c.value === value)

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
      }
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open])

    const handleSelect = (category: TransferCategory) => {
      onChange?.(category.value)
      setOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    return (
      <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
        <input type="hidden" name={name} value={value ?? ''} />
        <button
          ref={ref}
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={placeholder}
          onClick={() => { setOpen(!open); }}
          onBlur={onBlur}
          className={cn(
            inputVariants({ state, className }),
            'flex w-full items-center justify-between text-left cursor-pointer',
            !selected && 'text-surface-400',
          )}
        >
          {selected ? (
            <span className="flex items-center gap-2.5">
              <selected.icon className="h-4 w-4 text-surface-500" />
              <span className="font-medium text-surface-900">{selected.label}</span>
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronDown className={cn('h-4 w-4 text-surface-400 transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-surface-200 bg-elevated py-1 shadow-lg animate-scale-in"
          >
            {transferCategories.map((category) => {
              const Icon = category.icon
              const isSelected = category.value === value
              return (
                <li
                  key={category.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(category)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 px-3.5 py-2.5 text-sm transition-colors',
                    isSelected
                      ? 'bg-brand-600/10 text-brand-500 dark:bg-brand-400/15 dark:text-brand-400'
                      : 'text-surface-700 hover:bg-surface-50',
                  )}
                >
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    isSelected
                      ? 'bg-brand-600/15 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400'
                      : 'bg-surface-100 text-surface-500',
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{category.label}</span>
                  {isSelected && (
                    <span className="ml-auto text-brand-500 dark:text-brand-400">&#10003;</span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }
)
CategorySelect.displayName = 'CategorySelect'

export { CategorySelect }
