import { type InjectionKey, type Ref } from 'vue'

// ─── Stepper Types ───────────────────────────────────────────────────────────
export type StepperOrientation = 'horizontal' | 'vertical'
export type StepperSize = 'sm' | 'md' | 'lg'
export type StepperVariant = 'default' | 'line'

export interface StepperItemInfo {
  step: number
  disabled: boolean
  loading: boolean
  error: boolean
  optional: boolean
}

export interface SStepperContext {
  modelValue: Ref<number>
  orientation: StepperOrientation
  variant: StepperVariant
  linear: boolean
  size: StepperSize
  color: string
  animated: boolean
  clickable: boolean
  totalSteps: Ref<number>
  completedSteps: Ref<Set<number>>
  items: Ref<Map<number, StepperItemInfo>>
  registerItem: (item: StepperItemInfo) => void
  unregisterItem: (step: number) => void
  setStep: (step: number) => void
  markCompleted: (step: number) => void
  unmarkCompleted: (step: number) => void
  isCompleted: (step: number) => boolean
  isActive: (step: number) => boolean
  getState: (step: number) => 'active' | 'completed' | 'inactive' | 'error' | 'loading'
  canNavigateTo: (step: number) => boolean
}

export const SStepperContextKey: InjectionKey<SStepperContext> = Symbol('SStepperContext')

// ─── Stepper Item Types ─────────────────────────────────────────────────────
export interface SStepperItemContext {
  step: number
  state: Ref<'active' | 'completed' | 'inactive' | 'error' | 'loading'>
  disabled: Ref<boolean>
  loading: Ref<boolean>
  error: Ref<boolean>
  optional: Ref<boolean>
  canNavigate: Ref<boolean>
}

export const SStepperItemContextKey: InjectionKey<SStepperItemContext> = Symbol('SStepperItemContext')
