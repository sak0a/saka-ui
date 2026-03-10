import { cva, type VariantProps } from 'class-variance-authority'

export const kbdVariants = cva(
  'inline-flex items-center justify-center font-mono font-medium select-none whitespace-nowrap leading-none',
  {
    variants: {
      variant: {
        default: 'border border-border bg-muted text-foreground rounded-md shadow-[0_-1px_0_0_rgba(255,255,255,0.06)_inset,0_2px_0_0_var(--s-border)]',
        outlined: 'border border-border text-foreground bg-transparent rounded-md',
        flat: 'bg-muted text-foreground rounded-md',
        ghost: 'text-muted-foreground',
      },
      size: {
        xs: 'text-[10px] px-1 py-0.5 min-w-4 h-4 rounded',
        sm: 'text-xs px-1.5 py-0.5 min-w-5 h-5 rounded-md',
        md: 'text-xs px-1.5 py-1 min-w-6 h-6 rounded-md',
        lg: 'text-sm px-2 py-1 min-w-7 h-7 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export type KbdVariants = VariantProps<typeof kbdVariants>
