import { cva, type VariantProps } from 'class-variance-authority'
import type { IconProp } from '~/lib/icon'

export const buttonVariants = cva(
  'relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-out overflow-hidden select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-[1.5px] border-transparent',
  {
    variants: {
      variant: {
        filled: 'bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]',
        outlined: 'bg-transparent border-primary text-primary hover:bg-primary/10',
        light: 'bg-primary/15 text-primary hover:bg-primary/25',
        ghost: 'bg-transparent text-primary hover:bg-accent',
        link: 'bg-transparent text-primary hover:underline',
        dashed: 'bg-transparent border-primary text-primary border-dashed hover:bg-primary/10',
        glass: '',
      },
      size: {
        xs: 'px-1.5 py-0.5 text-xs gap-1',
        small: 'px-2 py-0.5 text-sm gap-1.5',
        medium: 'px-2 py-0.5 text-sm gap-2',
        large: 'px-2.5 py-0.5 text-base gap-2',
        xl: 'px-3 py-0.5 text-lg gap-2.5',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'medium',
      rounded: 'md',
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

export interface Props {
  variant?: 'filled' | 'outlined' | 'light' | 'ghost' | 'link' | 'dashed' | 'glass'
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl'
  color?: string
  type?: 'default' | 'primary' | 'error' | 'success' | 'info' | 'warning'
  disabled?: boolean
  loading?: boolean
  preserveSize?: boolean
  block?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  iconLeft?: IconProp
  iconRight?: IconProp
  iconOnly?: boolean
  tag?: string
  href?: string
  to?: string | object
  nativeType?: 'button' | 'submit' | 'reset'
  ripple?: boolean
  animationType?: 'slide' | 'vertical' | 'scale' | 'rotate'
  animateInactive?: boolean
  contentClass?: string
  iconClass?: string
}
