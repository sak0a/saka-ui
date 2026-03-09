// Utilities
export { cn } from './lib/utils'
export { type IconProp, isIconComponent } from './lib/icon'

export { STabs, STabPane, STabsList, STabsTrigger, STabsContent, STabsIndicator } from './components/ui/tabs'
export { default as SIcon } from './components/ui/SIcon.vue'
export { default as SChip } from './components/ui/SChip.vue'
export { default as SSwitch } from './components/ui/SSwitch.vue'
export { default as SButton, buttonVariants, type ButtonVariants } from './components/ui/SButton.vue'
export { default as SGlassButton } from './components/ui/SGlassButton.vue'
export { default as STooltip } from './components/ui/STooltip.vue'
export { default as SAlert } from './components/ui/SAlert.vue'
export { default as SBadge, type BadgeVariants } from './components/ui/SBadge.vue'
export { default as SCheckbox } from './components/ui/SCheckbox.vue'
export { SAvatar, SAvatarImage, SAvatarFallback, SAvatarGroup } from './components/ui/avatar'
export { default as SSelect } from './components/ui/SSelect.vue'
export type { SelectOption, Props as SSelectProps } from './components/ui/SSelect.vue'
export { SOption, SOptionGroup } from './components/ui/option'
export { SCarousel, SCarouselSlide } from './components/ui/carousel'
export { SRadio, SRadioGroup } from './components/ui/radio'
export { SAccordion, SAccordionItem, SAccordionTrigger, SAccordionContent } from './components/ui/accordion'
export { default as SDatePicker } from './components/ui/SDatePicker.vue'
export {
  SColorPicker,
  SColorPickerSpectrum,
  SColorPickerHueSlider,
  SColorPickerAlphaSlider,
  SColorPickerPreview,
  SColorPickerEyeDropper,
  SColorPickerCopy,
  SColorPickerInputs,
  SColorPickerPresets,
  SColorPickerRecent
} from './components/ui/color-picker'
export { default as SInput } from './components/ui/SInput.vue'
export { default as SKbd, kbdVariants, type KbdVariants } from './components/ui/SKbd.vue'
export { default as SSkeleton, type SkeletonVariants } from './components/ui/SSkeleton.vue'
export { default as SKbdShortcut } from './components/ui/SKbdShortcut.vue'
export { SDropdown, SDropdownItem, SDropdownDivider, SDropdownGroup } from './components/ui/dropdown'
export {
  SBreadcrumb,
  SBreadcrumbList,
  SBreadcrumbItem,
  SBreadcrumbLink,
  SBreadcrumbPage,
  SBreadcrumbSeparator,
  SBreadcrumbEllipsis
} from './components/ui/breadcrumb'
export { default as SCard } from './components/ui/card/SCard.vue'
export { default as SCardHeader } from './components/ui/card/SCardHeader.vue'
export { default as SCardContent } from './components/ui/card/SCardContent.vue'
export { default as SCardFooter } from './components/ui/card/SCardFooter.vue'
export { default as SCardMedia } from './components/ui/card/SCardMedia.vue'
export { default as SCardActions } from './components/ui/card/SCardActions.vue'
// Glass Card
export { default as SGlassCard } from './components/ui/card/SGlassCard.vue'
// Morphing Card
export {
  SMorphingCard,
  SMorphingCardTrigger,
  SMorphingCardContent,
  SMorphingCardImage,
  SMorphingCardTitle,
  SMorphingCardDescription,
  SMorphingCardClose
} from './components/ui/card'
export { SForm, SFormField } from './components/ui/form'
export {
  SModal,
  SModalHeader,
  SModalContent,
  SModalFooter,
  SModalTrigger,
  SModalTitle,
  SModalDescription,
  SModalClose,
  // Morphing Modal
  SMorphingModal,
  SMorphingModalTrigger,
  SMorphingModalClose,
  SMorphingModalTitle,
  SMorphingModalSubtitle,
  SMorphingModalDescription,
  SMorphingModalImage
} from './components/ui/modal'

// Drawer exports
export {
  SDrawer,
  SDrawerHeader,
  SDrawerContent,
  SDrawerFooter,
  SDrawerTitle,
  SDrawerDescription,
  SDrawerClose,
  SDrawerTrigger,
  SDrawerHandle
} from './components/ui/drawer'

// OTP Input
export { SOTP, SOTPSlot, SOTPGroup, SOTPSeparator, useSOTPContext, SOTP_INJECTION_KEY } from './components/ui/otp'
export type { SOTPContext, MorphData } from './components/ui/otp'

// Progress components
export { SProgress, SProgressRange } from './components/ui/progress'
export type { SProgressProps, SProgressRangeProps, RangeValue } from './components/ui/progress'

// Pagination components
export { SPagination } from './components/ui/pagination'
export type { SPaginationProps, PaginationVariant, PaginationSize, PaginationShape, AnimationType as PaginationAnimationType } from './components/ui/pagination'

// Stepper components
export {
  SStepper,
  SStepperItem,
  SStepperTrigger,
  SStepperIndicator,
  SStepperTitle,
  SStepperDescription,
  SStepperSeparator,
  SStepperContent
} from './components/ui/stepper'
export type { StepperOrientation, StepperSize, StepperVariant, SStepperContext } from './components/ui/stepper'
export { SStepperContextKey, SStepperItemContextKey } from './components/ui/stepper'

// Drawer type exports
export type {
  DrawerSide,
  DrawerSize,
  DrawerVariant,
  SDrawerContext
} from './components/ui/drawer'
export { SDrawerContextKey } from './components/ui/drawer'

// Documentation / API Reference components
export { default as SApiSection } from './components/SApiSection.vue'
export { default as SApiTable } from './components/SApiTable.vue'
export { default as SApiKeyboard } from './components/SApiKeyboard.vue'

// Type exports
export type { ApiProp, ApiEvent, ApiSlot, ApiMethod, TableType } from './components/SApiTable.vue'
export type { KeyboardShortcut } from './components/SApiKeyboard.vue'
export type { Props as SFormProps } from './components/ui/form/SForm.vue'
export type { Props as SFormFieldProps } from './components/ui/form/SFormField.vue'

// Composables
export {
    // Main composable
    useForm,
    // Validators
    required,
    minLength,
    maxLength,
    min,
    max,
    email,
    url,
    pattern,
    sameAs,
    hasUppercase,
    hasLowercase,
    hasDigit,
    hasSpecial,
    alphanumeric,
    numeric,
    // Custom validators
    custom,
    passwordStrength,
    PasswordStrength,
    different,
    oneOf,
    notOneOf,
    // Types
    type ValidationRule,
    type AsyncValidationRule,
    type FieldConfig,
    type FieldState,
    type FormState,
    type UseFormOptions,
    type TypedFields,
    type PersistOptions,
    type ZodLikeSchema,
    // Helpers
    createFieldBindings,
    useFormFieldBindings
} from './composables/useForm'


export * from './components/ui/tabs/context'

// Table components
export {
  SDataTable,
  STableHeader,
  STableBody,
  STableRow,
  STableCell,
  STableColumn,
  STableSkeleton,
  STableEmpty,
  useDataTable
} from './components/ui/table'

// Table types
export type {
  TableColumn,
  TableVariant,
  TableSize,
  SortDirection,
  ColumnAlign,
  SelectionMode,
  SortState,
  PaginationState,
  TableRowData,
  SDataTableContext
} from './components/ui/table'
export { SDataTableContextKey } from './components/ui/table'

// Toast components
export { SToast, SToastContainer } from './components/ui/toast'

// Toast composable
export {
  useToast,
  getToasts,
  getToastConfig,
  dismissToast,
  pauseToast,
  resumeToast,
  type ToastType,
  type ToastPosition,
  type ToastOptions,
  type ToastInstance,
  type ToastPromiseOptions,
  type ToastConfig
} from './composables/useToast'

// Dialog composable
export {
  useDialog,
  confirm,
  prompt,
  alertDialog,
  type DialogVariant,
  type ConfirmOptions,
  type PromptOptions,
  type AlertOptions,
  type CustomDialogOptions,
  type DialogInstance
} from './composables/useDialog'

// Clipboard composable
export {
  useClipboard,
  type CopyOptions,
  type ClipboardState,
  type UseClipboardReturn
} from './composables/useClipboard'

// Click outside composable
export {
  useClickOutside,
  createClickOutsideHandler,
  type MaybeElementRef,
  type ClickOutsideOptions,
  type ClickOutsideHandler,
  type UseClickOutsideReturn
} from './composables/useClickOutside'

// Media query composable
export {
  useMediaQuery,
  useMediaQueries,
  useBreakpoints,
  useBreakpoint,
  breakpoints,
  type MediaQueryInput,
  type UseMediaQueryReturn,
  type UseMediaQueryObjectReturn,
  type BreakpointKey
} from './composables/useMediaQuery'

// Debounce and throttle composables
export {
  useDebounce,
  useDebounceFn,
  useThrottle,
  useThrottleFn,
  type DebounceOptions,
  type ThrottleOptions,
  type DebouncedFn,
  type ThrottledFn,
  type UseDebounceReturn,
  type UseThrottleReturn
} from './composables/useDebounce'

// Local/Session storage composables
export {
  useLocalStorage,
  useSessionStorage,
  createStorage,
  jsonSerializer,
  stringSerializer,
  numberSerializer,
  booleanSerializer,
  type Serializer,
  type StorageOptions,
  type UseStorageReturn
} from './composables/useLocalStorage'

// Async composable
export {
  useAsync,
  useLazyAsync,
  useAsyncState,
  clearAsyncCache,
  type UseAsyncOptions,
  type UseAsyncReturn,
  type AsyncFn
} from './composables/useAsync'

// Hotkey composable
export {
  useHotkey,
  useHotkeys,
  createHotkeyHandler,
  useKeyPressed,
  type ModifierKey,
  type KeyCombo,
  type HotkeyOptions,
  type HotkeyHandler,
  type UseHotkeyReturn,
  type ParsedHotkey
} from './composables/useHotkey'

// Intersection observer composable
export {
  useIntersectionObserver,
  useIntersectionObserverMultiple,
  useElementVisibility,
  useElementHasBeenSeen,
  type IntersectionObserverOptions,
  type UseIntersectionObserverReturn,
  type UseIntersectionObserverMultipleReturn
} from './composables/useIntersectionObserver'
