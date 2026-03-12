export type SOTPVariant = 'outlined' | 'filled' | 'underlined' | 'ghost' | 'morphing'
export type SOTPSize = 'sm' | 'md' | 'lg' | 'xl'
export type SOTPRounded = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
export type SOTPGap = 'tight' | 'normal' | 'wide'
export type SOTPMode = 'numeric' | 'alphanumeric' | 'alphabetic' | 'any'
export type SOTPAnimation = 'none' | 'bounce' | 'shake' | 'pulse' | 'flip' | 'morph' | 'glow' | 'wave'
export type SOTPEntryAnimation = 'none' | 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'rotate' | 'blur'
export type SOTPInputAnimation = 'none' | 'pop' | 'squeeze' | 'jelly' | 'rubber'
export type SOTPSuccessAnimation = 'none' | 'celebrate' | 'check' | 'ripple'
export type SOTPErrorAnimation = 'none' | 'shake' | 'wobble' | 'flash'

export interface SOTPVisualDefaults {
  variant: SOTPVariant
  size: SOTPSize
  color: string
  rounded: SOTPRounded
  animation: SOTPAnimation
  entryAnimation: SOTPEntryAnimation
  inputAnimation: SOTPInputAnimation
  successAnimation: SOTPSuccessAnimation
  errorAnimation: SOTPErrorAnimation
  morphText: boolean
  morphDuration: number
  showPlaceholder: boolean
  placeholderChar: string
  maskChar: string
}
