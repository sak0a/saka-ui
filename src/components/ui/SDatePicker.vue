<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { cn } from '~/lib/utils'

defineOptions({ inheritAttrs: false })

export interface Props {
  // Core
  modelValue?: Date | Date[] | [Date, Date] | null
  mode?: 'single' | 'range' | 'multiple'
  
  // Display
  variant?: 'outlined' | 'filled' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  color?: string
  rounded?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  
  // Formatting
  format?: string
  placeholder?: string
  
  // Constraints
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[] | ((date: Date) => boolean)
  disabledWeekdays?: number[]
  
  // Behavior
  disabled?: boolean
  loading?: boolean
  readonly?: boolean
  clearable?: boolean
  closeOnSelect?: boolean
  teleport?: boolean | string
  
  // Calendar Options
  showWeekNumbers?: boolean
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  monthsToShow?: 1 | 2
  showToday?: boolean
  
  // Time Picker
  enableTime?: boolean
  timeFormat?: '12h' | '24h'
  minuteStep?: number
  
  // Labels
  label?: string
  labelPlacement?: 'top' | 'left'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  mode: 'single',
  variant: 'outlined',
  size: 'md',
  color: 'var(--s-primary)',
  rounded: 'md',
  format: 'MMM dd, yyyy',
  placeholder: 'Select date...',
  minDate: undefined,
  maxDate: undefined,
  disabledDates: undefined,
  disabledWeekdays: () => [],
  disabled: false,
  loading: false,
  readonly: false,
  clearable: true,
  closeOnSelect: true,
  teleport: true,
  showWeekNumbers: false,
  firstDayOfWeek: 0,
  monthsToShow: 1,
  showToday: true,
  enableTime: false,
  timeFormat: '24h',
  minuteStep: 5,
  label: undefined,
  labelPlacement: 'top'
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | Date[] | [Date, Date] | null]
  open: []
  close: []
  clear: []
  monthChange: [month: number, year: number]
  yearChange: [year: number]
}>()

// Active text class: use primary-foreground for default primary, white for custom colors
const activeTextClass = computed(() => props.color === 'var(--s-primary)' ? 'text-primary-foreground' : 'text-white')

// Refs
const triggerRef = ref<HTMLElement | null>(null)
const calendarRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const isFocused = ref(false)

// Calendar state
const viewDate = ref(new Date())
const hoverDate = ref<Date | null>(null)
const rangeStart = ref<Date | null>(null)

// Month/Year picker state
const showMonthPicker = ref(false)
const showYearPicker = ref(false)
const yearPickerRef = ref<HTMLElement | null>(null)

// Time state
const selectedHour = ref(0)
const selectedMinute = ref(0)
const isAM = ref(true)

// Ripple state
const ripples = ref<{ id: number; x: number; y: number; size: number }[]>([])
let rippleId = 0

// Dropdown position
const dropdownPosition = ref<{ 
  top?: number
  bottom?: number
  left: number
  width: number
  placement: 'top' | 'bottom' 
}>({ top: 0, left: 0, width: 0, placement: 'bottom' })

// Month and weekday names
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const monthNamesShort = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Computed
const weekdaysOrdered = computed(() => {
  const days = [...weekdayNames]
  for (let i = 0; i < props.firstDayOfWeek; i++) {
    days.push(days.shift()!)
  }
  return days
})

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  
  if (props.mode === 'single' && props.modelValue instanceof Date) {
    return formatDate(props.modelValue)
  }
  
  if (props.mode === 'range' && Array.isArray(props.modelValue) && props.modelValue.length === 2) {
    const [start, end] = props.modelValue as [Date, Date]
    return `${formatDate(start)} - ${formatDate(end)}`
  }
  
  if (props.mode === 'multiple' && Array.isArray(props.modelValue)) {
    const dates = props.modelValue as Date[]
    if (dates.length <= 2) {
      return dates.map(d => formatDate(d)).join(', ')
    }
    return `${dates.length} dates selected`
  }
  
  return ''
})

const hasValue = computed(() => {
  if (!props.modelValue) return false
  if (Array.isArray(props.modelValue)) return props.modelValue.length > 0
  return true
})

const calendarDays = computed(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days: { date: Date; isCurrentMonth: boolean; isToday: boolean; isSelected: boolean; isInRange: boolean; isRangeStart: boolean; isRangeEnd: boolean; isDisabled: boolean }[] = []
  
  // Previous month days
  let startDayOfWeek = firstDay.getDay() - props.firstDayOfWeek
  if (startDayOfWeek < 0) startDayOfWeek += 7
  
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: isSelected(date),
      isInRange: isInRange(date),
      isRangeStart: isRangeStart(date),
      isRangeEnd: isRangeEnd(date),
      isDisabled: isDateDisabled(date)
    })
  }
  
  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      isSelected: isSelected(date),
      isInRange: isInRange(date),
      isRangeStart: isRangeStart(date),
      isRangeEnd: isRangeEnd(date),
      isDisabled: isDateDisabled(date)
    })
  }
  
  // Next month days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: isSelected(date),
      isInRange: isInRange(date),
      isRangeStart: isRangeStart(date),
      isRangeEnd: isRangeEnd(date),
      isDisabled: isDateDisabled(date)
    })
  }
  
  return days
})

const weeks = computed(() => {
  const result: typeof calendarDays.value[] = []
  for (let i = 0; i < calendarDays.value.length; i += 7) {
    result.push(calendarDays.value.slice(i, i + 7))
  }
  return result
})

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  
  // Default range: 100 years before, 50 years after
  let startYear = currentYear - 100
  let endYear = currentYear + 50
  
  // Respect maxDate if provided
  if (props.maxDate) {
    endYear = Math.min(endYear, props.maxDate.getFullYear())
  }
  
  // Respect minDate if provided
  if (props.minDate) {
    startYear = Math.max(startYear, props.minDate.getFullYear())
  }
  
  for (let i = startYear; i <= endYear; i++) {
    years.push(i)
  }
  return years
})

// Helper functions
function formatDate(date: Date): string {
  if (props.enableTime) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const timeStr = props.timeFormat === '12h'
      ? `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
      : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    return `${monthNamesShort[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${timeStr}`
  }
  return `${monthNamesShort[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

function isSelected(date: Date): boolean {
  if (!props.modelValue) return false
  
  if (props.mode === 'single' && props.modelValue instanceof Date) {
    return isSameDay(date, props.modelValue)
  }
  
  if (props.mode === 'range' && Array.isArray(props.modelValue)) {
    const [start, end] = props.modelValue as [Date, Date]
    if (start && isSameDay(date, start)) return true
    if (end && isSameDay(date, end)) return true
    return false
  }
  
  if (props.mode === 'multiple' && Array.isArray(props.modelValue)) {
    return (props.modelValue as Date[]).some(d => isSameDay(date, d))
  }
  
  return false
}

function isInRange(date: Date): boolean {
  if (props.mode !== 'range') return false
  
  let start: Date | null = null
  let end: Date | null = null
  
  if (rangeStart.value && hoverDate.value) {
    start = rangeStart.value < hoverDate.value ? rangeStart.value : hoverDate.value
    end = rangeStart.value < hoverDate.value ? hoverDate.value : rangeStart.value
  } else if (Array.isArray(props.modelValue) && props.modelValue.length === 2) {
    [start, end] = props.modelValue as [Date, Date]
  }
  
  if (!start || !end) return false
  
  return date > start && date < end
}

function isRangeStart(date: Date): boolean {
  if (props.mode !== 'range') return false
  
  if (rangeStart.value && !hoverDate.value) {
    return isSameDay(date, rangeStart.value)
  }
  
  if (Array.isArray(props.modelValue) && props.modelValue.length >= 1) {
    const start = props.modelValue[0] as Date
    return isSameDay(date, start)
  }
  
  return false
}

function isRangeEnd(date: Date): boolean {
  if (props.mode !== 'range') return false
  
  if (Array.isArray(props.modelValue) && props.modelValue.length === 2) {
    const end = props.modelValue[1] as Date
    return isSameDay(date, end)
  }
  
  return false
}

function isDateDisabled(date: Date): boolean {
  // Check weekday
  if (props.disabledWeekdays?.includes(date.getDay())) {
    return true
  }
  
  // Check min date
  if (props.minDate) {
    const min = new Date(props.minDate)
    min.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    if (checkDate < min) return true
  }
  
  // Check max date
  if (props.maxDate) {
    const max = new Date(props.maxDate)
    max.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    if (checkDate > max) return true
  }
  
  // Check disabled dates
  if (props.disabledDates) {
    if (typeof props.disabledDates === 'function') {
      return props.disabledDates(date)
    }
    return props.disabledDates.some(d => isSameDay(date, d))
  }
  
  return false
}

// Actions
function createRipple(event: MouseEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  
  const id = rippleId++
  ripples.value.push({ id, x, y, size })
  
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id)
  }, 600)
}

function selectDate(date: Date, event?: MouseEvent) {
  if (isDateDisabled(date)) return
  
  if (event?.currentTarget) {
    createRipple(event, event.currentTarget as HTMLElement)
  }
  
  const selectedDate = new Date(date)
  if (props.enableTime) {
    selectedDate.setHours(selectedHour.value, selectedMinute.value)
  }
  
  if (props.mode === 'single') {
    emit('update:modelValue', selectedDate)
    if (props.closeOnSelect && !props.enableTime) {
      close()
    }
  } else if (props.mode === 'range') {
    if (!rangeStart.value) {
      rangeStart.value = selectedDate
      emit('update:modelValue', [selectedDate] as any)
    } else {
      const start = rangeStart.value
      const end = selectedDate
      const sortedRange: [Date, Date] = start < end ? [start, end] : [end, start]
      emit('update:modelValue', sortedRange)
      rangeStart.value = null
      if (props.closeOnSelect && !props.enableTime) {
        close()
      }
    }
  } else if (props.mode === 'multiple') {
    const current = (props.modelValue as Date[]) || []
    const existingIndex = current.findIndex(d => isSameDay(d, selectedDate))
    
    if (existingIndex >= 0) {
      const newDates = [...current]
      newDates.splice(existingIndex, 1)
      emit('update:modelValue', newDates)
    } else {
      emit('update:modelValue', [...current, selectedDate])
    }
  }
}

function previousMonth() {
  const newDate = new Date(viewDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  viewDate.value = newDate
  emit('monthChange', newDate.getMonth(), newDate.getFullYear())
}

function nextMonth() {
  const newDate = new Date(viewDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  viewDate.value = newDate
  emit('monthChange', newDate.getMonth(), newDate.getFullYear())
}

function setMonth(month: number) {
  const newDate = new Date(viewDate.value)
  newDate.setMonth(month)
  viewDate.value = newDate
  emit('monthChange', month, newDate.getFullYear())
}

function setYear(year: number) {
  const newDate = new Date(viewDate.value)
  newDate.setFullYear(year)
  viewDate.value = newDate
  emit('yearChange', year)
}

function goToToday() {
  viewDate.value = new Date()
}

function clear(event?: Event) {
  event?.stopPropagation()
  emit('update:modelValue', null)
  rangeStart.value = null
  emit('clear')
}

function updateDropdownPosition() {
  if (!triggerRef.value) return
  
  const rect = triggerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top
  const dropdownHeight = 380
  
  if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
    dropdownPosition.value = {
      top: rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 320),
      placement: 'bottom'
    }
  } else {
    dropdownPosition.value = {
      bottom: viewportHeight - rect.top + 8,
      left: rect.left,
      width: Math.max(rect.width, 320),
      placement: 'top'
    }
  }
}

function open() {
  if (props.disabled || props.readonly) return
  isOpen.value = true
  updateDropdownPosition()
  emit('open')
  
  // Set view to current selection or today
  if (props.modelValue instanceof Date) {
    viewDate.value = new Date(props.modelValue)
    if (props.enableTime) {
      selectedHour.value = props.modelValue.getHours()
      selectedMinute.value = props.modelValue.getMinutes()
    }
  } else if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
    viewDate.value = new Date(props.modelValue[0])
    if (props.enableTime && props.modelValue[0] instanceof Date) {
      selectedHour.value = props.modelValue[0].getHours()
      selectedMinute.value = props.modelValue[0].getMinutes()
    }
  } else {
    viewDate.value = new Date()
  }
  
  nextTick(() => {
    window.addEventListener('scroll', updateDropdownPosition, true)
    window.addEventListener('resize', updateDropdownPosition)
  })
}

function close() {
  isOpen.value = false
  if (props.mode === 'range' && rangeStart.value) {
    // If we only selected start, clear the selection
    rangeStart.value = null
  }
  emit('close')
  window.removeEventListener('scroll', updateDropdownPosition, true)
  window.removeEventListener('resize', updateDropdownPosition)
}

function toggle() {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

function handleFocus() {
  isFocused.value = true
}

function handleBlur(event: FocusEvent) {
  const relatedTarget = event.relatedTarget as HTMLElement
  if (calendarRef.value?.contains(relatedTarget)) return
  isFocused.value = false
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (triggerRef.value?.contains(target)) return
  if (calendarRef.value?.contains(target)) return
  close()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
    triggerRef.value?.focus()
  } else if (event.key === 'Enter' || event.key === ' ') {
    if (!isOpen.value) {
      event.preventDefault()
      open()
    }
  }
}

function handleDayHover(date: Date) {
  if (props.mode === 'range' && rangeStart.value) {
    hoverDate.value = date
  }
}

function handleDayLeave() {
  hoverDate.value = null
}

// Time picker
function adjustHour(delta: number) {
  selectedHour.value = (selectedHour.value + delta + 24) % 24
  isAM.value = selectedHour.value < 12
  updateTimeOnSelection()
}

function adjustMinute(delta: number) {
  selectedMinute.value = (selectedMinute.value + delta + 60) % 60
  updateTimeOnSelection()
}

function handleHourInput(event: Event) {
  const input = event.target as HTMLInputElement
  const rawValue = input.value.replace(/\D/g, '') // Only digits
  
  if (!rawValue) {
    return
  }
  
  let value = parseInt(rawValue, 10)
  
  if (props.timeFormat === '12h') {
    // For 12h format, input is 1-12
    value = Math.max(1, Math.min(12, value))
    // Convert to 24h format for internal storage
    if (isAM.value) {
      selectedHour.value = value === 12 ? 0 : value
    } else {
      selectedHour.value = value === 12 ? 12 : value + 12
    }
  } else {
    // For 24h format, input is 0-23
    value = Math.max(0, Math.min(23, value))
    selectedHour.value = value
  }
  
  updateTimeOnSelection()
}

function handleMinuteInput(event: Event) {
  const input = event.target as HTMLInputElement
  const rawValue = input.value.replace(/\D/g, '') // Only digits
  
  if (!rawValue) {
    return
  }
  
  let value = parseInt(rawValue, 10)
  value = Math.max(0, Math.min(59, value))
  selectedMinute.value = value
  updateTimeOnSelection()
}

function handleHourWheel(event: WheelEvent) {
  event.preventDefault()
  const delta = event.deltaY < 0 ? 1 : -1
  adjustHour(delta)
}

function handleMinuteWheel(event: WheelEvent) {
  event.preventDefault()
  const delta = event.deltaY < 0 ? props.minuteStep : -props.minuteStep
  adjustMinute(delta)
}

function toggleAMPM() {
  isAM.value = !isAM.value
  if (isAM.value && selectedHour.value >= 12) {
    selectedHour.value -= 12
  } else if (!isAM.value && selectedHour.value < 12) {
    selectedHour.value += 12
  }
  updateTimeOnSelection()
}

function displayHour(): string {
  if (props.timeFormat === '12h') {
    const h = selectedHour.value % 12 || 12
    return String(h).padStart(2, '0')
  }
  return String(selectedHour.value).padStart(2, '0')
}

// Month/Year picker methods
function selectMonthFromPicker(month: number) {
  setMonth(month)
  showMonthPicker.value = false
}

function selectYearFromPicker(year: number) {
  setYear(year)
  showYearPicker.value = false
}

function toggleMonthPicker() {
  showYearPicker.value = false
  showMonthPicker.value = !showMonthPicker.value
}

function toggleYearPicker() {
  showMonthPicker.value = false
  showYearPicker.value = !showYearPicker.value
  
  // Scroll to current year when opening
  if (showYearPicker.value) {
    nextTick(() => {
      if (yearPickerRef.value) {
        const currentYearBtn = yearPickerRef.value.querySelector('[data-current-year]') as HTMLElement
        if (currentYearBtn) {
          currentYearBtn.scrollIntoView({ block: 'center' })
        }
      }
    })
  }
}

function updateTimeOnSelection() {
  if (props.mode === 'single' && props.modelValue instanceof Date) {
    const newDate = new Date(props.modelValue)
    newDate.setHours(selectedHour.value, selectedMinute.value)
    emit('update:modelValue', newDate)
  }
}

// Watchers
watch(isOpen, (val) => {
  if (val) {
    nextTick(() => {
      document.addEventListener('mousedown', handleClickOutside)
    })
  } else {
    document.removeEventListener('mousedown', handleClickOutside)
  }
})

// Lifecycle
onMounted(() => {
  if (props.modelValue instanceof Date) {
    viewDate.value = new Date(props.modelValue)
  } else if (Array.isArray(props.modelValue) && props.modelValue.length > 0 && props.modelValue[0] instanceof Date) {
    viewDate.value = new Date(props.modelValue[0])
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('scroll', updateDropdownPosition, true)
  window.removeEventListener('resize', updateDropdownPosition)
})

// Size configurations
const sizeConfig = computed(() => {
  const sizes = {
    sm: {
      trigger: 'min-h-8 text-xs',
      padding: 'px-2 py-0.5',
      icon: 'text-sm',
      day: 'w-7 h-7 text-xs',
      label: 'text-xs mb-1'
    },
    md: {
      trigger: 'min-h-10 text-sm',
      padding: 'px-2 py-0.5',
      icon: 'text-base',
      day: 'w-9 h-9 text-sm',
      label: 'text-sm mb-1.5'
    },
    lg: {
      trigger: 'min-h-12 text-base',
      padding: 'px-2.5 py-0.5',
      icon: 'text-lg',
      day: 'w-10 h-10 text-base',
      label: 'text-base mb-2'
    }
  }
  return sizes[props.size]
})

const roundedConfig = computed(() => {
  const radii = {
    none: 'rounded-none',
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full'
  }
  return radii[props.rounded]
})

const variantStyles = computed(() => {
  const color = props.color
  
  if (props.variant === 'filled') {
    return {
      '--dp-bg': 'var(--s-accent)',
      '--dp-bg-focus': 'var(--s-accent)',
      '--dp-border': 'transparent',
      '--dp-border-focus': color
    }
  }

  if (props.variant === 'ghost') {
    return {
      '--dp-bg': 'transparent',
      '--dp-bg-focus': 'var(--s-accent)',
      '--dp-border': 'transparent',
      '--dp-border-focus': color
    }
  }

  // outlined (default)
  return {
    '--dp-bg': 'var(--s-background)',
    '--dp-bg-focus': 'var(--s-background)',
    '--dp-border': 'var(--s-border)',
    '--dp-border-focus': color
  }
})

const layoutClasses = computed(() => {
  if (props.labelPlacement === 'left') {
    return 'flex items-center gap-3'
  }
  return 'flex flex-col'
})

const teleportTarget = computed(() => {
  if (props.teleport === true) return 'body'
  if (typeof props.teleport === 'string') return props.teleport
  return undefined
})
</script>

<template>
  <div v-bind="$attrs" :class="cn(layoutClasses)">
    <!-- Label -->
    <label 
      v-if="label"
      :class="[
        'font-medium text-foreground shrink-0',
        sizeConfig.label,
        labelPlacement === 'left' ? 'mb-0' : ''
      ]"
    >
      {{ label }}
    </label>
    
    <!-- Trigger -->
    <div 
      ref="triggerRef"
      tabindex="0"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-disabled="disabled"
      class="s-datepicker-trigger relative flex items-center cursor-pointer transition-all duration-(--s-duration-normal) w-full"
      :class="[
        sizeConfig.trigger,
        sizeConfig.padding,
        roundedConfig,
        {
          'opacity-(--s-opacity-disabled) cursor-not-allowed': disabled,
          'cursor-default': readonly
        }
      ]"
      :style="variantStyles"
      @click="toggle"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    >
      <!-- Calendar icon -->
      <span 
        class="mdi mdi-calendar-blank-outline mr-2 text-muted-foreground"
        :class="sizeConfig.icon"
      />
      
      <!-- Display value -->
      <span 
        v-if="hasValue"
        class="flex-1 truncate text-foreground"
      >
        {{ displayValue }}
      </span>
      <span 
        v-else
        class="flex-1 text-muted-foreground"
      >
        {{ placeholder }}
      </span>
      
      <!-- Loading spinner -->
      <span 
        v-if="loading"
        class="mdi mdi-loading animate-spin text-muted-foreground"
        :class="sizeConfig.icon"
      />
      
      <!-- Clear button -->
      <button
        v-else-if="clearable && hasValue && !disabled && !readonly"
        type="button"
        class="p-1 -mr-1 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        @click="clear"
      >
        <span class="mdi mdi-close text-sm" />
      </button>
      
      <!-- Dropdown arrow -->
      <span
        v-else
        class="mdi transition-transform duration-(--s-duration-normal) text-muted-foreground"
        :class="[sizeConfig.icon, isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down']"
      />
    </div>
    
    <!-- Calendar Dropdown -->
    <Teleport :to="teleportTarget" :disabled="!teleport">
      <Transition
        enter-active-class="transition duration-(--s-duration-normal) ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-(--s-duration-fast) ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          ref="calendarRef"
          class="s-datepicker-calendar fixed z-50 bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
          :style="{
            top: dropdownPosition.top !== undefined ? `${dropdownPosition.top}px` : 'auto',
            bottom: dropdownPosition.bottom !== undefined ? `${dropdownPosition.bottom}px` : 'auto',
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            minWidth: '320px',
            transformOrigin: dropdownPosition.placement === 'bottom' ? 'top' : 'bottom'
          }"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-muted">
            <button
              type="button"
              class="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              @click="previousMonth"
            >
              <span class="mdi mdi-chevron-left text-lg" />
            </button>
            
            <div class="flex items-center gap-1 relative">
              <!-- Month Picker Button -->
              <button
                type="button"
                class="px-2 py-1 rounded-lg hover:bg-accent transition-colors text-foreground font-semibold flex items-center gap-1"
                @click="toggleMonthPicker"
              >
                {{ monthNames[viewDate.getMonth()] }}
                <span class="mdi mdi-chevron-down text-sm text-muted-foreground" />
              </button>
              
              <!-- Month Picker Dropdown -->
              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="showMonthPicker"
                  class="absolute top-full left-0 mt-1 z-10 bg-background border border-border rounded-lg shadow-xl p-2 grid grid-cols-3 gap-1 w-48"
                >
                  <button
                    v-for="(month, index) in monthNamesShort"
                    :key="index"
                    type="button"
                    class="px-2 py-1.5 text-sm rounded-sm transition-colors"
                    :class="[
                      viewDate.getMonth() === index 
                        ? `${activeTextClass} font-semibold`
                        : 'text-foreground hover:bg-accent'
                    ]"
                    :style="viewDate.getMonth() === index ? { backgroundColor: color } : undefined"
                    @click="selectMonthFromPicker(index)"
                  >
                    {{ month }}
                  </button>
                </div>
              </Transition>

              <!-- Year Picker Button -->
              <button
                type="button"
                class="px-2 py-1 rounded-lg hover:bg-accent transition-colors text-foreground font-semibold flex items-center gap-1"
                @click="toggleYearPicker"
              >
                {{ viewDate.getFullYear() }}
                <span class="mdi mdi-chevron-down text-sm text-muted-foreground" />
              </button>
              
              <!-- Year Picker Dropdown -->
              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="showYearPicker"
                  ref="yearPickerRef"
                  class="absolute top-full right-0 mt-1 z-10 bg-background border border-border rounded-lg shadow-xl p-2 max-h-48 overflow-y-auto w-24 scrollbar-thin"
                >
                  <button
                    v-for="year in years"
                    :key="year"
                    type="button"
                    class="w-full px-2 py-1.5 text-sm rounded-sm transition-colors text-left"
                    :class="[
                      viewDate.getFullYear() === year 
                        ? `${activeTextClass} font-semibold`
                        : 'text-foreground hover:bg-accent'
                    ]"
                    :style="viewDate.getFullYear() === year ? { backgroundColor: color } : undefined"
                    :data-current-year="viewDate.getFullYear() === year ? true : undefined"
                    @click="selectYearFromPicker(year)"
                  >
                    {{ year }}
                  </button>
                </div>
              </Transition>
            </div>
            
            <button
              type="button"
              class="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              @click="nextMonth"
            >
              <span class="mdi mdi-chevron-right text-lg" />
            </button>
          </div>
          
          <!-- Weekday headers -->
          <div class="grid grid-cols-7 px-3 py-2 border-b border-border">
            <div
              v-for="day in weekdaysOrdered"
              :key="day"
              class="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {{ day }}
            </div>
          </div>
          
          <!-- Calendar grid -->
          <div class="p-3">
            <div 
              v-for="(week, weekIndex) in weeks"
              :key="weekIndex"
              class="grid grid-cols-7 gap-0.5"
            >
              <button
                v-for="day in week"
                :key="day.date.toISOString()"
                type="button"
                class="relative flex items-center justify-center rounded-lg transition-all duration-150 overflow-hidden"
                :class="[
                  sizeConfig.day,
                  {
                    'text-muted-foreground': !day.isCurrentMonth && !day.isSelected,
                    'text-foreground': day.isCurrentMonth && !day.isSelected && !day.isDisabled,
                    'font-bold ring-2 ring-inset': day.isToday && !day.isSelected,
                    'opacity-40 cursor-not-allowed': day.isDisabled,
                    'cursor-pointer hover:bg-accent': !day.isDisabled && !day.isSelected,
                    [activeTextClass + ' font-semibold']: day.isSelected,
                    'bg-primary/15': day.isInRange && !day.isSelected,
                    'rounded-l-lg': day.isRangeStart,
                    'rounded-r-lg': day.isRangeEnd
                  }
                ]"
                :style="{
                  backgroundColor: day.isSelected ? color : undefined,
                  '--tw-ring-color': day.isToday && !day.isSelected ? color : undefined
                }"
                :disabled="day.isDisabled"
                @click="selectDate(day.date, $event)"
                @mouseenter="handleDayHover(day.date)"
                @mouseleave="handleDayLeave"
              >
                <!-- Ripple -->
                <span 
                  v-for="ripple in ripples" 
                  :key="ripple.id"
                  class="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
                  :style="{
                    left: `${ripple.x}px`,
                    top: `${ripple.y}px`,
                    width: `${ripple.size}px`,
                    height: `${ripple.size}px`
                  }"
                />
                {{ day.date.getDate() }}
              </button>
            </div>
          </div>
          
          <!-- Time picker section -->
          <div 
            v-if="enableTime"
            class="px-4 py-3 border-t border-border bg-muted"
          >
            <div class="flex items-center justify-center gap-3">
              <!-- Hour input with arrows -->
              <div class="flex flex-col items-center" @wheel="handleHourWheel">
                <button
                  type="button"
                  class="p-0.5 rounded hover:bg-accent text-muted-foreground"
                  @click="adjustHour(1)"
                >
                  <span class="mdi mdi-chevron-up text-lg" />
                </button>
                <input
                  type="text"
                  inputmode="numeric"
                  :value="displayHour()"
                  class="w-12 h-10 text-center font-mono text-xl bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxlength="2"
                  @keydown="(e: KeyboardEvent) => { if (!/^[0-9]$/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault() }"
                  @change="handleHourInput"
                  @focus="($event.target as HTMLInputElement).select()"
                />
                <button
                  type="button"
                  class="p-0.5 rounded hover:bg-accent text-muted-foreground"
                  @click="adjustHour(-1)"
                >
                  <span class="mdi mdi-chevron-down text-lg" />
                </button>
              </div>
              
              <span class="text-2xl font-bold text-foreground pb-1">:</span>
              
              <!-- Minute input with arrows -->
              <div class="flex flex-col items-center" @wheel="handleMinuteWheel">
                <button
                  type="button"
                  class="p-0.5 rounded hover:bg-accent text-muted-foreground"
                  @click="adjustMinute(minuteStep)"
                >
                  <span class="mdi mdi-chevron-up text-lg" />
                </button>
                <input
                  type="text"
                  inputmode="numeric"
                  :value="String(selectedMinute).padStart(2, '0')"
                  class="w-12 h-10 text-center font-mono text-xl bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxlength="2"
                  @keydown="(e: KeyboardEvent) => { if (!/^[0-9]$/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault() }"
                  @change="handleMinuteInput"
                  @focus="($event.target as HTMLInputElement).select()"
                />
                <button
                  type="button"
                  class="p-0.5 rounded hover:bg-accent text-muted-foreground"
                  @click="adjustMinute(-minuteStep)"
                >
                  <span class="mdi mdi-chevron-down text-lg" />
                </button>
              </div>
              
              <!-- AM/PM Toggle for 12h format -->
              <div v-if="timeFormat === '12h'" class="flex flex-col gap-1 ml-2">
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                  :class="[
                    isAM
                      ? activeTextClass
                      : 'text-muted-foreground hover:bg-accent'
                  ]"
                  :style="isAM ? { backgroundColor: color } : undefined"
                  @click="isAM || toggleAMPM()"
                >
                  AM
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                  :class="[
                    !isAM
                      ? activeTextClass
                      : 'text-muted-foreground hover:bg-accent'
                  ]"
                  :style="!isAM ? { backgroundColor: color } : undefined"
                  @click="isAM && toggleAMPM()"
                >
                  PM
                </button>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div 
            v-if="showToday || enableTime"
            class="flex items-center justify-between px-4 py-2 border-t border-border"
          >
            <button
              v-if="showToday"
              type="button"
              class="text-sm font-medium transition-colors hover:underline"
              :style="{ color }"
              @click="goToToday"
            >
              Today
            </button>
            <div v-else />
            
            <button
              v-if="enableTime"
              type="button"
              :class="['px-4 py-1.5 text-sm font-medium rounded-lg transition-colors', activeTextClass]"
              :style="{ backgroundColor: color }"
              @click="close"
            >
              Done
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.s-datepicker-trigger {
  background-color: var(--dp-bg);
  border: 1.5px solid var(--dp-border);
}

.s-datepicker-trigger:focus {
  background-color: var(--dp-bg-focus);
  border-color: var(--dp-border-focus);
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dp-border-focus) 20%, transparent);
}

/* Ripple animation */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 0.6s ease-out forwards;
}

/* Custom scrollbar for dropdowns */
.s-datepicker-calendar select {
  scrollbar-width: thin;
  scrollbar-color: var(--s-border) transparent;
}

.s-datepicker-calendar select::-webkit-scrollbar {
  width: 6px;
}

.s-datepicker-calendar select::-webkit-scrollbar-track {
  background: transparent;
}

.s-datepicker-calendar select::-webkit-scrollbar-thumb {
  background-color: var(--s-border);
  border-radius: 3px;
}
</style>

